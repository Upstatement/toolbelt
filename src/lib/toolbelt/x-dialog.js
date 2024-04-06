import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * `x-dialog` set of directives creates a window overlaid
 * on top of a page window, rendering the content underneath inert.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("dialog", (el, { value }) => {
    if (value === "trigger") {
      handleTrigger(el, Alpine);
    } else if (value === "content") {
      handleContent(el, Alpine);
    } else if (value === "overlay") {
      handleOverlay(el, Alpine);
    } else if (value === "title") {
      handleTitle(el, Alpine);
    } else if (value === "description") {
      handleDescription(el, Alpine);
    } else if (value === "close") {
      handleClose(el, Alpine);
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
        open: false,
        __root: el,
      };
    },

    "x-id"() {
      return [
        "toolbelt-dialog-content",
        "toolbelt-dialog-title",
        "toolbelt-dialog-description",
      ];
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
      if (!this.__root) {
        logger.error("x-dialog:trigger must be placed inside an x-dialog.", el);
      }

      if (!isElementTag(el, "button")) {
        logger.error("x-dialog:trigger must be a <button> element.", el);
      }
    },

    "@click"() {
      this.open = !this.open;
    },

    ":aria-expanded"() {
      return this.open ? true : false;
    },

    "aria-haspopup": "dialog",

    ":aria-controls"() {
      return this.$id("toolbelt-dialog-content");
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
      if (!this.__root) {
        logger.error("x-dialog:content must be placed inside an x-dialog.", el);
      }
    },

    "x-data"() {
      return {
        __content: el,
      };
    },

    ":id"() {
      return this.$id("toolbelt-dialog-content");
    },

    role: "dialog",

    tabindex: -1,

    "aria-modal": true,

    ":aria-labelledby"() {
      return this.$id("toolbelt-dialog-title");
    },

    ":aria-describedby"() {
      return this.$id("toolbelt-dialog-description");
    },

    "x-show"() {
      return this.open;
    },

    "x-trap.noscroll.inert"() {
      return this.open;
    },

    "@keydown.escape.prevent.stop"() {
      this.open = false;
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleOverlay(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__content) {
        logger.error(
          "x-dialog:overlay must be placed inside an x-dialog:content.",
          el,
        );
      }
    },

    "x-show"() {
      return this.open;
    },

    "@click"() {
      this.open = false;
    },

    "aria-hidden": true,
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleTitle(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__content) {
        logger.error(
          "x-dialog:title must be placed inside an x-dialog:content.",
          el,
        );
      }
    },

    ":id"() {
      return this.$id("toolbelt-dialog-title");
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleDescription(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__content) {
        logger.error(
          "x-dialog:description must be placed inside an x-dialog:content.",
          el,
        );
      }
    },

    ":id"() {
      return this.$id("toolbelt-dialog-description");
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
          "x-dialog:close must be placed inside an x-dialog:content.",
          el,
        );
      }

      if (!isElementTag(el, "button")) {
        logger.error("x-dialog:close must be a <button> element.", el);
      }
    },

    "@click"() {
      this.open = false;
    },
  });
}
