import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Toolbelt",

      logo: {
        light: "./src/assets/toolbelt-light.svg",
        dark: "./src/assets/toolbelt-dark.svg",
        replacesTitle: true,
      },

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
            {
              label: "Installation",
              link: "/installation",
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
