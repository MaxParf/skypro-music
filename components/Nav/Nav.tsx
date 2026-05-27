"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { navItems } from "@/data/home";
import styles from "./Nav.module.css";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((currentState) => !currentState);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="#" className={styles.logoLink}>
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
        </ul>
      </div>
    </nav>
  );
}
