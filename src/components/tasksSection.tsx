import type { TasksEntity } from "../types";
import { TaskCard } from "./taskCard";

type TasksSectionProps = {
	title: string;
	list: TasksEntity[];
};

export function TasksSection(props: TasksSectionProps) {
	const { title, list } = props;
	return (
		<div className="tasksSection-wrapper">
			<h2>{title}</h2>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5">
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
