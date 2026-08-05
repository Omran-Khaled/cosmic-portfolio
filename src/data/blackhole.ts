export interface BlackHolePillar {
  title: string;
  body: string;
}

export interface BlackHoleLoopStep {
  step: string;
  body: string;
}

export interface BlackHole {
  title: string;
  position: [number, number, number];
  intro: string;
  pillars: BlackHolePillar[];
  loop: BlackHoleLoopStep[];
}

export const blackHole: BlackHole = {
  title: "AI Engineering",
  position: [0, 22, -46],
  intro: "Gravity well of the system — where specification becomes software.",
  pillars: [
    {
      title: "Prompt Engineering",
      body: "Prompts written like interfaces: role, constraints, inputs, expected output shape, and refusal rules. Ambiguity removed before generation starts.",
    },
    {
      title: "AI Workflow",
      body: "Scope a task, generate a candidate, review the diff like a pull request, correct with targeted follow-ups. The engineer stays accountable for every line.",
    },
    {
      title: "Thinking System",
      body: "Decompose → constrain → generate → evaluate → integrate. AI compresses execution time; judgment about architecture and UX stays human.",
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
