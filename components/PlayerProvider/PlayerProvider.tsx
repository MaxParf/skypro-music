"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentTrack, setIsPlaying } from "@/store/playerSlice";
import type { Track } from "@/types/track";

type PlayerContextValue = {
  isPlaying: boolean;
  currentTrackId: number | null;
  selectTrack: (track: Track) => Promise<void>;
  togglePlayback: () => Promise<void>;
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
  const { currentTrack, isPlaying } = useAppSelector((state) => state.player);

  const playCurrentTrack = async () => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    syncTrackSource(audio, currentTrack);

    try {
      await audio.play();
      dispatch(setIsPlaying(true));
    } catch {
      dispatch(setIsPlaying(false));
    }
  };

  const pauseCurrentTrack = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    dispatch(setIsPlaying(false));
  };

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
      return;
    }

    syncTrackSource(audio, currentTrack);

    if (isPlaying && audio.paused) {
      void audio
        .play()
        .then(() => {
          dispatch(setIsPlaying(true));
        })
        .catch(() => {
          dispatch(setIsPlaying(false));
        });
    }

    if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [currentTrack, isPlaying, dispatch]);

  const selectTrack = async (track: Track) => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlaying(true));
  };

  const togglePlayback = async () => {
    if (!currentTrack) {
      return;
    }

    if (isPlaying) {
      pauseCurrentTrack();
      return;
    }

    await playCurrentTrack();
  };

  const handlePlay = () => {
    dispatch(setIsPlaying(true));
  };

  const handlePause = () => {
    dispatch(setIsPlaying(false));
  };

  const handleEnded = () => {
    dispatch(setIsPlaying(false));
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrackId: currentTrack?.id ?? null,
        selectTrack,
        togglePlayback,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        hidden
        preload="metadata"
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
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
