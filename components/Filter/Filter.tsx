import { filterItems } from "@/data/home";
import styles from "./Filter.module.css";

export function Filter() {
  return (
    <div className={styles.filter}>
      <div className={styles.title}>Искать по:</div>
      {filterItems.map((item) => (
        <button key={item.id} type="button" className={styles.button}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
