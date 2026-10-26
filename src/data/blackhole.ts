import { BLACK_HOLE_RADIUS, polarXZ } from "@/constants/layout";
import type { BlackHole } from "./types";

export const blackHole: BlackHole = {
  title: "AI Engineering",
  position: polarXZ(BLACK_HOLE_RADIUS, 270, 25),
  intro: "Gravity well of the system — where specification becomes software.",
  pillars: [
    {
      title: "AI Fluency & Literacy",
      body: "Professional certification from Anthropic covering AI literacy, responsible AI usage, prompt engineering fundamentals, effective collaboration with Large Language Models, and AI-assisted software development workflows.",
    },
    {
      title: "Prompt Engineering",
      body: "Prompts written like interfaces: role, constraints, inputs, expected output shape, and refusal rules. Ambiguity removed before generation starts.",
    },
    {
      title: "AI Workflow",
      body: "Scope a task, generate a candidate, review the diff like a pull request, correct with targeted follow-ups. The engineer stays accountable for every line.",
    },
  ],
  loop: [
    { step: "Decompose", body: "Break the request into units small enough to verify in one read." },
    {
      step: "Constrain",
      body: "State the stack, the tokens, the states and the refusals up front.",
    },
    { step: "Generate", body: "Produce a candidate — fast, disposable, never sacred." },
    { step: "Evaluate", body: "Score against criteria written before the output existed." },
    { step: "Integrate", body: "Merge only what a human would have been happy to write." },
  ],
};
