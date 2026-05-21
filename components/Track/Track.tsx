import Link from "next/link";
import type { TrackItem } from "@/data/home";
import styles from "./Track.module.css";

type TrackProps = {
  track: TrackItem;
};

export function Track({ track }: TrackProps) {
  return (
    <div className={styles.item}>
      <div className={styles.track}>
        <div className={styles.title}>
          <div className={styles.titleImage}>
            <svg className={styles.titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note" />
            </svg>
          </div>
          <div className={styles.titleText}>
            <Link className={styles.titleLink} href="#">
              {track.title}
              {track.subtitle ? (
                <>
                  {" "}
                  <span className={styles.titleSpan}>{track.subtitle}</span>
                </>
              ) : null}
            </Link>
          </div>
        </div>

        <div className={styles.author}>
          <Link className={styles.authorLink} href="#">
            {track.author}
          </Link>
        </div>

        <div className={styles.album}>
          <Link className={styles.albumLink} href="#">
            {track.album}
          </Link>
        </div>

        <div className={styles.time}>
          <svg className={styles.timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like" />
          </svg>
          <span className={styles.timeText}>{track.duration}</span>
        </div>
      </div>
    </div>
  );
}
