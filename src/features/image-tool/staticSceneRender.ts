import { FileReaderError } from "../../utils";
import { elementWithCanvasCache } from "./state";
import type { StaticElement, StaticElementWithCanvas } from "./types";
import { viewportCoordsToSceneCoords } from "./utils";

function covertimageElementToStaticElement({
	element,
	fileDropCoord,
	scrolled,
	canvasWrapperOffsets,
	zoom,
}: {
	element: HTMLImageElement;
	fileDropCoord: {
		clientX: number;
		clientY: number;
	};
	scrolled: {
		scrollX: number;
		scrollY: number;
	};
	canvasWrapperOffsets: {
		offsetLeft: number;
		offsetTop: number;
	};
	zoom: number;
}): StaticElement {
	const { x, y } = viewportCoordsToSceneCoords(fileDropCoord, {
		zoom,
		...scrolled,
		...canvasWrapperOffsets,
	});
	const { naturalHeight, naturalWidth } = element;
	return {
		type: "image",
		x,
		y,
		width: naturalWidth,
		height: naturalHeight,
		imgObj: element,
	};
}

export async function renderStaticScene({
	imageFilesToBeLoaded,
	fileDropCoord,
	canvas,
	canvasWrapperOffsets,
	viewportDimension,
	scrolled,
	zoom,
}: {
	imageFilesToBeLoaded: File[];
	fileDropCoord: { clientX: number; clientY: number };
	canvas: HTMLCanvasElement;
	canvasWrapperOffsets: {
		offsetLeft: number;
		offsetTop: number;
	};
	viewportDimension: {
		width: number;
		height: number;
	};
	scrolled: {
		scrollX: number;
		scrollY: number;
	};
	zoom: number;
}) {
	const { width, height } = viewportDimension;
	const context = bootstrapCanvas({
		canvas,
		width,
		height,
		zoom,
	});
	if (!context) {
		return;
	}
	// Apply zoom
	context.scale(zoom, zoom);
	const staticElements = await covertimagesToStaticElement({
		imageFilesToBeLoaded,
		fileDropCoord,
		canvasWrapperOffsets,
		scrolled,
		zoom,
	});
	if (!staticElements) {
		return;
	}
	renderAllStaticElements({
		staticElements,
		context,
		scrolled,
		zoom,
	});
}

async function covertimagesToStaticElement({
	imageFilesToBeLoaded,
	fileDropCoord,
	canvasWrapperOffsets,
	scrolled,
	zoom,
}: {
	imageFilesToBeLoaded: File[];
	fileDropCoord: { clientX: number; clientY: number };
	canvasWrapperOffsets: {
		offsetLeft: number;
		offsetTop: number;
	};
	scrolled: {
		scrollX: number;
		scrollY: number;
	};
	zoom: number;
}) {
	const allLoadPromises = imageFilesToBeLoaded.map((imageFile) =>
		loadImageFileToElement(imageFile),
	);
	// TODO: there will be images that failed to load because we are using allSettled here not all
	const settleResults = await Promise.allSettled(allLoadPromises);
	return settleResults
		.filter((res) => res.status === "fulfilled")
		.map((fulfilled) =>
			covertimageElementToStaticElement({
				element: fulfilled.value,
				fileDropCoord,
				scrolled,
				zoom,
				canvasWrapperOffsets,
			}),
		);
}

function renderAllStaticElements({
	staticElements,
	context,
	scrolled,
	zoom,
}: {
	staticElements: StaticElement[];
	context: CanvasRenderingContext2D;
	scrolled: {
		scrollX: number;
		scrollY: number;
	};
	zoom: number;
}) {
	const { scrollX, scrollY } = scrolled;
	for (const element of staticElements) {
		// TODO: switch statement
		const elementWithCanvas = generateElementWithCanvas({ element, zoom });
		if (!elementWithCanvas) {
			return;
		}
		// TODO: when render in low resolution,we need to adjust context.imageSmoothingEnabled
		drawElementFromCanvas({
			elementWithCanvas,
			context,
			scrollX,
			scrollY,
		});
	}
}

export function drawElementFromCanvas({
	elementWithCanvas,
	context,
	scrollX,
	scrollY,
}: {
	elementWithCanvas: StaticElementWithCanvas;
	context: CanvasRenderingContext2D;
	scrollX: number;
	scrollY: number;
}) {
	const element = elementWithCanvas.element;
	const padding = getElementInCanvasPadding(element);
	// const zoom = elementWithCanvas.scale;
	const [x1, y1, x2, y2] = getElementAbsoluteCoords({ element });
	// const cx = ((x1 + x2) / 2 + scrollX) * window.devicePixelRatio;
	// const cy = ((y1 + y2) / 2 + scrollY) * window.devicePixelRatio;
	context.save();
	// context.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
	// context.translate(cx, cy);
	// context.rotate(element.angle);
	// context.translate(-cx, -cy);
	if (!elementWithCanvas.canvas) {
		return;
	}
	context.drawImage(
		elementWithCanvas.canvas,
		(x1 + scrollX) * window.devicePixelRatio -
			(padding * elementWithCanvas.scale) / elementWithCanvas.scale,
		(y1 + scrollY) * window.devicePixelRatio -
			(padding * elementWithCanvas.scale) / elementWithCanvas.scale,
		elementWithCanvas.canvas.width / elementWithCanvas.scale,
		elementWithCanvas.canvas.height / elementWithCanvas.scale,
	);
	context.restore();
}

function loadImageFileToElement(imageFile: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				image.src = e.target.result as string;
				image.onload = () => {
					resolve(image);
				};
			} else {
				reject(new FileReaderError("Failed to read image file"));
			}
		};
		reader.onerror = (e) => {
			reject(new FileReaderError("Failed to load image", { cause: e }));
		};
		reader.readAsDataURL(imageFile);
	});
}

// https://jhildenbiddle.github.io/canvas-size/#/?id=desktop
// https://jhildenbiddle.github.io/canvas-size/#/?id=mobile
function cappedElementCanvasSize({
	element,
	zoom,
}: {
	element: StaticElement;
	zoom: number;
}) {
	const AREA_LIMIT = 16777216;
	const WIDTH_HEIGHT_LIMIT = 32767;
	const padding = getElementInCanvasPadding(element);
	// If the element is a rectangle,(x1,y1) is top left corner,(x2,y2) is the bottom right corner
	// const [x1, y1, x2, y2] = getElementAbsoluteCoords({ element });
	const elementWidth = element.width;
	const elementHeight = element.width;
	let width = elementWidth * window.devicePixelRatio + padding * 2;
	let height = elementHeight * window.devicePixelRatio + padding * 2;
	let scale = zoom;
	// rescale to ensure width and height is within limits
	if (
		width * scale > WIDTH_HEIGHT_LIMIT ||
		height * scale > WIDTH_HEIGHT_LIMIT
	) {
		scale = Math.min(WIDTH_HEIGHT_LIMIT / width, WIDTH_HEIGHT_LIMIT / height);
	}
	// rescale to ensure canvas area is within limits
	if (width * height * scale * scale > AREA_LIMIT) {
		scale = Math.sqrt(AREA_LIMIT / (width * height));
	}
	width = Math.floor(width * scale);
	height = Math.floor(height * scale);
	return { width, height, scale };
}

/**
 * top left corner,bottom right corner and
 * the center point of the element
 */
function getElementAbsoluteCoords({
	element,
}: {
	element: StaticElement;
}) {
	return [
		element.x,
		element.y,
		element.x + element.width,
		element.y + element.height,
		element.x + element.width / 2,
		element.y + element.height / 2,
	];
}

function getElementInCanvasPadding(element: StaticElement) {
	switch (element.type) {
		default:
			return 20;
	}
}

function bootstrapCanvas({
	canvas,
	width,
	height,
	zoom,
}: {
	canvas: HTMLCanvasElement;
	width: number;
	height: number;
	zoom: number;
}) {
	// Set display size in css pixels
	const widthStr = `${width}px`;
	const heightStr = `${height}px`;
	if (canvas.style.width !== widthStr) {
		canvas.style.width = widthStr;
	}
	if (canvas.style.height !== heightStr) {
		canvas.style.height = heightStr;
	}
	const scaledWidth = width * zoom;
	const scaledHeight = height * zoom;
	// When the width or height property is set the drawing buffer is always reset to blank even when they set to the same value. If you need to restore the previous content, you can save it via CanvasRenderingContext2D.getImageData() and restore it via CanvasRenderingContext2D.putImageData().
	if (canvas.width !== scaledWidth) {
		canvas.width = scaledWidth;
	}
	if (canvas.height !== scaledHeight) {
		canvas.height = scaledHeight;
	}
	const context = canvas.getContext("2d");
	if (!context) {
		return;
	}
	// Normalize coordinate system to use CSS pixels.
	context.scale(zoom, zoom);
	// TODO: apply filter,paint background
	// context.save();
	// context.filter = "";
	// context.fillStyle = "bgcolor";
	// context.fillRect(0, 0, width, height);
	// context.restore();
	return context;
}

// ElementCanvas is in memory canvas
function generateElementCanvas({
	element,
	zoom,
}: {
	element: StaticElement;
	zoom: number;
}) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const padding = getElementInCanvasPadding(element);
	if (!context) {
		return;
	}
	const { width, height, scale } = cappedElementCanvasSize({
		element,
		zoom,
	});
	if (!width || !height) {
		return null;
	}
	canvas.width = width;
	canvas.height = height;
	context.save();
	// IMPORTANT: translate happen here
	context.translate(padding * scale, padding * scale);
	context.scale(
		window.devicePixelRatio * scale,
		window.devicePixelRatio * scale,
	);
	drawElementOnCanvas({
		element,
		context,
	});
	context.restore();
	return {
		element,
		canvas,
		scale,
		zoom,
	};
}

function drawElementOnCanvas({
	element,
	context,
}: {
	element: StaticElement;
	context: CanvasRenderingContext2D;
}) {
	switch (element.type) {
		case "image": {
			const { width, height, imgObj } = element;
			context.drawImage(imgObj, 0, 0, width, height);
			break;
		}
		default:
			throw new Error(`Unimplemented type ${element.type}`);
	}
}

function generateElementWithCanvas({
	element,
	zoom,
}: { element: StaticElement; zoom: number }) {
	const prevElementWithCanvas = elementWithCanvasCache.get(element);
	if (!prevElementWithCanvas) {
		const elementWithCanvas = generateElementCanvas({ element, zoom });
		if (!elementWithCanvas) {
			return null;
		}
		elementWithCanvasCache.set(element, elementWithCanvas);
		return elementWithCanvas;
	}
	return prevElementWithCanvas;
}
