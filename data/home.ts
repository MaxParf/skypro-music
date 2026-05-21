export type NavItem = {
  href: string;
  title: string;
};

export type FilterItem = {
  id: string;
  label: string;
};

export type TrackItem = {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  album: string;
  duration: string;
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
  { id: "artist", label: "исполнителю" },
  { id: "year", label: "году выпуска" },
  { id: "genre", label: "жанру" },
];

export const tracks: TrackItem[] = [
  {
    id: 1,
    title: "Guilt",
    author: "Nero",
    album: "Welcome Reality",
    duration: "4:44",
  },
  {
    id: 2,
    title: "Elektro",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
  },
  {
    id: 3,
    title: "I’m Fire",
    author: "Ali Bakgor",
    album: "I’m Fire",
    duration: "2:22",
  },
  {
    id: 4,
    title: "Non Stop",
    subtitle: "(Remix)",
    author: "Стоункат, Psychopath",
    album: "Non Stop",
    duration: "4:12",
  },
  {
    id: 5,
    title: "Run Run",
    subtitle: "(feat. AR/CO)",
    author: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    duration: "2:54",
  },
];

export const sidebarPlaylists: SidebarPlaylist[] = [
  { id: 1, src: "/img/playlist01.png", alt: "Плейлист дня 1" },
  { id: 2, src: "/img/playlist02.png", alt: "Плейлист дня 2" },
  { id: 3, src: "/img/playlist03.png", alt: "Плейлист дня 3" },
];
