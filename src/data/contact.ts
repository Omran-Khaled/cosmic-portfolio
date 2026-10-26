import { STATION_RADIUS, polarXZ } from "@/constants/layout";

import type { Contact } from "./types";

export const contact: Contact = {
  title: "Space Station",
  position: polarXZ(STATION_RADIUS, 130, 22),
  lines: [
    { label: "Name", value: "Omran Khaled" },
    { label: "Role", value: "MERN Stack Developer | Full-Stack Web Developer" },
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
