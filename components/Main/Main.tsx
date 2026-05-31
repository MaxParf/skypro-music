import type { ReactNode } from "react";
import styles from "./Main.module.css";

type MainProps = {
  children: ReactNode;
};

export function Main({ children }: MainProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
