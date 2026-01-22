import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "ContextFort for Comet",
  version: packageJson.version,
  copyright: `© ${currentYear}, ContextFort.`,
  meta: {
    title: "ContextFort for Comet",
    description:
      "ContextFort for Comet provides visibility and controls for Perplexity Comet browser agent. Session monitoring, action blocking, and governance.",
  },
};
