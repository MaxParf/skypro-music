import type { ReactNode } from "react";
import { Bar } from "@/components/Bar/Bar";
import { PlayerProvider } from "@/components/PlayerProvider/PlayerProvider";

type MusicRoutesLayoutProps = {
  children: ReactNode;
};

export default function MusicRoutesLayout({
  children,
}: MusicRoutesLayoutProps) {
  return (
    <PlayerProvider>
      {children}
      <Bar />
    </PlayerProvider>
  );
}
