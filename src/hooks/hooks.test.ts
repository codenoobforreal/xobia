import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import useWebWoker from "./useWebWorker";

describe.skip("useWebWoker", () => {
	test("web worker should communicate correctly", () => {
		const { result } = renderHook(() =>
			useWebWoker("./fakerWorker.ts", (e: MessageEvent) => {
				console.log(e.data);
				switch (e.data.status) {
					case "complete":
						// expect(e.data).toBe({
						//   status: "complete",
						// });
						break;
					default:
						console.log(`unknown message type: ${e.data.status}`);
						break;
				}
			}),
		);

		const worker = result.current.current;

		act(() => {
			worker?.postMessage("complete");
		});

		expect(worker).not.toBeNull();
		worker?.terminate();
	});

	/**
	 * this test doesn't make sence and does nothing
	 */
	test.todo("web worker should return error when error happen", () => {
		const { result } = renderHook(() =>
			useWebWoker(
				"./fakerWorker.ts",
				(e: MessageEvent) => {
					switch (e.data.status) {
						case "complete":
							break;
						default:
							console.log(`unknown message type: ${e.data.status}`);
							break;
					}
				},
				(e: ErrorEvent) => {
					// this console won't log out
					console.log(e.error);
					expect(e.error).toBeNull();
				},
			),
		);

		const worker = result.current.current;

		act(() => {
			worker?.postMessage("error");
			// console.log(worker);
		});

		expect(worker).not.toBeNull();
		worker?.terminate();
	});
});
