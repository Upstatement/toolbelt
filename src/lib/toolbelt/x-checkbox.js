import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * "x-checkbox" is a control that allows the user to toggle between checked and not checked.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("checkbox", (el, { value, modifiers }) => {
    if (value === "indicator") {
      handleIndicator(el, Alpine);
    } else if (value === "label") {
      handleLabel(el, Alpine);
    } else {
      handleRoot(el, Alpine, { checked: modifiers.includes("checked") });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ checked: boolean }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        checked: config.checked,
      };
    },

    "x-id"() {
      return ["tb-checkbox-indicator"];
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleIndicator(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error(
          "x-checkbox:indicator must be placed inside an x-checkbox",
          el,
        );
      }

      if (!isElementTag(el, "button")) {
        logger.error("x-checkbox:indicator must be a <button> element", el);
      }
    },

    ":id"() {
      return this.$id("tb-checkbox-indicator");
    },

    role: "checkbox",

    ":aria-checked"() {
      return this.checked;
    },

    value: "on",

    ":data-state"() {
      return this.checked ? "checked" : "unchecked";
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleLabel(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error(
          "x-checkbox:label must be placed inside an x-checkbox",
          el,
        );
      }

      if (!isElementTag(el, "label")) {
        logger.error("x-checkbox:label must be a <label> element", el);
      }
    },

    ":for"() {
      return this.$id("tb-checkbox-indicator");
    },
  });
}
