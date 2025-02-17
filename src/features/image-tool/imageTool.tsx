import { type DragEvent, useCallback } from "react";
import InteractiveCanvas from "./components/interactiveCanvas";
import StaticCanvas from "./components/staticCanvas";
import { imageToolStore } from "./state";

export default function ImageTool() {
	const canvasWrapperRef = useCallback((node: HTMLDivElement) => {
		if (!node) {
			return;
		}
		const { left, top } = node.getBoundingClientRect();
		imageToolStore.trigger.setCanvasWrapperOffsets({
			newCanvasOffsets: {
				offsetTop: top,
				offsetLeft: left,
			},
		});
	}, []);

	function handleNotSupportImage(item: DataTransferItem | File) {
		if (!["image/png", "image/jpeg"].includes(item.type)) {
			// TODO: not support image extension
			return;
		}
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const allSupportImages: File[] = [];
		if (e.dataTransfer.items) {
			for (const item of [...e.dataTransfer.items]) {
				if (item.kind !== "file") {
					// TODO: not file
					return;
				}
				handleNotSupportImage(item);
				const supportedImageFile = item.getAsFile();
				if (supportedImageFile) {
					allSupportImages.push(supportedImageFile);
				} else {
					console.error("can't access file");
				}
			}
		} else {
			for (const file of [...e.dataTransfer.files]) {
				handleNotSupportImage(file);
				allSupportImages.push(file);
			}
		}
		imageToolStore.trigger.dropFilesSuccess({
			files: allSupportImages,
			coord: {
				clientX: e.clientX,
				clientY: e.clientY,
			},
		});
	}
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	return (
		<div
			className="grid"
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			ref={canvasWrapperRef}
		>
			<StaticCanvas />
			<InteractiveCanvas />
		</div>
	);
}
