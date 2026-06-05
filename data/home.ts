export type FilterName = "author" | "year" | "genre";

export type FilterItem = {
  name: FilterName;
  label: string;
};

export type SidebarPlaylist = {
  id: number;
  collectionId: number;
  src: string;
  alt: string;
};

export const filterItems: FilterItem[] = [
  { name: "author", label: "исполнителю" },
  { name: "year", label: "дате выпуска" },
  { name: "genre", label: "жанру" },
];

export const sidebarPlaylists: SidebarPlaylist[] = [
  { id: 1, collectionId: 2, src: "/img/playlist01.png", alt: "Плейлист дня" },
  {
    id: 2,
    collectionId: 3,
    src: "/img/playlist02.png",
    alt: "Танцевальные хиты",
  },
  { id: 3, collectionId: 4, src: "/img/playlist03.png", alt: "Инди-заряд" },
];
