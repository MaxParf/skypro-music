import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Track } from "@/types/track";
import { Centerblock } from "@/components/Centerblock/Centerblock";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/components/Track/Track", () => ({
  Track: ({
    track,
  }: {
    track: Track;
  }) => <div data-testid="track-row">{track.title}</div>,
}));

const { usePathname } = jest.requireMock("next/navigation") as {
  usePathname: jest.Mock;
};

const makeTrack = (
  id: number,
  title: string,
  author: string,
  genre: string,
  releaseYear: number | null,
): Track => ({
  id,
  apiId: id,
  title,
  author,
  album: `Album ${id}`,
  duration: "3:00",
  durationInSeconds: 180,
  genre,
  releaseYear,
  audioSrc: `/audio/${id}.mp3`,
  favoriteUserIds: [],
  isFavorite: false,
});

const tracks: Track[] = [
  makeTrack(1, "Run Run", "Beta", "Rock", 2020),
  makeTrack(2, "I'm Fire", "Alpha", "Pop", 2024),
  makeTrack(3, "River", "Alpha", "Rock", 2019),
  makeTrack(4, "Run Away", "Alpha", "Pop", 2023),
];

const getVisibleTitles = () =>
  screen.getAllByTestId("track-row").map((item) => item.textContent);

describe("Centerblock", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/");
  });

  it("combines search, author filter, genre filter, and sorting", async () => {
    const user = userEvent.setup();

    render(<Centerblock tracks={tracks} />);

    await user.type(screen.getByRole("searchbox"), "ru");
    await user.click(screen.getByRole("button", { name: "исполнителю" }));
    await user.click(screen.getByRole("button", { name: "Alpha" }));
    await user.click(screen.getByRole("button", { name: "жанру" }));
    await user.click(screen.getByRole("button", { name: "Pop" }));
    await user.click(screen.getByRole("button", { name: "дате выпуска" }));
    await user.click(screen.getByRole("button", { name: "Сначала новые" }));

    expect(getVisibleTitles()).toEqual(["Run Away"]);
  });

  it("shows no matches message when filters return nothing", async () => {
    const user = userEvent.setup();

    render(<Centerblock tracks={tracks} />);

    await user.type(screen.getByRole("searchbox"), "zz");

    expect(screen.getByText("Нет подходящих треков")).toBeInTheDocument();
  });

  it("shows source empty message when no tracks were provided", () => {
    render(<Centerblock tracks={[]} />);

    expect(screen.getByText("Список треков пока пуст.")).toBeInTheDocument();
  });

  it("resets search and filters when pathname changes", async () => {
    const user = userEvent.setup();

    const { rerender } = render(<Centerblock tracks={tracks} />);

    await user.type(screen.getByRole("searchbox"), "ru");
    await user.click(screen.getByRole("button", { name: "исполнителю" }));
    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(getVisibleTitles()).toEqual(["Run Away"]);

    usePathname.mockReturnValue("/favorites");
    rerender(<Centerblock tracks={tracks} />);

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(getVisibleTitles()).toEqual([
      "Run Run",
      "I'm Fire",
      "River",
      "Run Away",
    ]);
  });
});
