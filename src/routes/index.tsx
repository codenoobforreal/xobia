import { createFileRoute } from "@tanstack/react-router";

import { TaskCategories } from "../components/taskCategories";
import "./index.css";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="index-wrapper">
			<h1 className="index-title">Transformers.js playground</h1>
			<TaskCategories />
		</div>
	);
}
