/**
 * "section" plugin relates a <section> to its title
 * for better screen reader navigation.
 *
 * @example
 * <section x-section>
 *   <h2 x-section:title>...</h2>
 * </section>
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
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
      return ["title"];
    },

    ":aria-labelledby"() {
      return this.$id("title");
    },
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleTitle(el, Alpine) {
  Alpine.bind(el, {
    ":id"() {
      return this.$id("title");
    },
  });
}
