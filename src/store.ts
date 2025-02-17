import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

export const globalStore = createStoreWithProducer(produce, {
	context: {
		viewportDimension: {
			width: window.innerWidth,
			height: window.innerHeight,
		},
		scrolled: {
			scrollX: 0,
			scrollY: 0,
		},
	},
	on: {},
});

globalStore.subscribe((snapshot) => {
	console.log("globalStore");
	console.log(snapshot.context);
});
