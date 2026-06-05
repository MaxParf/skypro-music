import styles from "./Search.module.css";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Search({ value, onChange }: SearchProps) {
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
