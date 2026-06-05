"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/store/hooks";
import {
  playNextTrack,
  playPreviousTrack,
  setCurrentTime,
  setCurrentTrack,
  setDuration,
  setIsPlaying,
  setPlaylist,
} from "@/store/playerSlice";
import type { Track } from "@/types/track";

type PlayerContextValue = {
  isPlaying: boolean;
  currentTrackId: number | null;
  selectTrack: (track: Track, playlist?: Track[]) => void;
  togglePlayback: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

type PlayerProviderProps = {
  children: ReactNode;
};

const syncTrackSource = (audio: HTMLAudioElement, track: Track) => {
  if (audio.dataset.trackId === String(track.id)) {
    return;
  }

  audio.src = track.audioSrc;
  audio.dataset.trackId = String(track.id);
  audio.load();
};

export function PlayerProvider({ children }: PlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { currentTrack, isLoop, isPlaying, volume } = useAppSelector(
    (state) => state.player,
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute("src");
      delete audio.dataset.trackId;
      audio.load();
      dispatch(setCurrentTime(0));
      dispatch(setDuration(0));
      return;
    }

    const trackChanged = audio.dataset.trackId !== String(currentTrack.id);

    if (trackChanged) {
      syncTrackSource(audio, currentTrack);
    }

    if (isPlaying && (trackChanged || audio.paused)) {
      void audio
        .play()
        .catch(() => {
          dispatch(setIsPlaying(false));
        });
    }

    if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [currentTrack, isPlaying, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  const selectTrack = (track: Track, playlist?: Track[]) => {
    if (playlist) {
      dispatch(setPlaylist(playlist));
    }

    dispatch(setCurrentTrack(track));
    dispatch(setIsPlaying(true));
  };

  const togglePlayback = () => {
    if (!currentTrack) {
      return;
    }

    if (isPlaying) {
      dispatch(setIsPlaying(false));
      return;
    }

    dispatch(setIsPlaying(true));
  };

  const playNext = () => {
    const previousTrackId = store.getState().player.currentTrack?.id ?? null;

    dispatch(playNextTrack());

    const nextTrackId = store.getState().player.currentTrack?.id ?? null;

    if (nextTrackId !== previousTrackId) {
      dispatch(setIsPlaying(true));
    }
  };

  const playPrevious = () => {
    const previousTrackId = store.getState().player.currentTrack?.id ?? null;

    dispatch(playPreviousTrack());

    const nextTrackId = store.getState().player.currentTrack?.id ?? null;

    if (nextTrackId !== previousTrackId) {
      dispatch(setIsPlaying(true));
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = time;
    dispatch(setCurrentTime(time));
  };

  const handlePlay = () => {
    dispatch(setIsPlaying(true));
  };

  const handlePause = () => {
    dispatch(setIsPlaying(false));
  };

  const handleEnded = () => {
    const audio = audioRef.current;

    if (!audio) {
      dispatch(setIsPlaying(false));
      return;
    }

    if (isLoop && currentTrack) {
      audio.currentTime = 0;
      dispatch(setCurrentTime(0));
      void audio.play().catch(() => {
        dispatch(setIsPlaying(false));
      });
      return;
    }

    const previousTrackId = store.getState().player.currentTrack?.id ?? null;

    dispatch(playNextTrack());

    const nextState = store.getState().player;
    const nextTrackId = nextState.currentTrack?.id ?? null;

    if (nextTrackId !== previousTrackId) {
      dispatch(setIsPlaying(true));
      return;
    }

    dispatch(setCurrentTime(0));
    dispatch(setIsPlaying(false));
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    dispatch(setCurrentTime(audio.currentTime));
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    dispatch(setDuration(audio.duration));
  };

  const handleError = () => {
    dispatch(setIsPlaying(false));
  };

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (!audio) {
        return;
      }

      audio.pause();
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrackId: currentTrack?.id ?? null,
        selectTrack,
        togglePlayback,
        playNext,
        playPrevious,
        seekTo,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        hidden
        preload="metadata"
        onEnded={handleEnded}
        onError={handleError}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (context === null) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }

  return context;
}
