import type { Track } from "@/types/track";
import { Filter } from "@/components/Filter/Filter";
import { Playlist } from "@/components/Playlist/Playlist";
import { Search } from "@/components/Search/Search";
import styles from "./Centerblock.module.css";

type CenterblockProps = {
  title?: string;
  tracks: Track[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function Centerblock({
  title = "Треки",
  tracks,
  isLoading = false,
  error = null,
  onRetry,
}: CenterblockProps) {
  return (
    <section className={styles.centerblock}>
      <Search />
      <h2 className={styles.title}>{title}</h2>
      <Filter tracks={tracks} />
      <Playlist
        tracks={tracks}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />
    </section>
  );
}
