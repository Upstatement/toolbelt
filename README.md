# Toolbelt

[![Netlify Status](https://api.netlify.com/api/v1/badges/ed3577eb-c502-4ab1-86f4-9db267a0086c/deploy-status)](https://app.netlify.com/sites/upstatement-toolbelt/deploys) [![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

**Toolbelt** is a headless and unstyled component library for common accessibility patterns, built on top of [Alpine.js](https://alpinejs.dev/). The library is tech-agnostic. As long as you're producing HTML, Toolbelt is compatible.

[Upstatement](https://upstatement.com/) builds websites for various brands and with various technologies but accessibility _conformance_ is a constant across our work. Toolbelt is meant to bridge the knowledge gap in our web accessibility practice by providing components that adhere to [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) and [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) patterns out of the box, regardless of the technology stack we use.

## Installation

There are two ways to install Toolbelt. In either case, it might be helpful to read through how [installation works for Alpine core](https://alpinejs.dev/essentials/installation). The following guide skips some details that are already covered in Alpine’s documentation.

### From a script tag

The easiest way to install Toolbelt is to include its CDN link. Because Toobelt is an Alpine plugin, you will have to include Alpine as a dependency. In addition, the [Focus](https://alpinejs.dev/plugins/focus) plugin is a required dependency for Toolbelt. Notice that Toolbelt and Alpine plugins come before Alpine core.

Include the following script tags in your `<head>`:

```html
<head>
  <!-- Toolbelt -->
  <script
    src="https://cdn.jsdelivr.net/npm/@upstatement/toolbelt@1.0.0-alpha/dist/plugin.cdn.js"
    defer
  ></script>

  <!-- Focus plugin (Toolbelt dependency) -->
  <script
    src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.14.7/dist/cdn.min.js"
    defer
  ></script>

  <!-- Alpine core -->
  <script
    src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.7/dist/cdn.min.js"
    defer
  ></script>
</head>
```

### As a module

If you prefer bundling Toolbelt and its dependencies in your own Javascript bundle, you can install these packages via from the npm registry.

1. Install the following packages:

   ```sh
    npm install alpinejs @alpinejs/focus @upstatement/toolbelt
   ```

1. Import and initialize the packages like so:

   ```js
   import Alpine from "alpinejs";
   import focus from "@alpinejs/focus";
   import toolbelt from "@upstatement/toolbelt";

   window.Alpine = Alpine;

   Alpine.plugin(toolbelt);
   Alpine.plugin(focus);

   Alpine.start();
   ```

## Contributing

### Repository Structure

This repository hosts the [Astro Starlight](https://starlight.astro.build/) documentation site and library files for Toolbelt.

```
toolbelt
├── public                # (Astro) Asset files
├── scripts               # (Toolbelt) Build scripts
├── src
│   ├── components        # (Astro) Components
│   ├── content           # (Astro) Markdown documentation files
│   └── lib               # (Toolbelt) Library files
│       ├── __tests__     # (Toolbelt) Test suites
│       ├── builds        # (Toolbelt) Build files (e.g. CDN, ESM)
│       └── toolbelt      # (Toolbelt) Components
├── tailwind.config.mjs   # (Astro) Tailwind configuration
└── vitest.config.js      # (Toolbelt) Vitest configuration
```

### Getting Started

1. Install and use specified Node version.

```sh
nvm use
```

2. Install repository dependencies.

```sh
npm install
```

3. If you're working on the Astro site, start the local dev server. You can view the website at `localhost:3000`

```sh
npm run dev
```

4. If you're working on Toolbelt, start the tests on watch mode. This is to encourage test-driven development (TDD).

```sh
npm run test:watch
```

### Commands

| Command                 | Action                                      |
| ----------------------- | ------------------------------------------- |
| `npm install`           | Installs dependencies                       |
| `npm run dev`           | Starts local dev server at `localhost:3000` |
| `npm run build`         | Build the production site to `./dist/`      |
| `npm run test`          | Run tests                                   |
| `npm run test:watch`    | Run tests on watch mode                     |
| `npm run package:build` | Build the production packages               |
