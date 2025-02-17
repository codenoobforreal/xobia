import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";
import type { StaticElement, StaticElementWithCanvas } from "./types";

export const imageToolStore = createStoreWithProducer(produce, {
	context: {
		imageFilesToBeLoaded: [] as File[],
		fileDropCoord: {
			clientX: 0,
			clientY: 0,
		},
		canvasWrapperOffsets: {
			offsetTop: 0,
			offsetLeft: 0,
		},
		zoom: 1,
		canvasScale: window.devicePixelRatio,
	},
	on: {
		dropFilesSuccess: (
			context,
			event: {
				files: File[];
				coord: {
					clientX: number;
					clientY: number;
				};
			},
		) => {
			context.imageFilesToBeLoaded.push(...event.files);
			context.fileDropCoord = event.coord;
		},
		removeAllDropFiles: (context) => {
			context.imageFilesToBeLoaded = [];
		},
		setCanvasWrapperOffsets: (
			context,
			event: {
				newCanvasOffsets: {
					offsetTop: number;
					offsetLeft: number;
				};
			},
		) => {
			context.canvasWrapperOffsets = event.newCanvasOffsets;
		},
	},
});

imageToolStore.subscribe((snapshot) => {
	console.log("imageToolStore");
	console.log(snapshot.context);
});

export const elementWithCanvasCache = new WeakMap<
	StaticElement,
	StaticElementWithCanvas
>();
