import type { ChangeEventHandler } from "react";

type DropBoxProps = {
	accept: string;
	onChangeHandler: ChangeEventHandler<HTMLInputElement>;
};

function DropBox(props: DropBoxProps) {
	const { accept, onChangeHandler } = props;

	return (
		<label className="block h-40 cursor-pointer">
			<input
				onChange={onChangeHandler}
				type="file"
				id="dropBox"
				name="dropBox"
				className="hidden"
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
