import Image from "next/image";
import Link from "next/link";
import { sidebarPlaylists } from "@/data/home";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.personal}>
        <p className={styles.personalName}>Sergey.Ivanov</p>
        <div className={styles.icon}>
          <svg className={styles.iconSvg}>
            <use xlinkHref="/img/icon/sprite.svg#logout" />
          </svg>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.list}>
          {sidebarPlaylists.map((playlist) => (
            <div key={playlist.id} className={styles.item}>
              <Link className={styles.link} href="#">
                <Image
                  className={styles.image}
                  src={playlist.src}
                  alt={playlist.alt}
                  width={250}
                  height={150}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
