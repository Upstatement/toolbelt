import plugin from "tailwindcss/plugin";
import starlightPlugin from "@astrojs/starlight-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": ["0.625rem", "1rem"],
      },

      colors: {
        foreground: "#003575",

        accent: {
          200: "#b5c8f3",
          600: "#375fd9",
          900: "#1b2e63",
          950: "#152243",
          DEFAULT: "#375fd9",
        },

        gray: {
          100: "#f1f7ff",
          200: "#e3efff",
          300: "#9dc4fb",
          400: "#3a8af4",
          500: "#0054b0",
          700: "#003575",
          800: "#002454",
          900: "#001739",
        },
      },
    },
  },
  plugins: [
    starlightPlugin(),

    function({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);

      addVariant("group-hocus", [
        ":merge(.group):hover &",
        ":merge(.group):focus &",
      ]);
    },
  ],
};
