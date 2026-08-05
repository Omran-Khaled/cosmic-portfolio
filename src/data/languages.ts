export interface Language {
  name: string;
  level: string;
  strength: number;
}

export const languages: Language[] = [
  { name: "Arabic", level: "Native", strength: 1 },
  { name: "English", level: "Professional working", strength: 0.72 },
];
