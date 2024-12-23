import { Welcome } from "~/welcome/welcome";
import { render, screen } from "./test-util";
import userEvent from "@testing-library/user-event";

test("welcome component", async () => {
  render(<Welcome />);
  await userEvent.click(screen.getByTestId("count"));
  expect(screen.getByTestId("count")).toHaveTextContent("count:1");
});
