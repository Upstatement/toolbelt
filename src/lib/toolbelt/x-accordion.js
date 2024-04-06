import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * "x-accordion" is a vertically stacked set of interactive headings
 * that each reveal an associated section of content.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("accordion", (el, { value }) => {
    if (value === "item") {
      handleItem(el, Alpine);
    } else if (value === "trigger") {
      handleTrigger(el, Alpine);
    } else if (value === "content") {
      handleContent(el, Alpine);
    } else {
      handleRoot(el, Alpine);
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleRoot(el, Alpine) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: true,
      };
    },

    "@keydown.home.prevent.stop"() {
      el.querySelector("[x-accordion\\:item] [x-accordion\\:trigger]")?.focus();
    },

    "@keydown.end.prevent.stop"() {
      el.querySelector(
        "[x-accordion\\:item]:last-of-type [x-accordion\\:trigger]",
      )?.focus();
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleItem(el, Alpine) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        open: false,
        __item: true,
      };
    },

    "x-init"() {
      if (!this.__root) {
        logger.error(
          "x-accordion:item must be placed inside an x-accordion",
          el,
        );
      }
    },

    "x-id"() {
      return ["toolbelt-accordion-trigger", "toolbelt-accordion-content"];
    },

    "@keydown.up.prevent.stop"() {
      const previousTrigger = el.previousElementSibling?.querySelector(
        "[x-accordion\\:trigger]",
      );

      if (previousTrigger) {
        previousTrigger.focus();
      } else {
        el.closest("[x-accordion]")
          .querySelector(
            "[x-accordion\\:item]:last-of-type [x-accordion\\:trigger]",
          )
          ?.focus();
      }
    },

    "@keydown.down.prevent.stop"() {
      const nextTrigger = el.nextElementSibling?.querySelector(
        "[x-accordion\\:trigger]",
      );

      if (nextTrigger) {
        nextTrigger.focus();
      } else {
        el.closest("[x-accordion]")
          .querySelector("[x-accordion\\:item] [x-accordion\\:trigger]")
          ?.focus();
      }
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
      this.open = !this.open;
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
