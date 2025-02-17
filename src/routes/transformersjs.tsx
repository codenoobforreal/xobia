import { createFileRoute } from "@tanstack/react-router";
import { TaskCategories } from "../components/taskCategories";

export const Route = createFileRoute("/transformersjs")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1>Transformers.js playground</h1>
			<TaskCategories />
		</>
	);
}
