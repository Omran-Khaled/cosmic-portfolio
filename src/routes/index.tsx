import { createFileRoute } from "@tanstack/react-router";
import { UniverseExperience } from "@/features/universe/UniverseExperience";

const title = "Omran Khaled — Front-end Developer Universe";
const description =
  "An explorable 3D universe portfolio: skills as planets, projects as galaxies, and AI engineering as a black hole. Built by Omran Khaled in Damascus.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UniverseExperience,
});
