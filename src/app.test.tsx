import { render } from "./test.utils";
import App from "./app";

test("App render without errors", async () => {
  render(<App />);
  expect(true).toBeTruthy();
});
