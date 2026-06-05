import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "@/components/Search/Search";

describe("Search", () => {
  it("renders controlled value and notifies about changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Search value="ru" onChange={handleChange} />);

    const input = screen.getByRole("searchbox", { name: "" });

    expect(input).toHaveValue("ru");

    await user.type(input, "n");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith("run");
  });
});
