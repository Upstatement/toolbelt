/**
 * "x-section" relates a <section> to its title
 * for better screen reader navigation.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("section", (el, { value }) => {
    if (value === "title") {
      handleTitle(el, Alpine);
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
    "x-id"() {
      return ["tb-section-title"];
    },

    "x-data"() {
      return {
        __root: el,
      };
    },

    ":aria-labelledby"() {
      return this.$id("tb-section-title");
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleTitle(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        console.warn("x-section:title must be placed inside an x-section.", el);
      }
    },

    ":id"() {
      return this.$id("tb-section-title");
    },
  });
}
