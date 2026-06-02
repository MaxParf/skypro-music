"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearStoredAuth } from "@/utils/authStorage";
import styles from "./Nav.module.css";

export function Nav() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const navItems = [
    { href: "/", title: "Главное" },
    { href: "/category/2", title: "Мой плейлист" },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen((currentState) => !currentState);
  };

  const handleLogout = () => {
    clearStoredAuth();
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/signin");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Image
            className={styles.logoImage}
            src="/img/logo.png"
            alt="Логотип Skypro Music"
            width={113}
            height={17}
            priority
          />
        </Link>
      </div>

      <button
        type="button"
        className={styles.burger}
        aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        onClick={handleMenuToggle}
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      <div
        id="main-menu"
        className={classNames(styles.menu, {
          [styles.menuOpen]: isMenuOpen,
        })}
      >
        <ul className={styles.menuList}>
          {navItems.map((item) => (
            <li key={item.title} className={styles.menuItem}>
              <Link href={item.href} className={styles.menuLink}>
                {item.title}
              </Link>
            </li>
          ))}
          <li className={styles.menuItem}>
            {user ? (
              <button
                type="button"
                className={classNames(styles.menuLink, styles.menuButton)}
                onClick={handleLogout}
              >
                Выйти
              </button>
            ) : (
              <Link href="/signin" className={styles.menuLink}>
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
