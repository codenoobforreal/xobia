import { useSelector } from "@xstate/store/react";
import { useEffect, useRef } from "react";
import { globalStore } from "../../../store";
import { imageToolStore } from "../state";
import { renderStaticScene } from "../staticSceneRender";

export default function StaticCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const viewportDimension = useSelector(
		globalStore,
		({ context }) => context.viewportDimension,
	);
	const scrolled = useSelector(globalStore, ({ context }) => context.scrolled);
	const zoom = useSelector(imageToolStore, ({ context }) => context.zoom);
	const canvasWrapperOffsets = useSelector(
		imageToolStore,
		({ context }) => context.canvasWrapperOffsets,
	);
	const fileDropCoord = useSelector(
		imageToolStore,
		({ context }) => context.fileDropCoord,
	);
	const imageFilesToBeLoaded = useSelector(
		imageToolStore,
		({ context }) => context.imageFilesToBeLoaded,
	);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		if (!imageFilesToBeLoaded.length) {
			return;
		}
		renderStaticScene({
			imageFilesToBeLoaded,
			fileDropCoord,
			canvas: canvasRef.current,
			canvasWrapperOffsets,
			viewportDimension,
			scrolled,
			zoom,
		});
		imageToolStore.trigger.removeAllDropFiles();
	}, [
		imageFilesToBeLoaded,
		fileDropCoord,
		canvasWrapperOffsets,
		viewportDimension,
		scrolled,
		zoom,
	]);

	return (
		<canvas
			id="static-canvas"
			className="z-[1] col-start-1 col-end-2 row-start-1 row-end-2"
			ref={canvasRef}
		/>
	);
}
