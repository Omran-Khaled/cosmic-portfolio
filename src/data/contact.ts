export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  obfuscated?: string;
}

export interface ContactLine {
  label: string;
  value: string;
}

export interface Contact {
  title: string;
  position: [number, number, number];
  lines: ContactLine[];
  channels: ContactChannel[];
}

export const contact: Contact = {
  title: "Space Station",
  position: [26, 16, 30],
  lines: [
    { label: "Name", value: "Omran Khaled" },
    { label: "Role", value: "Front-end Developer" },
    { label: "Location", value: "Damascus, Syria" },
    { label: "Availability", value: "Open to work" },
  ],
  channels: [
    { label: "GitHub", value: "@Omran-Khaled", href: "https://github.com/Omran-Khaled" },
    {
      label: "LinkedIn",
      value: "in/omran-khaled",
      href: "https://www.linkedin.com/in/omran-khaled-334726426",
    },
    {
      label: "Email",
      value: "omranhk815@gmail.com",
      href: "mailto:omranhk815@gmail.com",
      obfuscated: "omranhk815 [at] gmail [dot] com",
    },
  ],
};
