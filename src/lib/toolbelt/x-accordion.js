import logger from "../logger";
import { dispatch, isElementTag } from "../utils";

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
        loop: modifiers.includes("loop"),
        orientation: modifiers.includes("horizontal")
          ? "horizontal"
          : "vertical",
      });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ type: 'single' | 'multiple', loop: boolean, orientation: 'horizontal' \ 'vertical' }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        loop: config.loop,
        orientation: config.orientation || "vertical",

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
      return ["tb-accordion"];
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

      el.toolbelt = {
        toggle: () => {
          this.toggleItem(this.__item);
        },
      };
    },

    "x-id"() {
      return ["tb-accordion-trigger", "tb-accordion-content"];
    },

    "x-effect"() {
      const shouldOpen = this.openItems.has(el);

      // Only dispatch if the state has changed
      if (shouldOpen !== this.open) {
        dispatch(el, "accordion:change", {
          open: shouldOpen,
        });
      }

      this.open = shouldOpen;
    },

    ":data-state"() {
      return this.open ? "open" : "closed";
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
      return this.$id("tb-accordion-trigger");
    },

    ":aria-controls"() {
      return this.$id("tb-accordion-content");
    },

    ":aria-expanded"() {
      return this.open;
    },

    ":data-state"() {
      return this.open ? "open" : "closed";
    },

    "@click"() {
      this.toggleItem(this.__item);
    },

    "@keydown.up.prevent.stop"() {
      if (this.orientation === "vertical") {
        const index = this.triggers.indexOf(el);

        if (index >= 0) {
          const next = this.loop ? index - 1 : Math.max(index - 1, 0);
          this.triggers.at(next)?.focus();
        }
      }
    },

    "@keydown.down.prevent.stop"() {
      if (this.orientation === "vertical") {
        const index = this.triggers.indexOf(el);

        if (index >= 0) {
          const previous = this.loop
            ? (index + 1) % this.triggers.length
            : Math.min(index + 1, this.triggers.length - 1);

          this.triggers.at(previous)?.focus();
        }
      }
    },

    "@keydown.left.prevent.stop"() {
      if (this.orientation === "horizontal") {
        const index = this.triggers.indexOf(el);

        if (index >= 0) {
          const next = this.loop ? index - 1 : Math.max(index - 1, 0);
          this.triggers.at(next)?.focus();
        }
      }
    },

    "@keydown.right.prevent.stop"() {
      if (this.orientation === "horizontal") {
        const index = this.triggers.indexOf(el);

        if (index >= 0) {
          const previous = this.loop
            ? (index + 1) % this.triggers.length
            : Math.min(index + 1, this.triggers.length - 1);

          this.triggers.at(previous)?.focus();
        }
      }
    },

    "x-effect"() {
      dispatch(el, "accordion:change", {
        open: this.open,
      });
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
      return this.$id("tb-accordion-content");
    },

    role: "region",

    ":aria-labelledby"() {
      return this.$id("tb-accordion-trigger");
    },

    ":data-state"() {
      return this.open ? "open" : "closed";
    },

    "x-show"() {
      return this.open;
    },

    "x-effect"() {
      dispatch(el, "accordion:change", {
        open: this.open,
      });
    },
  });
}
