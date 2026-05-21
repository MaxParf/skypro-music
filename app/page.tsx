import { Bar } from "@/components/Bar/Bar";
import { Centerblock } from "@/components/Centerblock/Centerblock";
import { Main } from "@/components/Main/Main";
import { Nav } from "@/components/Nav/Nav";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <Main>
        <Nav />
        <Centerblock />
        <Sidebar />
      </Main>
      <Bar />
    </>
  );
}
