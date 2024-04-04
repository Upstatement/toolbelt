import starlightPlugin from "@astrojs/starlight-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: {
          200: "#aec8ff",
          600: "#1a51ff",
          900: "#0c2877",
          950: "#0c1f50",
        },
        gray: {
          100: "#f2f6ff",
          200: "#e5eeff",
          300: "#b3c3df",
          400: "#6f8bc1",
          500: "#3e5789",
          700: "#1f3665",
          800: "#0e2451",
          900: "#0d182c",
        },
      },
    },
  },
  plugins: [starlightPlugin()],
};
