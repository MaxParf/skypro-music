import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/data/home";
import styles from "./Nav.module.css";

export function Nav() {
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

      <button type="button" className={styles.burger} aria-label="Открыть меню">
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      <div className={styles.menu}>
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
