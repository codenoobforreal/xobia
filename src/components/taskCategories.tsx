import json from "../assets/all-tasks.json";
import { TasksSection } from "./tasksSection";

import "./taskCategories.css";

export function TaskCategories() {
	return (
		<div className="taskCategories-wrapper">
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
