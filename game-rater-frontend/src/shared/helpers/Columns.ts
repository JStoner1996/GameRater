import { Game } from "../types/types";

export const columns: { key: keyof Game | "actions"; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "gameplay", label: "Gameplay" },
  { key: "story", label: "Story" },
  { key: "characters", label: "Characters" },
  { key: "fun", label: "Fun" },
  { key: "artGraphics", label: "Art / Graphics" },
  { key: "personal", label: "Personal" },
  { key: "overall", label: "Overall" },
  { key: "stars", label: "Stars" },
  { key: "yearCompleted", label: "Year Completed" },
  { key: "actions", label: "" },
];

export const numericColumns: (keyof Game)[] = [
  "gameplay",
  "story",
  "characters",
  "fun",
  "artGraphics",
  "personal",
  "overall",
  "stars",
];
