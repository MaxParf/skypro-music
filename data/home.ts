import type { Track } from "@/types/track";

export type NavItem = {
  href: string;
  title: string;
};

export type FilterName = "author" | "year" | "genre";

export type FilterItem = {
  name: FilterName;
  label: string;
};

export type SidebarPlaylist = {
  id: number;
  src: string;
  alt: string;
};

export const navItems: NavItem[] = [
  { href: "#", title: "Главное" },
  { href: "#", title: "Мой плейлист" },
  { href: "#", title: "Войти" },
];

export const filterItems: FilterItem[] = [
  { name: "author", label: "исполнителю" },
  { name: "year", label: "году выпуска" },
  { name: "genre", label: "жанру" },
];

export const tracks: Track[] = [
  {
    id: 1,
    title: "Guilt",
    author: "Nero",
    album: "Welcome Reality",
    duration: "4:44",
    genre: "Dubstep",
    releaseYear: 2011,
    audioSrc: "/api/audio/1",
  },
  {
    id: 2,
    title: "Elektro",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
    genre: "Dance",
    releaseYear: 2020,
    audioSrc: "/api/audio/2",
  },
  {
    id: 3,
    title: "I’m Fire",
    author: "Ali Bakgor",
    album: "I’m Fire",
    duration: "2:22",
    genre: "House",
    releaseYear: 2021,
    audioSrc: "/api/audio/3",
  },
  {
    id: 4,
    title: "Non Stop",
    titleNote: "(Remix)",
    author: "Стоункат, Psychopath",
    album: "Non Stop",
    duration: "4:12",
    genre: "Dance",
    releaseYear: 2019,
    audioSrc: "/api/audio/4",
  },
  {
    id: 5,
    title: "Run Run",
    titleNote: "(feat. AR/CO)",
    author: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    duration: "2:54",
    genre: "House",
    releaseYear: 2022,
    audioSrc: "/api/audio/5",
  },
];

export const sidebarPlaylists: SidebarPlaylist[] = [
  { id: 1, src: "/img/playlist01.png", alt: "Плейлист дня 1" },
  { id: 2, src: "/img/playlist02.png", alt: "Плейлист дня 2" },
  { id: 3, src: "/img/playlist03.png", alt: "Плейлист дня 3" },
];
