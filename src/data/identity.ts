import type { Identity } from "./types";

/**
 * Identity data enriched with CV information
 * Data sources:
 * - Original identity.ts (maintained)
 * - CV Professional Summary (integrated)
 * - CV Technical Expertise (stats updated)
 */
export const identity: Identity = {
  name: "Omran Khaled",
  role: "MERN Stack Developer | Full-Stack Web Developer",
  location: "Damascus, Syria",
  headline:
    "I build modern, responsive, and scalable web applications with the MERN stack and beyond.",
  bio: "MERN Stack Developer specializing in building modern, responsive, and scalable web applications using MongoDB, Express.js, React, and Node.js, with additional expertise in Next.js and TypeScript. Skilled in developing reusable component systems, building RESTful APIs, integrating databases, managing application state, and connecting front-end applications with backend services. Experienced in applying modular and maintainable application architectures with strong attention to usability, accessibility, performance, and code quality. Comfortable working across the full application stack, from responsive user interfaces and client-side state management to backend services, API integration, and MongoDB data persistence.",
  fragments: [
    "Builds modern, scalable MERN applications",
    "Full-stack development with React ecosystem",
    "Ships accessible, performant web apps",
    "Designs with modular architecture",
    "Collaborates with AI as an engineering tool",
  ],
  stats: [
    { label: "Education", value: "Diploma in Computer Technologies (2022-2028)" },
    { label: "Core stack", value: "MERN · Next.js · TypeScript" },
    { label: "Location", value: "Damascus, Syria" },
    { label: "Training", value: "B4F (AKF) · Anthropic AI Certified" },
    { label: "Focus", value: "Web · AI · Systems" },
  ],
  principles: [
    "A component is a contract: props in, behaviour out, nothing hidden.",
    "Tokens before values — a colour typed by hand is a future bug.",
    "Accessibility is a requirement in the ticket, not a review comment.",
    "Performance is budgeted before it is optimised.",
  ],
};
