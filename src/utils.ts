import type {
	StaticElement,
	StaticElementWithCanvas,
} from "./features/image-tool/types";

// Custom error start
export class FileReaderError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "FileReaderError";
	}
}

export class CanvasError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "CanvasError";
	}
}
// Custom error end

// Test util start
export function createMockStaticElement(
	apply: Partial<StaticElement>,
): StaticElement {
	const {
		type = "image",
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		imgObj = new Image(),
	} = apply;
	return {
		type,
		x,
		y,
		width,
		height,
		imgObj,
	};
}

export function createMockStaticElementWithCanvas(
	apply: Partial<StaticElementWithCanvas>,
): StaticElementWithCanvas {
	const {
		element = createMockStaticElement({}),
		canvas = document.createElement("canvas"),
		scale = 1,
	} = apply;
	return { element, canvas, scale };
}
// Test util end
