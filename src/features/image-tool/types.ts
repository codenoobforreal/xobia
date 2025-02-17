type BaseElement = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type ImageElement = { type: "image"; imgObj: HTMLImageElement } & BaseElement;

export type StaticElement = ImageElement;

export type StaticElementWithCanvas = {
	element: StaticElement;
	canvas: HTMLCanvasElement;
	scale: number;
};
