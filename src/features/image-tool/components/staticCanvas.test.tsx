// import {} from "@testing-library/react";
import { render } from "../../../rtl.setup";
import StaticCanvas from "./staticCanvas";

describe("StaticCanvas", () => {
	test("render component without crash", async () => {
		await render(<StaticCanvas />);
		expect(true).toBeTruthy();
	});
});
