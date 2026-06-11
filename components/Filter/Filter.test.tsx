import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filter } from "@/components/Filter/Filter";

describe("Filter", () => {
  it("renders author options and toggles author selection", async () => {
    const user = userEvent.setup();
    const handleAuthorChange = jest.fn();

    render(
      <Filter
        authors={["Alpha", "Beta"]}
        genres={["Pop"]}
        selectedAuthor={null}
        selectedGenre={null}
        sort="default"
        onAuthorChange={handleAuthorChange}
        onGenreChange={jest.fn()}
        onSortChange={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "исполнителю" }));
    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(handleAuthorChange).toHaveBeenCalledWith("Alpha");
  });

  it("renders sort options from the year popup", async () => {
    const user = userEvent.setup();
    const handleSortChange = jest.fn();

    render(
      <Filter
        authors={[]}
        genres={[]}
        selectedAuthor={null}
        selectedGenre={null}
        sort="default"
        onAuthorChange={jest.fn()}
        onGenreChange={jest.fn()}
        onSortChange={handleSortChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "дате выпуска" }));
    await user.click(screen.getByRole("button", { name: "Сначала новые" }));

    expect(handleSortChange).toHaveBeenCalledWith("newest");
  });
});
