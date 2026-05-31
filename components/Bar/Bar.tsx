"use client";

import classNames from "classnames";
import styles from "./Bar.module.css";
import { usePlayer } from "@/components/PlayerProvider/PlayerProvider";
import { useAppSelector } from "@/store/hooks";

export function Bar() {
  const { isPlaying, togglePlayback } = usePlayer();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const hasTrack = currentTrack !== null;

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <div className={styles.playerProgress} />

        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <button type="button" className={styles.buttonPrev}>
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
              <button type="button" className={styles.buttonNext}>
                <svg className={styles.buttonNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.buttonIcon} ${styles.buttonRepeat}`}
              >
                <svg className={styles.buttonRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.buttonIcon} ${styles.buttonShuffle}`}
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
                    {currentTrack?.title ?? "Выберите трек"}
                  </span>
                </div>

                <div className={styles.trackAlbum}>
                  <span className={styles.trackAlbumLink}>
                    {currentTrack?.author ?? "Нажмите на любой трек выше"}
                  </span>
                </div>
              </div>

              <div className={styles.likeDislike}>
                <button
                  type="button"
                  className={`${styles.buttonIcon} ${styles.trackLike}`}
                >
                  <svg className={styles.trackLikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.buttonIcon} ${styles.trackDislike}`}
                >
                  <svg className={styles.trackDislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike" />
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
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
