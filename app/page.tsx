import { Bar } from "@/components/Bar/Bar";
import { Centerblock } from "@/components/Centerblock/Centerblock";
import { Main } from "@/components/Main/Main";
import { Nav } from "@/components/Nav/Nav";
import { PlayerProvider } from "@/components/PlayerProvider/PlayerProvider";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <PlayerProvider>
      <Main>
        <Nav />
        <Centerblock />
        <Sidebar />
      </Main>
      <Bar />
    </PlayerProvider>
  );
}
