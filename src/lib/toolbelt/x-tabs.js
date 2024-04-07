import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * `x-tabs` is a set of layered sections of content known
 * as tab panels that are displayed one at a time.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("tabs", (el, { value, modifiers, expression }) => {
    if (value === "list") {
      handleList(el, Alpine, {
        loop: modifiers.includes("loop"),
      });
    } else if (value === "tab") {
      handleTab(el, Alpine, { value: expression });
    } else if (value === "panel") {
      handlePanel(el, Alpine, { value: expression });
    } else {
      handleRoot(el, Alpine, {
        default: expression,
        automatic: modifiers.includes("automatic"),
      });
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ default: string }} config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        activeTab: config.default || null,
        automatic: config.automatic || false,
      };
    },

    "x-id"() {
      return ["tabs-tab", "tabs-panel"];
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ loop: boolean }} config
 */
function handleList(el, Alpine, config) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error("x-tabs:tab must be placed inside an x-tabs.", el);
      }
    },

    "x-data"() {
      return {
        __list: el,
        loop: config.loop || false,
      };
    },

    role: "tablist",

    tabindex: 0,
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ value: string }} config
 */
function handleTab(el, Alpine, config) {
  if (!config.value) {
    return logger.error("x-tabs:tab must have a value.", el);
  }

  Alpine.bind(el, {
    "x-data"() {
      return {
        value: config.value,
      };
    },

    "x-init"() {
      if (!this.__list) {
        logger.error("x-tabs:tab must be placed inside an x-tabs:list.", el);
      }

      if (!isElementTag(el, "button")) {
        logger.error("x-tabs:tab must be a <button> element.", el);
      }

      if (!this.activeTab && el.matches(":first-of-type")) {
        this.activeTab = this.value;
      }
    },

    ":id"() {
      return `${this.$id("tabs-tab")}-${this.value}`;
    },

    role: "tab",

    ":tabindex"() {
      return this.activeTab === this.value ? "0" : -1;
    },

    ":aria-selected"() {
      return this.activeTab === this.value;
    },

    ":aria-controls"() {
      return `${this.$id("tabs-panel")}-${this.value}`;
    },

    "@click"() {
      this.activeTab = this.value;
    },

    "@keydown.left.prevent.stop"() {
      const previousTab =
        el.previousElementSibling ||
        (this.loop && this.__list.querySelector("[x-tabs\\:tab]:last-of-type"));

      if (previousTab && this.automatic) {
        previousTab.click();
      }

      if (previousTab) {
        previousTab.focus();
      }
    },

    "@keydown.right.prevent.stop"() {
      const nextTab =
        el.nextElementSibling ||
        (this.loop && this.__list.querySelector("[x-tabs\\:tab]"));

      if (nextTab && this.automatic) {
        nextTab.click();
      }

      if (nextTab) {
        nextTab.focus();
      }
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ value: string }} config
 */
function handlePanel(el, Alpine, config) {
  if (!config.value) {
    return logger.error("x-tabs:panel must have a value.", el);
  }

  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error("x-tabs:panel must be placed inside an x-tabs", el);
      }
    },

    "x-data"() {
      return {
        value: config.value,
      };
    },

    ":id"() {
      return `${this.$id("tabs-panel")}-${this.value}`;
    },

    role: "tabpanel",

    tabindex: 0,

    ":aria-labelledby"() {
      return `${this.$id("tabs-tab")}-${this.value}`;
    },

    "x-show"() {
      return this.activeTab === this.value;
    },
  });
}
