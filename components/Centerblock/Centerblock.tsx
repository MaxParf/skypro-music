import { Filter } from "@/components/Filter/Filter";
import { Playlist } from "@/components/Playlist/Playlist";
import { Search } from "@/components/Search/Search";
import styles from "./Centerblock.module.css";

export function Centerblock() {
  return (
    <section className={styles.centerblock}>
      <Search />
      <h2 className={styles.title}>Треки</h2>
      <Filter />
      <Playlist />
    </section>
  );
}
