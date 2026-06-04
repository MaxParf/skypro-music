import type { ReactNode } from "react";
import { Main } from "@/components/Main/Main";
import { Nav } from "@/components/Nav/Nav";
import { Sidebar } from "@/components/Sidebar/Sidebar";

type MusicPageLayoutProps = {
  children: ReactNode;
};

export function MusicPageLayout({ children }: MusicPageLayoutProps) {
  return (
    <Main>
      <Nav />
      {children}
      <Sidebar />
    </Main>
  );
}
