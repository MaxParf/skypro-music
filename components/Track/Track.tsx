"use client";

import classNames from "classnames";
import { usePlayer } from "@/components/PlayerProvider/PlayerProvider";
import type { Track as TrackItem } from "@/types/track";
import styles from "./Track.module.css";

type TrackProps = {
  track: TrackItem;
};

export function Track({ track }: TrackProps) {
  const { currentTrackId, isPlaying, selectTrack } = usePlayer();
  const isCurrentTrack = currentTrackId === track.id;

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={classNames(styles.track, styles.trackButton, {
          [styles.trackActive]: isCurrentTrack,
        })}
        onClick={() => void selectTrack(track)}
        aria-pressed={isCurrentTrack}
      >
        <div className={styles.title}>
          <div className={styles.titleImage}>
            {currentTrackId === track.id && isPlaying ? (
              <span className={styles.playingDot} aria-hidden="true" />
            ) : (
              <svg className={styles.titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note" />
              </svg>
            )}
          </div>
          <div className={styles.titleText}>
            <span className={styles.titleLink}>
              {track.title}
              {track.titleNote ? (
                <>
                  {" "}
                  <span className={styles.titleSpan}>{track.titleNote}</span>
                </>
              ) : null}
            </span>
          </div>
        </div>

        <div className={styles.author}>
          <span className={styles.authorLink}>{track.author}</span>
        </div>

        <div className={styles.album}>
          <span className={styles.albumLink}>{track.album}</span>
        </div>

        <div className={styles.time}>
          <svg className={styles.timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like" />
          </svg>
          <span className={styles.timeText}>{track.duration}</span>
        </div>
      </button>
    </div>
  );
}
