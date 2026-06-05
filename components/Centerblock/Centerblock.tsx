import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Track } from "@/types/track";
import { Filter } from "@/components/Filter/Filter";
import { Playlist } from "@/components/Playlist/Playlist";
import { Search } from "@/components/Search/Search";
import {
  applyTrackQuery,
  getUniqueAuthors,
  getUniqueGenres,
  type TrackReleaseDateSort,
} from "@/utils/trackQuery";
import styles from "./Centerblock.module.css";

type CenterblockProps = {
  title?: string;
  tracks: Track[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

type QueryableCenterblockProps = CenterblockProps;

function QueryableCenterblock({
  title = "Треки",
  tracks,
  isLoading = false,
  error = null,
  onRetry,
}: QueryableCenterblockProps) {
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<TrackReleaseDateSort>("default");

  const authors = useMemo(() => getUniqueAuthors(tracks), [tracks]);
  const genres = useMemo(() => getUniqueGenres(tracks), [tracks]);
  const visibleTracks = useMemo(
    () =>
      applyTrackQuery(tracks, {
        search,
        author: selectedAuthor,
        genre: selectedGenre,
        sort,
      }),
    [search, selectedAuthor, selectedGenre, sort, tracks],
  );
  const emptyMessage =
    tracks.length === 0
      ? "Список треков пока пуст."
      : "Нет подходящих треков";

  return (
    <section className={styles.centerblock}>
      <Search value={search} onChange={setSearch} />
      <h2 className={styles.title}>{title}</h2>
      <Filter
        authors={authors}
        genres={genres}
        selectedAuthor={selectedAuthor}
        selectedGenre={selectedGenre}
        sort={sort}
        onAuthorChange={setSelectedAuthor}
        onGenreChange={setSelectedGenre}
        onSortChange={setSort}
      />
      <Playlist
        tracks={visibleTracks}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage={emptyMessage}
      />
    </section>
  );
}

export function Centerblock(props: CenterblockProps) {
  const pathname = usePathname();

  return <QueryableCenterblock key={pathname} {...props} />;
}
