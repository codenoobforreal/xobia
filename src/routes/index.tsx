import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div>
			<div>
				{["video tool", "image tool"].map((tool) => (
					<Link
						key={tool}
						from={Route.fullPath}
						to={`./${tool.replace(" ", "-")}`}
					>
						<h1>{tool}</h1>
					</Link>
				))}
			</div>
		</div>
	);
}
