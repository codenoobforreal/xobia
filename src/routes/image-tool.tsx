import { createFileRoute } from "@tanstack/react-router";
import ImageTool from "../features/image-tool/imageTool";

export const Route = createFileRoute("/image-tool")({
	component: ImageTool,
});
