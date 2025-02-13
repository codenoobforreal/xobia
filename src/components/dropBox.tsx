import type { ChangeEventHandler } from "react";

import "./dropBox.css";

type DropBoxProps = {
	accept: string;
	onChangeHandler: ChangeEventHandler<HTMLInputElement>;
};

function DropBox(props: DropBoxProps) {
	const { accept, onChangeHandler } = props;

	return (
		<label htmlFor="dropBox" className="dropBox">
			<input
				onChange={onChangeHandler}
				type="file"
				id="dropBox"
				name="dropBox"
				className="dropBox-input"
				accept={accept}
			/>
		</label>
	);
}

type ImageDropBoxProps = {
	onChangeHandler: ChangeEventHandler<HTMLInputElement>;
};

export function ImageDropBox(props: ImageDropBoxProps) {
	return <DropBox accept="image/*" onChangeHandler={props.onChangeHandler} />;
}
