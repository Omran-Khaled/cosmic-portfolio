import { createFileRoute } from "@tanstack/react-router";
import { UniverseExperience } from "@/features/universe/UniverseExperience";

export const Route = createFileRoute("/")({
  component: UniverseExperience,
});
