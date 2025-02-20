import { CANVAS_AREA_LIMIT, CANVAS_WIDTH_HEIGHT_LIMIT } from "../../constants";
import {
	createMockStaticElement,
	createMockStaticElementWithCanvas,
} from "../../utils";
import { elementWithCanvasCache } from "./state";
import {
	bootstrapCanvas,
	cappedElementCanvasSize,
	drawElementFromCanvas,
	drawElementOnCanvas,
	generateElementCanvas,
	generateElementWithCanvas,
	getElementAbsoluteCoords,
	getElementInCanvasPadding,
	// loadImageFileToElement,
	renderAllStaticElements,
} from "./staticSceneRender";

describe("staticSceneRender", () => {
	describe("getElementAbsoluteCoords", () => {
		test("calculate correct centre", () => {
			const element = createMockStaticElement({});
			const calcResult = getElementAbsoluteCoords({
				element,
			});
			expect(calcResult).toHaveLength(6);
			expect(calcResult).toEqual([0, 0, 100, 100, 50, 50]);
		});
	});
	describe("getElementInCanvasPadding", () => {
		test("should return default value when no case clauses match", () => {
			const element = createMockStaticElement({});
			expect(getElementInCanvasPadding(element)).toBe(20);
		});
	});
	describe("drawElementOnCanvas", () => {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const context = document.createElement("canvas").getContext("2d")!;
		const contextSpy = vi.spyOn(context, "drawImage");
		const element = createMockStaticElement({});
		// TODO: enable this test when adding new more types to StaticElement
		test.todo("throw error when no case clauses match", () => {
			expect(() => {
				drawElementOnCanvas({
					element,
					context,
				});
			}).toThrowErrorMatchingInlineSnapshot();
		});
		test("should call drawImage when match image type", () => {
			const { imgObj, width, height } = element;
			drawElementOnCanvas({
				element,
				context,
			});
			expect(contextSpy).toHaveBeenCalled();
			expect(contextSpy).toHaveBeenCalledWith(imgObj, 0, 0, width, height);
			contextSpy.mockRestore();
		});
	});
	describe("cappedElementCanvasSize", () => {
		test("should return correct dimensions when within limits", () => {
			const element = createMockStaticElement({});
			const zoom = 1;
			const result = cappedElementCanvasSize({ element, zoom });
			expect(result.width).toBeGreaterThan(element.width);
			expect(result.height).toBeGreaterThan(element.height);
			expect(result.scale).toBe(zoom);
		});
		test("should scale down when exceeding width and height limit", () => {
			const widthExceedElement = createMockStaticElement({
				width: CANVAS_WIDTH_HEIGHT_LIMIT + 1,
			});
			const zoom = 1;
			const widthExceedResult = cappedElementCanvasSize({
				element: widthExceedElement,
				zoom,
			});
			expect(widthExceedResult.scale).toBeLessThan(zoom);
			expect(widthExceedResult.width).toBeLessThanOrEqual(
				CANVAS_WIDTH_HEIGHT_LIMIT,
			);

			const heightExceedElement = createMockStaticElement({
				height: CANVAS_WIDTH_HEIGHT_LIMIT + 1,
			});
			const heightExceedResult = cappedElementCanvasSize({
				element: heightExceedElement,
				zoom,
			});
			expect(heightExceedResult.scale).toBeLessThan(zoom);
			expect(heightExceedResult.height).toBeLessThanOrEqual(
				CANVAS_WIDTH_HEIGHT_LIMIT,
			);

			const allExceedElement = createMockStaticElement({
				width: CANVAS_WIDTH_HEIGHT_LIMIT + 1,
				height: CANVAS_WIDTH_HEIGHT_LIMIT + 1,
			});
			const allExceedResult = cappedElementCanvasSize({
				element: allExceedElement,
				zoom,
			});
			expect(allExceedResult.scale).toBeLessThan(zoom);
			expect(allExceedResult.width).toBe(4096);
			expect(allExceedResult.height).toBe(4096);
		});
		test("should scale down when exceeding area limit", () => {
			const element = createMockStaticElement({
				width: 4096,
				height: 4096,
			});
			// width * height is equal to AREA_LIMIT when zoom is 1,need to increase zoom to make test result exceed limit
			const zoom = 1.1;
			const result = cappedElementCanvasSize({ element, zoom });
			expect(result.scale).toBeLessThan(1);
			expect(result.height * result.width).toBeLessThanOrEqual(
				CANVAS_AREA_LIMIT,
			);
		});
		test("should handle extreme zoom values", () => {
			const element = createMockStaticElement({});
			const zoom = 100;
			const result = cappedElementCanvasSize({ element, zoom });
			expect(result.scale).toBeLessThan(zoom);
		});
		test("should consider device pixel ratio", () => {
			const originalDevicePixelRatio = window.devicePixelRatio;
			window.devicePixelRatio = 2;
			const element = createMockStaticElement({});
			const zoom = 1;
			const result = cappedElementCanvasSize({ element, zoom });
			expect(result.width).toBeGreaterThanOrEqual(
				element.width * window.devicePixelRatio,
			);
			expect(result.height).toBeGreaterThanOrEqual(
				element.height * window.devicePixelRatio,
			);
			window.devicePixelRatio = originalDevicePixelRatio;
		});
	});
	describe("bootstrapCanvas", () => {
		test("should set the CSS width and height correctly", () => {
			const canvas = document.createElement("canvas");
			const width = 100;
			const height = 100;
			const zoom = 1;

			const widthStr = `${width}px`;
			const heightStr = `${height}px`;
			// Set to different value to trigger update
			canvas.style.width = `${width * 2}px`;
			canvas.style.height = `${height * 2}px`;
			canvas.width = width * zoom * 2;
			canvas.height = height * zoom * 2;

			const context = bootstrapCanvas({
				canvas,
				width,
				height,
				zoom,
			});
			expect(canvas.style.width).toBe(widthStr);
			expect(canvas.style.height).toBe(heightStr);
			expect(canvas.width).toBe(width * zoom);
			expect(canvas.height).toBe(height * zoom);
			expect(context).toBeDefined();
		});
		test("should handle existing CSS and actual sizes", () => {
			const canvas = document.createElement("canvas");
			const width = 100;
			const height = 100;
			const zoom = 1;

			// Keep the same value
			const widthStr = `${width}px`;
			const heightStr = `${height}px`;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			canvas.width = width * zoom;
			canvas.height = height * zoom;

			const context = bootstrapCanvas({
				canvas,
				width,
				height,
				zoom,
			});
			expect(canvas.style.width).toBe(widthStr);
			expect(canvas.style.height).toBe(heightStr);
			expect(canvas.width).toBe(width * zoom);
			expect(canvas.height).toBe(height * zoom);
			expect(context).toBeDefined();
		});
		test("should throw an error if the canvas does not support 2D context", () => {
			const canvas = document.createElement("canvas");
			const canvasSpy = vi.spyOn(canvas, "getContext");
			canvasSpy.mockReturnValueOnce(null);
			const width = 100;
			const height = 100;
			const zoom = 1;

			expect(() =>
				bootstrapCanvas({
					canvas,
					width,
					height,
					zoom,
				}),
			).toThrowErrorMatchingInlineSnapshot(
				"[CanvasError: Canvas does not support 2D context]",
			);

			canvasSpy.mockRestore();
		});
	});
	// https://stackoverflow.com/a/61575553
	describe.todo("loadImageFileToElement", () => {});
	describe("renderAllStaticElements", () => {
		// TODO: seems like this kind of test doesn's make sence
		test("should render all static elements correctly", async () => {
			const staticElements = [createMockStaticElement({})];
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const mockContext = document.createElement("canvas").getContext("2d")!;

			expect(() => {
				renderAllStaticElements({
					staticElements,
					context: mockContext,
					scrolled: { scrollX: 0, scrollY: 0 },
					zoom: 1,
				});
			}).not.toThrowError();
		});

		test("should render all static elements correctly", async () => {
			const staticElements = [createMockStaticElement({})];
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const mockContext = document.createElement("canvas").getContext("2d")!;

			expect(() => {
				renderAllStaticElements({
					staticElements,
					context: mockContext,
					scrolled: { scrollX: 0, scrollY: 0 },
					zoom: 1,
				});
			}).not.toThrowError();
		});
	});
	describe("generateElementWithCanvas", () => {
		test("should generate a new canvas if not cached", () => {
			const element = createMockStaticElement({});
			const zoom = 1;
			const result = generateElementWithCanvas({ element, zoom });
			expect(result).toBeDefined();
			expect(result?.element).toBe(element);

			elementWithCanvasCache.delete(element);
		});
		test("should return cached canvas if available", () => {
			const element = createMockStaticElement({});
			const zoom = 1;
			const firstResult = generateElementWithCanvas({ element, zoom });
			const secondResult = generateElementWithCanvas({ element, zoom });
			expect(firstResult).toBe(secondResult);

			elementWithCanvasCache.delete(element);
		});
	});
	describe("generateElementCanvas", () => {
		test("should generate a canvas with correct dimensions", () => {
			const element = createMockStaticElement({});
			const zoom = 1;
			const result = generateElementCanvas({ element, zoom });
			expect(result).toBeDefined();
			expect(result?.canvas.width).toBeGreaterThan(element.width);
			expect(result?.canvas.height).toBeGreaterThan(element.height);
		});
		test("should return null if context is not available", () => {
			const element = createMockStaticElement({});
			const zoom = 1;
			const canvasSpy = vi.spyOn(document, "createElement");
			canvasSpy.mockReturnValueOnce({
				getContext: () => null,
			} as unknown as HTMLCanvasElement);
			expect(() => {
				generateElementCanvas({ element, zoom });
			}).toThrowErrorMatchingInlineSnapshot(
				"[CanvasError: Canvas does not support 2D context]",
			);
			canvasSpy.mockRestore();
		});
	});
	describe(drawElementFromCanvas, () => {
		test("should draw element on canvas correctly", () => {
			const mockElementWithCanvas = createMockStaticElementWithCanvas({});
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const context = document.createElement("canvas").getContext("2d")!;
			drawElementFromCanvas({
				elementWithCanvas: mockElementWithCanvas,
				context,
				scrollX,
				scrollY,
			});
			expect(vi.spyOn(context, "save")).toHaveBeenCalled();
			expect(vi.spyOn(context, "restore")).toHaveBeenCalled();
			expect(vi.spyOn(context, "drawImage")).toHaveBeenCalled();
		});

		test("should handle when elementWithCanvas.canvas is undefined or null", () => {
			const mockElementWithCanvas = createMockStaticElementWithCanvas({});
			mockElementWithCanvas.canvas = undefined as unknown as HTMLCanvasElement;
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const context = document.createElement("canvas").getContext("2d")!;
			expect(
				drawElementFromCanvas({
					elementWithCanvas: mockElementWithCanvas,
					context,
					scrollX,
					scrollY,
				}),
			).toBeUndefined();
		});
	});
});
