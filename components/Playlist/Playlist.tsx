import { tracks } from "@/data/home";
import { Track } from "@/components/Track/Track";
import styles from "./Playlist.module.css";

export function Playlist() {
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
        {tracks.map((track) => (
          <Track key={track.id} track={track} playlist={tracks} />
        ))}
      </div>
    </div>
  );
}
