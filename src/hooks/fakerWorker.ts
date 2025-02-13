self.addEventListener("message", (e) => {
	if (e.data === "complete") {
		self.postMessage({
			status: "complete",
		});
	}

	throw new Error("web worker error");
});
