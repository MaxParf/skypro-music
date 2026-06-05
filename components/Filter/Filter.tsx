"use client";

import { useState } from "react";
import classNames from "classnames";
import { filterItems, type FilterName } from "@/data/home";
import type { TrackReleaseDateSort } from "@/utils/trackQuery";
import styles from "./Filter.module.css";

type FilterProps = {
  authors: string[];
  genres: string[];
  selectedAuthor: string | null;
  selectedGenre: string | null;
  sort: TrackReleaseDateSort;
  onAuthorChange: (author: string | null) => void;
  onGenreChange: (genre: string | null) => void;
  onSortChange: (sort: TrackReleaseDateSort) => void;
};

const sortOptions: Array<{ label: string; value: TrackReleaseDateSort }> = [
  { label: "По умолчанию", value: "default" },
  { label: "Сначала новые", value: "newest" },
  { label: "Сначала старые", value: "oldest" },
];

export function Filter({
  authors,
  genres,
  selectedAuthor,
  selectedGenre,
  sort,
  onAuthorChange,
  onGenreChange,
  onSortChange,
}: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const handleFilterToggle = (filterName: FilterName) => {
    setActiveFilter((currentFilter) =>
      currentFilter === filterName ? null : filterName,
    );
  };

  const filterValues = {
    author: authors,
    year: sortOptions,
    genre: genres,
  } as const;

  return (
    <div className={styles.filter}>
      <div className={styles.title}>Искать по:</div>
      {filterItems.map((item) => (
        <div key={item.name} className={styles.item}>
          <button
            type="button"
            className={classNames(styles.button, {
              [styles.active]: activeFilter === item.name,
            })}
            onClick={() => handleFilterToggle(item.name)}
          >
            {item.label}
          </button>

          {activeFilter === item.name ? (
            <div className={styles.popup}>
              <ul className={styles.list}>
                {filterValues[item.name].length > 0 ? (
                  item.name === "author"
                    ? filterValues.author.map((author) => (
                        <li key={author} className={styles.listItem}>
                          <button
                            type="button"
                            className={classNames(styles.listButton, {
                              [styles.active]: selectedAuthor === author,
                            })}
                            onClick={() =>
                              onAuthorChange(
                                selectedAuthor === author ? null : author,
                              )
                            }
                          >
                            {author}
                          </button>
                        </li>
                      ))
                    : item.name === "genre"
                      ? filterValues.genre.map((genre) => (
                          <li key={genre} className={styles.listItem}>
                            <button
                              type="button"
                              className={classNames(styles.listButton, {
                                [styles.active]: selectedGenre === genre,
                              })}
                              onClick={() =>
                                onGenreChange(selectedGenre === genre ? null : genre)
                              }
                            >
                              {genre}
                            </button>
                          </li>
                        ))
                      : filterValues.year.map((option) => (
                          <li key={option.value} className={styles.listItem}>
                            <button
                              type="button"
                              className={classNames(styles.listButton, {
                                [styles.active]: sort === option.value,
                              })}
                              onClick={() => onSortChange(option.value)}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))
                ) : (
                  <li className={styles.listItem}>
                    <span className={styles.empty}>Нет данных</span>
                  </li>
                )}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
