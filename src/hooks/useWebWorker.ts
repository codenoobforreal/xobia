import { useCallback, useEffect, useRef } from "react";

export default function useWebWorker(
	scriptURL: string,
	messageHandler: (e: MessageEvent) => void,
	errorHandler?: (e: ErrorEvent) => void,
) {
	const worker = useRef<Worker>(null);

	const defaultErrorHandler = useCallback((e: ErrorEvent) => {
		console.log(e.error);
	}, []);

	useEffect(() => {
		if (!worker.current) {
			worker.current = new Worker(new URL(scriptURL, import.meta.url), {
				type: "module",
			});
		}
		worker.current.addEventListener("message", messageHandler);
		const errorUnifiedHandler = errorHandler || defaultErrorHandler;
		worker.current.addEventListener("error", errorUnifiedHandler);
		return () => {
			worker.current?.removeEventListener("message", messageHandler);
			worker.current?.removeEventListener("error", errorUnifiedHandler);
		};
	}, [defaultErrorHandler, errorHandler, messageHandler, scriptURL]);

	return worker;
}
