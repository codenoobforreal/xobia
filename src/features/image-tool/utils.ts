export const viewportCoordsToSceneCoords = (
	{ clientX, clientY }: { clientX: number; clientY: number },
	{
		zoom,
		offsetLeft,
		offsetTop,
		scrollX,
		scrollY,
	}: {
		zoom: number;
		offsetLeft: number;
		offsetTop: number;
		scrollX: number;
		scrollY: number;
	},
) => {
	// ClientX will ignore scrollX but canvas is count scrollX
	// So we need to minus scroll value
	const x = (clientX - offsetLeft) / zoom - scrollX;
	const y = (clientY - offsetTop) / zoom - scrollY;
	return { x, y };
};
