import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "ContextFort Security",
  version: packageJson.version,
  copyright: `© ${currentYear}, ContextFort Security.`,
  meta: {
    title: "ContextFort Security - Real-time Incident Dashboard",
    description:
      "ContextFort Security provides real-time monitoring of POST requests and click detection to protect against data exfiltration and automated threats. Built with Next.js, Tailwind CSS, and shadcn/ui.",
  },
};
