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
          items: [
            {
              label: "What is Toolbelt?",
              link: "/",
            },
          ],
        },
        {
          label: "Components",
          autogenerate: {
            directory: "components",
          },
        },
      ],

      expressiveCode: {
        styleOverrides: { borderRadius: "0.375rem" },
      },

      customCss: ["./src/main.css"],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
