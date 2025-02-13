import { createFileRoute } from "@tanstack/react-router";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { RawImage } from "@huggingface/transformers";
import { ImageDropBox } from "../components/dropBox";

import useWebWorker from "../hooks/useWebWorker";

import "./image-to-image.css";

export const Route = createFileRoute("/image-to-image")({
	component: ImageToImage,
});

function ImageToImage() {
	const currentProcessImageObjUrl = useRef<string>("");
	const [disabled, setDisabled] = useState<boolean>(false);
	const [outputImage, setOutputImageSrc] = useState<string>("");

	const releaseImageObjUrl = useCallback(() => {
		if (currentProcessImageObjUrl.current) {
			URL.revokeObjectURL(currentProcessImageObjUrl.current);
		}
	}, []);

	const workerOnMessageHandler = useCallback(async (e: MessageEvent) => {
		switch (e.data.status) {
			case "initiate":
				console.log("initial", e.data);
				break;
			case "progress":
				console.log("progress", e.data);
				break;
			case "done":
				console.log("done", e.data);
				break;
			case "ready":
				console.log("ready", e.data);
				break;
			case "complete": {
				console.log("complete", e.data);
				const blob = await (e.data.output as unknown as RawImage).toBlob();
				const reader = new FileReader();
				reader.onload = (e) => {
					setOutputImageSrc(e.target?.result as string);
				};
				reader.readAsDataURL(blob);
				setDisabled(false);
				break;
			}
			default:
				console.log(`unknown message type: ${e.data.status}`);
				break;
		}
	}, []);

	const worker = useWebWorker(
		"../features/image-to-image/superResolution.js",
		workerOnMessageHandler,
	);

	useEffect(() => {
		return () => releaseImageObjUrl();
	}, [releaseImageObjUrl]);

	async function handleImageFileSelect(e: ChangeEvent<HTMLInputElement>) {
		releaseImageObjUrl();

		if (disabled) {
			return;
		}

		if (e.target.files?.item(0)) {
			currentProcessImageObjUrl.current = URL.createObjectURL(
				e.target.files.item(0) as File,
			);
			worker.current?.postMessage(
				await RawImage.fromURL(currentProcessImageObjUrl.current),
			);
			setDisabled(true);
		}
		// select nothing
	}

	function handleExampleClick(imageSrc: string) {
		setDisabled(true);
		currentProcessImageObjUrl.current = imageSrc;
		worker.current?.postMessage(imageSrc);
	}

	return (
		<div className="index-wrapper">
			<ImageDropBox onChangeHandler={handleImageFileSelect} />

			{currentProcessImageObjUrl.current && outputImage && (
				<div className="result">
					{/* biome-ignore lint/a11y/noRedundantAlt: <explanation> */}
					<img src={currentProcessImageObjUrl.current} alt="original image" />
					{/* biome-ignore lint/a11y/noRedundantAlt: <explanation> */}
					<img src={outputImage} alt="super resolution result image" />
				</div>
			)}

			<div className="ImageToImage-examples">
				{["baby", "bird", "butterfly", "head", "woman"].map((name) => {
					const src = `/image-to-image/${name}.png`;
					return (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<img
							className="ImageToImage-exampleImage"
							onClick={() => {
								handleExampleClick(src);
							}}
							key={name}
							src={src}
							// biome-ignore lint/a11y/noRedundantAlt: <explanation>
							alt="example image"
						/>
					);
				})}
			</div>
		</div>
	);
}
