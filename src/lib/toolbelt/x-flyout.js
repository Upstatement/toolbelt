import logger from "../logger";
import { dispatch, isElementTag } from "../utils";

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
    } else {
      handleRoot(el, Alpine, {
        hoverable: modifiers.includes("hoverable"),
      });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ hoverable: boolean }} config
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

    ":data-state"() {
      return this.open ? "open" : "closed";
    },

    "@click.outside"() {
      if (this.open) {
        this.open = false;
      }
    },

    "x-effect"() {
      dispatch(el, "flyout:change", {
        open: this.open,
      });
    },
  });

  if (config.hoverable) {
    Alpine.bind(el, {
      "x-data"() {
        return {
          closeOnMouseLeaveTimeout: null,
        };
      },

      "@mouseenter"() {
        if (this.closeOnMouseLeaveTimeout) {
          clearTimeout(this.closeOnMouseLeaveTimeout);
        }

        this.open = true;
      },

      "@mouseleave"() {
        if (this.closeOnMouseLeaveTimeout) {
          clearTimeout(this.closeOnMouseLeaveTimeout);
        }

        this.closeOnMouseLeaveTimeout = setTimeout(() => {
          this.open = false;
        }, 200);
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

    ":data-state"() {
      return this.open ? "open" : "closed";
    },

    "aria-haspopup": "dialog",

    ":aria-controls"() {
      return this.$id("tb-flyout-content");
    },

    "@click"() {
      this.open = !this.open;
    },

    "x-effect"() {
      dispatch(el, "flyout:change", {
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

    ":data-state"() {
      return this.open ? "open" : "closed";
    },

    "x-show"() {
      return this.open;
    },

    "@focusout"(e) {
      // Close the flyout when focus moves out of content.
      if (!el.contains(e.relatedTarget)) {
        this.open = false;
      }
    },

    "x-effect"() {
      dispatch(el, "flyout:change", {
        open: this.open,
      });
    },
  });
}
