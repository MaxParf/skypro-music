"use client";

import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import styles from "./Bar.module.css";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { usePlayer } from "@/components/PlayerProvider/PlayerProvider";
import {
  addTrackToFavorites,
  removeTrackFromFavorites,
} from "@/store/tracksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setVolume, toggleLoop, toggleShuffle } from "@/store/playerSlice";
import { formatTime } from "@/utils/formatTime";

export function Bar() {
  const dispatch = useAppDispatch();
  const { isPlaying, playNext, playPrevious, seekTo, togglePlayback } =
    usePlayer();
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { favoriteTracks, pendingLikeIds, tracks } = useAppSelector(
    (state) => state.tracks,
  );
  const collectionTracks = useAppSelector((state) => state.collections.tracks);
  const {
    currentTime,
    currentTrack,
    currentTrackIndex,
    duration,
    isLoop,
    isShuffle,
    playlist,
    volume,
  } = useAppSelector((state) => state.player);

  const trackLookup = useMemo(() => {
    const mappedTracks = new Map<number, (typeof tracks)[number]>();

    [...tracks, ...collectionTracks, ...favoriteTracks].forEach((track) => {
      mappedTracks.set(track.id, track);
    });

    return mappedTracks;
  }, [collectionTracks, favoriteTracks, tracks]);
  const favoriteTrackIds = useMemo(
    () =>
      new Set(
        [...tracks, ...collectionTracks, ...favoriteTracks]
          .filter((track) => track.isFavorite)
          .map((track) => track.id),
      ),
    [collectionTracks, favoriteTracks, tracks],
  );

  const resolvedCurrentTrack = currentTrack
    ? trackLookup.get(currentTrack.id) ?? currentTrack
    : null;
  const currentTrackId = resolvedCurrentTrack?.id ?? null;
  const currentTrackIsFavorite =
    currentTrackId !== null
      ? favoriteTrackIds.has(currentTrackId)
      : resolvedCurrentTrack?.isFavorite ?? false;
  const isFavoritePending =
    currentTrackId !== null && pendingLikeIds.includes(currentTrackId);
  const hasTrack = resolvedCurrentTrack !== null;
  const isPreviousDisabled =
    !hasTrack || currentTrackIndex === null || currentTrackIndex <= 0;
  const isNextDisabled =
    !hasTrack ||
    currentTrackIndex === null ||
    (!isShuffle && currentTrackIndex >= playlist.length - 1);

  const handleToggleFavorite = useCallback(async () => {
    setFavoriteError(null);

    if (!resolvedCurrentTrack) {
      return;
    }

    if (!user) {
      setFavoriteError("Войдите, чтобы добавить трек в избранное");
      return;
    }

    const action = resolvedCurrentTrack.isFavorite
      ? removeTrackFromFavorites(resolvedCurrentTrack.id)
      : addTrackToFavorites(resolvedCurrentTrack.id);

    const result = await dispatch(action);

    if (addTrackToFavorites.rejected.match(result)) {
      setFavoriteError(
        result.payload ?? "Не удалось добавить трек в избранное.",
      );
    }

    if (removeTrackFromFavorites.rejected.match(result)) {
      setFavoriteError(
        result.payload ?? "Не удалось удалить трек из избранного.",
      );
    }
  }, [dispatch, resolvedCurrentTrack, user]);

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <div className={styles.playerProgressRow}>
          <div className={styles.playerProgress}>
            <ProgressBar
              max={duration}
              value={currentTime}
              step={0.1}
              disabled={!hasTrack || duration <= 0}
              onChange={(event) => {
                seekTo(Number(event.target.value));
              }}
            />
          </div>
          <div className={styles.timeInfo}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <button
                type="button"
                className={classNames(styles.buttonPrev, {
                  [styles.buttonDisabled]: isPreviousDisabled,
                })}
                onClick={playPrevious}
                disabled={isPreviousDisabled}
                aria-label="Предыдущий трек"
              >
                <svg className={styles.buttonPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.buttonPlay, {
                  [styles.buttonDisabled]: !hasTrack,
                })}
                onClick={() => void togglePlayback()}
                disabled={!hasTrack}
                aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
              >
                <svg className={styles.buttonPlaySvg}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#${
                      isPlaying ? "icon-pause" : "icon-play"
                    }`}
                  />
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.buttonNext, {
                  [styles.buttonDisabled]: isNextDisabled,
                })}
                onClick={playNext}
                disabled={isNextDisabled}
                aria-label="Следующий трек"
              >
                <svg className={styles.buttonNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next" />
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.buttonIcon, styles.buttonRepeat, {
                  [styles.buttonActive]: isLoop,
                })}
                onClick={() => dispatch(toggleLoop())}
                aria-pressed={isLoop}
                aria-label="Повтор текущего трека"
              >
                <svg className={styles.buttonRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </button>
              <button
                type="button"
                className={classNames(styles.buttonIcon, styles.buttonShuffle, {
                  [styles.buttonActive]: isShuffle,
                })}
                onClick={() => dispatch(toggleShuffle())}
                aria-pressed={isShuffle}
                aria-label="Перемешать плейлист"
              >
                <svg className={styles.buttonShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle" />
                </svg>
              </button>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.trackContain}>
                <div className={styles.trackImage}>
                  <svg className={styles.trackSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                  </svg>
                </div>

                <div className={styles.trackAuthor}>
                  <span className={styles.trackAuthorLink}>
                    {resolvedCurrentTrack?.title ?? "Выберите трек"}
                  </span>
                </div>

                <div className={styles.trackAlbum}>
                  <span className={styles.trackAlbumLink}>
                    {resolvedCurrentTrack?.author ?? "Нажмите на любой трек выше"}
                  </span>
                </div>
              </div>

              <div className={styles.likeDislike}>
                <button
                  type="button"
                  className={classNames(styles.buttonIcon, styles.trackLike, {
                    [styles.buttonActive]: currentTrackIsFavorite,
                    [styles.buttonDisabled]: !hasTrack || isFavoritePending,
                  })}
                  onClick={() => void handleToggleFavorite()}
                  disabled={!hasTrack || isFavoritePending}
                  aria-label={
                    currentTrackIsFavorite
                      ? "Удалить трек из избранного"
                      : "Добавить трек в избранное"
                  }
                  aria-pressed={currentTrackIsFavorite}
                >
                  <svg className={styles.trackLikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume" />
                </svg>
              </div>
              <div className={styles.volumeProgress}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(volume * 100)}
                  onChange={(event) => {
                    dispatch(setVolume(Number(event.target.value) / 100));
                  }}
                  aria-label="Громкость"
                />
              </div>
            </div>
          </div>
        </div>

        {favoriteError ? <p className={styles.favoriteError}>{favoriteError}</p> : null}
      </div>
    </div>
  );
}
