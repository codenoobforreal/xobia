import { useSelector } from "@xstate/store/react";
import { type PointerEvent, useEffect } from "react";
import { globalStore } from "../../../store";
import { imageToolStore } from "../state";

export default function InteractiveCanvas() {
	const { width, height } = useSelector(
		globalStore,
		(state) => state.context.viewportDimension,
	);
	const scale = useSelector(
		imageToolStore,
		(state) => state.context.canvasScale,
	);

	function handlePointerDown(e: PointerEvent) {
		// console.log(e);
	}
	function handlePointerMove() {}
	function handleTouchMove() {}
	function handlePointerUp() {}
	function handlePointerCancel() {}
	function handleContextMenu() {}

	function renderInteractiveScene() {
		// TODO: renderInteractiveScene
	}

	useEffect(() => {
		renderInteractiveScene();
	});

	return (
		<canvas
			id="interactive-canvas"
			className="z-[2] col-start-1 col-end-2 row-start-1 row-end-2"
			style={{
				width,
				height,
			}}
			width={width * scale}
			height={height * scale}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onTouchMove={handleTouchMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			onContextMenu={handleContextMenu}
		/>
	);
}
