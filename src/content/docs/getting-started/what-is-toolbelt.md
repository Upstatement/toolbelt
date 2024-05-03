---
title: What is Toolbelt?
description: Toolbelt is a headless and unstyled component library for common accessibility patterns, built on top of Alpine.js.
---

**Toolbelt** is a headless and unstyled component library for common accessibility patterns, built on top of [Alpine.js](https://alpinejs.dev/). The library is tech-agnostic. As long as you're producing HTML, Toolbelt is compatible.

Upstatement builds websites for various brands and with various technologies but accessibility _conformance_ is a constant across our work. Toolbelt is meant to bridge the knowledge gap in our web accessibility practice by providing components that adhere to [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) and [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) patterns out of the box, regardless of the technology stack we use.

## How It Works

Toolbelt is a **client-side library** that uses Alpine "directives" (more details in the [Alpine Directives](#alpine-directives)). These directives will inject the appropriate HTML and ARIA attributes when the page loads and Toolbelt initializes. For components with interactivity, the expected behavior will be automatically handled as well.

Consider the following markup for a `<section>` element:

```html
<section x-section>
  <h2 x-section:title>This is a section title</h2>
</section>
```

On the client-side, Toolbelt will automatically add attributes to each element. Wherever you are generating the markup above, you no longer need to worry about creating unique IDs.

```html ins='aria-labelledby="tb-section-title-1"' ins='id="tb-section-title-1"'
<section x-section aria-labelledby="tb-section-title-1">
  <h2 x-section:title id="tb-section-title-1">This is a section title</h2>
</section>
```

## Alpine Directives

Toolbelt is based on Alpine's "directives", which are the `x-...` attributes embedded into HTML elements. The structure for a directive is as such:

```
x-{directive}:{value}.{modifiers...}="{expression}"
```

Not all Toolbelt components require each part of the directive. It entirely depends on the complexity and configurability of each component. Documentation for each component will outline every option available.

Here's an example of an accordion that only allows one item to be open at any time, loops keyboard navigation, and opens the first item by default:

```html
<div x-accordion.single.loop>
  <div x-accordion:item.open>
    <button x-accordion:trigger></button>
    <div x-accordion:content></div>
  </div>
  ...
</div>
```
