/**
 * "link" plugin is a family of directives that help manage links.
 * The ":current" value sets the aria-current attribute to "page" if the link is the current page.
 * The ":external" value opens the link in a new tab if href is external.
 *
 * @example
 * <a href="..." x-link:current>...</a>
 *
 * @example
 * <a href="..." x-link:external>...</a>
 *
 * To apply the directive to all nested links, use the "nested" modifier.
 *
 * @example
 * <div x-link.nested:current>
 *   <a href="...">...</a>
 * </div>
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("link", (el, { value }) => {
    if (el.tagName !== "A") {
      console.error("x-link directive can only be used on <a> elements.");
      return;
    }

    if (value === "current") {
      handleCurrent(el, Alpine);
    } else if (value === "external") {
      handleExternal(el, Alpine);
    }
  });
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleCurrent(el, Alpine) {
  Alpine.bind(el, {
    ":aria-current"() {
      if (el.href === window.location.href) {
        return "page";
      }
    },
  });
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleExternal(el, Alpine) {
  Alpine.bind(el, {
    ":target"() {
      if (!el.href.startsWith(window.location.origin)) {
        return "_blank";
      }
    },

    ":rel"() {
      if (!el.href.startsWith(window.location.origin)) {
        return "noopener noreferrer";
      }
    },
  });
}
