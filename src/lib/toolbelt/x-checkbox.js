import logger from "../logger";
import { SR_ONLY_STYLE, isElementTag } from "../utils";

/**
 * "x-checkbox" is a control that allows the user to toggle between checked and not checked.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("checkbox", (el, { value, modifiers, expression }) => {
    if (value === "indicator") {
      handleIndicator(el, Alpine);
    } else if (value === "label") {
      handleLabel(el, Alpine);
    } else {
      handleRoot(el, Alpine, {
        checked: modifiers.includes("checked"),
        value: expression,
      });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ checked: boolean, value?: string }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        checked: config.checked,
        value: config.value || "on",
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

      /**
       * Create an input element to handle the checkbox state
       * for a form.
       */
      const input = document.createElement("input");
      el.insertAdjacentElement("afterend", input);
      handleInput(input, Alpine);
    },

    ":id"() {
      return this.$id("tb-checkbox-indicator");
    },

    role: "checkbox",

    ":aria-checked"() {
      return this.checked;
    },

    ":value"() {
      return this.value;
    },

    ":data-state"() {
      return this.checked ? "checked" : "unchecked";
    },

    "@click"() {
      this.checked = !this.checked;
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleInput(el, Alpine) {
  Alpine.bind(el, {
    type: "checkbox",

    "aria-hidden": "true",

    style: SR_ONLY_STYLE,

    tabIndex: "-1",

    ":value"() {
      return this.value;
    },

    ":checked"() {
      return this.checked;
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

    ":data-state"() {
      return this.checked ? "checked" : "unchecked";
    },
  });
}
