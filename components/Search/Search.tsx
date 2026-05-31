import styles from "./Search.module.css";

export function Search() {
  return (
    <div className={styles.search}>
      <svg className={styles.icon}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        className={styles.input}
        type="search"
        placeholder="Поиск"
        name="search"
      />
    </div>
  );
}
