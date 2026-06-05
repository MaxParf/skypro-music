"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarPlaylists } from "@/data/home";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearStoredAuth } from "@/utils/authStorage";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = useCallback(() => {
    const targetPath = pathname === "/favorites" ? "/" : "/signin";

    router.replace(targetPath);
    clearStoredAuth();
    dispatch(logout());
  }, [dispatch, pathname, router]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.personal}>
        {user ? (
          <>
            <p className={styles.personalName}>{user.username}</p>
            <button
              type="button"
              className={styles.icon}
              onClick={handleLogout}
              aria-label="Выйти"
            >
              <Image
                className={styles.iconSvg}
                src="/img/icon/logout.svg"
                alt=""
                width={40}
                height={40}
              />
            </button>
          </>
        ) : (
          <Link href="/signin" className={styles.signInLink}>
            Войти
          </Link>
        )}
      </div>

      <div className={styles.block}>
        <div className={styles.list}>
          {sidebarPlaylists.map((playlist) => (
            <div key={playlist.id} className={styles.item}>
              <Link
                className={styles.link}
                href={`/category/${playlist.collectionId}`}
              >
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
