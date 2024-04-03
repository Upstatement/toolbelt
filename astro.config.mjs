import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Toolbelt",

      social: {
        github: "https://github.com/upstatement/toolbelt",
      },

      sidebar: [
        {
          label: "Getting Started",
          autogenerate: {
            directory: "getting-started",
          },
        },
        {
          label: "Components",
          autogenerate: {
            directory: "components",
          },
        },
      ],

      customCss: ["./src/main.css"],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
