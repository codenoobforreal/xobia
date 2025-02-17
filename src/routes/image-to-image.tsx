import { createFileRoute } from "@tanstack/react-router";
import ImageToImage from "../features/image-to-image/imageToImage";

export const Route = createFileRoute("/image-to-image")({
	component: ImageToImage,
});
