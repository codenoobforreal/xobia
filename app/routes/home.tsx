import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Index Page" },
    { name: "description", content: "Web API and AI" },
  ];
}

export default function Home() {
  return <Welcome />;
}
