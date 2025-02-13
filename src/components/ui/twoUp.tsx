import "./twoUp.css";

type TwoUpProps = {
	image: string;
};

export function TwoUp(props: TwoUpProps) {
	console.log(props);
	return <canvas className="twoup" />;
}
