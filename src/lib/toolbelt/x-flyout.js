import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * `x-flyout` set of directives creates a flyout menu.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("flyout", (el, { value, modifiers }) => {
    if (value === "trigger") {
      handleTrigger(el, Alpine);
    } else if (value === "content") {
      handleContent(el, Alpine);
    } else if (value === "close") {
      handleClose(el, Alpine);
    } else {
      handleRoot(el, Alpine, { hover: modifiers.includes("hover") });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ hover: boolean }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        open: false,
        __root: el,
      };
    },

    "x-id"() {
      return ["tb-flyout-content"];
    },
  });

  if (config.hover) {
    Alpine.bind(el, {
      "@mouseenter"() {
        this.open = true;
      },

      "@mouseleave"() {
        this.open = false;
      },
    });
  }
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleTrigger(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error("x-flyout:trigger must be placed inside an x-flyout", el);
      }

      if (!isElementTag(el, "button")) {
        logger.warn("x-flyout:trigger must be a <button> element", el);
      }
    },

    ":aria-expanded"() {
      return this.open;
    },

    "aria-haspopup": "dialog",

    ":aria-controls"() {
      return this.$id("tb-flyout-content");
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
    "x-data"() {
      return {
        __content: el,
      };
    },

    "x-init"() {
      if (!this.__root) {
        logger.error("x-flyout:content must be placed inside an x-flyout", el);
      }
    },

    ":id"() {
      return this.$id("tb-flyout-content");
    },

    role: "dialog",

    "x-show"() {
      return this.open;
    },

    "@focusout"(e) {
      // Close the flyout when focus moves out of content.
      if (!el.contains(e.relatedTarget)) {
        this.open = false;
      }
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleClose(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__content) {
        logger.error(
          "x-flyout:close must be placed inside an x-flyout:content",
          el,
        );
      }

      if (!isElementTag(el, "button")) {
        logger.warn("x-flyout:close must be a <button> element", el);
      }
    },

    "@click"() {
      this.open = false;
    },
  });
}
