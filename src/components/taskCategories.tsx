import json from "../assets/all-tasks.json";
import { TasksSection } from "./tasksSection";

export function TaskCategories() {
	return (
		<div className="grid gap-5">
			{json.map((category) => {
				return (
					<TasksSection
						key={category.category}
						title={category.category}
						list={category.tasks}
					/>
				);
			})}
		</div>
	);
}
