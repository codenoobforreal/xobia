import "./taskCard.css";
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
			className="taskCard"
			style={{
				cursor: isAvailable ? "pointer" : "not-allowed",
			}}
		>
			<h3 className="taskCard-title">{task}</h3>
			<p className="taskCard-model">{model}</p>
			<p className="taskCard-desc">{desc}</p>
		</Link>
	);
}
