"use client";

import { useState } from "react";
import classNames from "classnames";
import { filterItems, tracks, type FilterName } from "@/data/home";
import styles from "./Filter.module.css";

const getUniqueValues = <T,>(values: T[]): T[] => Array.from(new Set(values));

export function Filter() {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const authors = getUniqueValues(tracks.map((track) => track.author));
  const years = getUniqueValues(tracks.map((track) => track.releaseYear)).sort(
    (firstYear, secondYear) => secondYear - firstYear,
  );
  const genres = getUniqueValues(tracks.map((track) => track.genre));

  const filterValues: Record<FilterName, Array<string | number>> = {
    author: authors,
    year: years,
    genre: genres,
  };

  const handleFilterToggle = (filterName: FilterName) => {
    setActiveFilter((currentFilter) =>
      currentFilter === filterName ? null : filterName,
    );
  };

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
                {filterValues[item.name].map((value) => (
                  <li key={String(value)} className={styles.listItem}>
                    <button type="button" className={styles.listButton}>
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
