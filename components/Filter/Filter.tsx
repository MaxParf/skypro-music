"use client";

import { useMemo, useState } from "react";
import classNames from "classnames";
import { filterItems, type FilterName } from "@/data/home";
import type { Track } from "@/types/track";
import styles from "./Filter.module.css";

const getUniqueValues = <T,>(values: T[]): T[] => Array.from(new Set(values));

type FilterProps = {
  tracks: Track[];
};

export function Filter({ tracks }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const filterValues = useMemo<Record<FilterName, Array<string | number>>>(
    () => ({
      author: getUniqueValues(tracks.map((track) => track.author)),
      year: getUniqueValues(
        tracks
          .map((track) => track.releaseYear)
          .filter((year): year is number => year !== null),
      ).sort((firstYear, secondYear) => secondYear - firstYear),
      genre: getUniqueValues(tracks.map((track) => track.genre)),
    }),
    [tracks],
  );

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
                {filterValues[item.name].length > 0 ? (
                  filterValues[item.name].map((value) => (
                    <li key={String(value)} className={styles.listItem}>
                      <button type="button" className={styles.listButton}>
                        {value}
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
