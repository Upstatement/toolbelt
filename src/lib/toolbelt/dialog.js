import logger from "../logger";

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("dialog", (el, { value }) => {
    if (value === "trigger") {
      handleTrigger(el, Alpine);
    } else if (value === "overlay") {
      handleOverlay(el, Alpine);
    } else if (value === "content") {
      handleContent(el, Alpine);
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

function handleRoot(el, Alpine) {
  Alpine.bind(el, {
    "x-id"() {
      return [
        "toolbelt-dialog-content",
        "toolbelt-dialog-title",
        "toolbelt-dialog-description",
      ];
    },

    "x-data"() {
      return {
        open: false,
      };
    },
  });
}

function handleTrigger(el, Alpine) {
  Alpine.bind(el, {
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

function handleOverlay(el, Alpine) {
  Alpine.bind(el, {
    "x-show"() {
      return this.open;
    },

    "@click"() {
      this.open = false;
    },

    "aria-hidden": true,
  });
}

function handleContent(el, Alpine) {
  Alpine.bind(el, {
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

function handleTitle(el, Alpine) {
  Alpine.bind(el, {
    ":id"() {
      return this.$id("toolbelt-dialog-title");
    },
  });
}

function handleDescription(el, Alpine) {
  Alpine.bind(el, {
    ":id"() {
      return this.$id("toolbelt-dialog-description");
    },
  });
}

function handleClose(el, Alpine) {
  Alpine.bind(el, {
    "@click"() {
      this.open = false;
    },
  });
}
