import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * `x-tabs` is a set of layered sections of content known
 * as tab panels that are displayed one at a time.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("tabs", (el, { value, expression }) => {
    if (value === "list") {
      handleList(el, Alpine);
    } else if (value === "trigger") {
      handleTrigger(el, Alpine, { value: expression });
    } else if (value === "content") {
      handleContent(el, Alpine, { value: expression });
    } else {
      handleRoot(el, Alpine, { default: expression });
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
        __root: true,
        activeTab: config.default || null,
      };
    },

    "x-id"() {
      return ["tabs-trigger", "tabs-content"];
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleList(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.warn("x-tabs:trigger must be placed inside an x-tabs.", el);
      }
    },

    "x-data"() {
      return {
        __list: true,
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
function handleTrigger(el, Alpine, config) {
  if (!config.value) {
    return logger.error("x-tabs:trigger must have a value.", el);
  }

  Alpine.bind(el, {
    "x-data"() {
      return {
        value: config.value,
      };
    },

    "x-init"() {
      if (!this.__list) {
        logger.warn("x-tabs:trigger must be placed inside an x-tabs:list.", el);
      }

      if (!isElementTag(el, "button")) {
        logger.warn("x-tabs:trigger must be a <button> element.", el);
      }

      if (!this.activeTab && el.previousElementSibling === null) {
        this.activeTab = this.value;
      }
    },

    ":id"() {
      return `${this.$id("tabs-trigger")}-${this.value}`;
    },

    role: "tab",

    ":tabindex"() {
      return this.activeTab === this.value ? "0" : -1;
    },

    ":aria-selected"() {
      return this.activeTab === this.value;
    },

    ":aria-controls"() {
      return `${this.$id("tabs-content")}-${this.value}`;
    },

    "@click"() {
      this.activeTab = this.value;
    },

    "@keydown.left.prevent.stop"() {
      const previousTrigger = el.previousElementSibling;

      if (previousTrigger) {
        previousTrigger.focus();
      } else {
        el.closest("[x-tabs\\:list]")
          .querySelector("[x-tabs\\:trigger]:last-of-type")
          ?.focus();
      }
    },

    "@keydown.right.prevent.stop"() {
      const nextTrigger = el.nextElementSibling;

      if (nextTrigger) {
        nextTrigger.focus();
      } else {
        el.closest("[x-tabs\\:list]")
          .querySelector("[x-tabs\\:trigger]")
          ?.focus();
      }
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ value: string }} config
 */
function handleContent(el, Alpine, config) {
  if (!config.value) {
    return logger.error("x-tabs:content must have a value.", el);
  }

  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.warn("x-tabs:content must be placed inside an x-tabs", el);
      }
    },

    "x-data"() {
      return {
        value: config.value,
      };
    },

    ":id"() {
      return `${this.$id("tabs-content")}-${this.value}`;
    },

    role: "tabpanel",

    tabindex: 0,

    ":aria-labelledby"() {
      return `${this.$id("tabs-trigger")}-${this.value}`;
    },

    "x-show"() {
      return this.activeTab === this.value;
    },
  });
}
