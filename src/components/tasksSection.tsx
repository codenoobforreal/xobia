import type { TasksEntity } from "../types";
import { TaskCard } from "./taskCard";

import "./tasksSection.css";

type TasksSectionProps = {
	title: string;
	list: TasksEntity[];
};

export function TasksSection(props: TasksSectionProps) {
	const { title, list } = props;
	return (
		<div className="tasksSection-wrapper">
			<h2 className="tasksSection-title">{title}</h2>
			<div className="tasksSection-grid">
				{list.map((item) => {
					return (
						<TaskCard
							key={item.task}
							task={item.task}
							model={item.model || ""}
							desc={item.description}
							supported={item.supported}
							id={item.id}
						/>
					);
				})}
			</div>
		</div>
	);
}
