"use client";

import type { ChangeEvent, CSSProperties } from "react";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  max: number;
  value: number;
  step: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function ProgressBar({
  max,
  value,
  step,
  onChange,
  disabled = false,
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const safeValue = Math.min(Math.max(value, 0), safeMax || 0);
  const progressPercent = safeMax === 0 ? 0 : (safeValue / safeMax) * 100;

  return (
    <input
      className={styles.progressBar}
      type="range"
      min={0}
      max={safeMax}
      value={safeValue}
      step={step}
      onChange={onChange}
      disabled={disabled}
      style={
        {
          "--progress-percent": `${progressPercent}%`,
        } as CSSProperties
      }
    />
  );
}
