import { RawImage } from "@huggingface/transformers";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { ImageDropBox } from "../../components/dropBox";
import useWebWorker from "../../hooks/useWebWorker";

export default function ImageToImage() {
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

	const worker = useWebWorker("./superResolution.js", workerOnMessageHandler);

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
		<div>
			<ImageDropBox onChangeHandler={handleImageFileSelect} />
			{currentProcessImageObjUrl.current && outputImage && (
				<div className="result">
					<img src={currentProcessImageObjUrl.current} alt="original" />
					<img src={outputImage} alt="super resolution result" />
				</div>
			)}
			<div className="mx-4 flex flex-wrap justify-center gap-4">
				{["baby", "bird", "butterfly", "head", "woman"].map((name) => {
					const src = `/image-to-image/${name}.png`;
					return (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<img
							className="aspect-square w-[250px] cursor-pointer object-cover"
							onClick={() => {
								handleExampleClick(src);
							}}
							key={name}
							src={src}
							alt="example"
						/>
					);
				})}
			</div>
		</div>
	);
}
