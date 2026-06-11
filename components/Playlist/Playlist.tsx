"use client";

import { Track } from "@/components/Track/Track";
import type { Track as TrackItem } from "@/types/track";
import styles from "./Playlist.module.css";

type PlaylistProps = {
  tracks: TrackItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
};

export function Playlist({
  tracks,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "Список треков пока пуст.",
}: PlaylistProps) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <div className={`${styles.column} ${styles.columnTrack}`}>Трек</div>
        <div className={`${styles.column} ${styles.columnAuthor}`}>
          Исполнитель
        </div>
        <div className={`${styles.column} ${styles.columnAlbum}`}>Альбом</div>
        <div className={`${styles.column} ${styles.columnTime}`}>
          <svg className={styles.icon}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch" />
          </svg>
        </div>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.state}>Загрузка треков...</div>
        ) : null}

        {!isLoading && error ? (
          <div className={styles.state}>
            <p>{error}</p>
            {onRetry ? (
              <button
                type="button"
                className={styles.retryButton}
                onClick={onRetry}
              >
                Попробовать снова
              </button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !error && tracks.length === 0 ? (
          <div className={styles.state}>{emptyMessage}</div>
        ) : null}

        {!isLoading && !error
          ? tracks.map((track) => (
              <Track key={track.id} track={track} playlist={tracks} />
            ))
          : null}
      </div>
    </div>
  );
}
