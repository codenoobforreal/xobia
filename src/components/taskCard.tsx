import { Link } from "@tanstack/react-router";
import { Route } from "../routes";

export type TaskCardProps = {
	task: string;
	model?: string;
	desc: string;
	supported: boolean;
	id: string;
};

export function TaskCard(props: TaskCardProps) {
	const { task, model, desc, supported, id } = props;

	const isAvailable = supported && model && model.length > 0;
	const toRouteFullPath = id.replaceAll(" ", "-");

	return (
		<Link
			from={Route.fullPath}
			to={`./${toRouteFullPath}`}
			className="grid gap-2.5 rounded-md border p-1 shadow-md"
			style={{
				cursor: isAvailable ? "pointer" : "not-allowed",
			}}
		>
			<h3>{task}</h3>
			<p>{model}</p>
			<p className="self-end">{desc}</p>
		</Link>
	);
}
