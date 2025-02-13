import { pipeline } from "@huggingface/transformers";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class ImageSuperResolution {
	static task = "image-to-image";
	static model = "Xenova/swin2SR-classical-sr-x2-64";
	static instance = null;

	static async getInstance(progress_callback = null) {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		this.instance ??= pipeline(this.task, this.model, {
			progress_callback,
			quantized: true,
		});

		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return this.instance;
	}
}

self.addEventListener("message", async (event) => {
	const upscaler = await ImageSuperResolution.getInstance((x) => {
		// We also add a progress callback to the pipeline so that we can
		// track model loading.
		self.postMessage(x);
	});

	// TODO: partial output
	const output = await upscaler(event.data);

	self.postMessage({
		status: "complete",
		output,
	});
});
