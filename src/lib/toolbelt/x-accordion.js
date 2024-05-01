import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * "x-accordion" is a vertically stacked set of interactive headings
 * that each reveal an associated section of content.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("accordion", (el, { value, modifiers }) => {
    if (value === "item") {
      handleItem(el, Alpine, { open: modifiers.includes("open") });
    } else if (value === "trigger") {
      handleTrigger(el, Alpine);
    } else if (value === "content") {
      handleContent(el, Alpine);
    } else {
      handleRoot(el, Alpine, {
        type: modifiers.includes("single") ? "single" : "multiple",
      });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ type: 'single' | 'multiple' }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        triggers: [],
        openItems: new Set(),

        toggleItem(el) {
          if (config.type === "single" && this.openItems.has(el)) {
            this.openItems.delete(el);
          } else if (config.type === "single" && !this.openItems.has(el)) {
            this.openItems.clear();
            this.openItems.add(el);
          } else if (config.type === "multiple" && this.openItems.has(el)) {
            this.openItems.delete(el);
          } else if (config.type === "multiple" && !this.openItems.has(el)) {
            this.openItems.add(el);
          }

          // Reset openItems to trigger reactivity
          this.openItems = new Set(this.openItems);
        },
      };
    },

    "x-id"() {
      return ["toolbelt-accordion"];
    },

    "@keydown.home.prevent.stop"() {
      this.triggers.at(0)?.focus();
    },

    "@keydown.end.prevent.stop"() {
      this.triggers.at(-1)?.focus();
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ open: boolean }} config
 */
function handleItem(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __item: el,

        open: config.open ?? false,
      };
    },

    "x-init"() {
      if (!this.__root) {
        logger.error(
          "x-accordion:item must be placed inside an x-accordion",
          el,
        );
      }

      if (config.open) {
        this.openItems.add(el);
      }
    },

    "x-id"() {
      return ["toolbelt-accordion-trigger", "toolbelt-accordion-content"];
    },

    "x-effect"() {
      this.open = this.openItems.has(el);
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleTrigger(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__item) {
        logger.error(
          "x-accordion:trigger must be placed inside an x-accordion:item",
          el,
        );
      }

      if (!isElementTag(el, "button")) {
        logger.error("x-accordion:trigger must be a <button> element", el);
      }

      this.triggers.push(el);
    },

    ":id"() {
      return this.$id("toolbelt-accordion-trigger");
    },

    ":aria-controls"() {
      return this.$id("toolbelt-accordion-content");
    },

    ":aria-expanded"() {
      return this.open;
    },

    "@click"() {
      this.toggleItem(this.__item);
    },

    "@keydown.up.prevent.stop"() {
      const index = this.triggers.indexOf(el);

      if (index >= 0) {
        this.triggers.at(index - 1)?.focus();
      }
    },

    "@keydown.down.prevent.stop"() {
      const index = this.triggers.indexOf(el);

      if (index >= 0) {
        this.triggers.at((index + 1) % this.triggers.length)?.focus();
      }
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleContent(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__item) {
        logger.error(
          "x-accordion:content must be placed inside an x-accordion:item",
          el,
        );
      }
    },

    ":id"() {
      return this.$id("toolbelt-accordion-content");
    },

    role: "region",

    ":aria-labelledby"() {
      return this.$id("toolbelt-accordion-trigger");
    },

    "x-show"() {
      return this.open;
    },
  });
}
