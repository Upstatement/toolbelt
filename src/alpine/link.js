import logger from "../logger";

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
  Alpine.directive("link", (el, { value, modifiers }) => {
    const isNested = modifiers.includes("nested");

    if (value === "current") {
      handleCurrent(el, Alpine, isNested);
    } else if (value === "external") {
      handleExternal(el, Alpine, isNested);
    }
  });
}

/**
 * @example
 * <a href="..." x-link:current>...</a>
 *
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {boolean} isNested
 */
function handleCurrent(el, Alpine, isNested) {
  if (!isNested && el.tagName !== "A") {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!isNested && el.tagName === "A" && !el.href) {
    return logger.error(
      "x-link directive requires an 'href' attribute, unless nested.",
      el,
    );
  }

  if (isNested && el.tagName === "A") {
    Alpine.bind(el, {
      ":aria-current"() {
        if (el.href === window.location.href) {
          return "page";
        }
      },
    });
  }

  if (isNested) {
    el.querySelectorAll("a").forEach((el) => {
      handleCurrent(el, Alpine, isNested);
    });
  }
}

/**
 * @example
 * <a href="..." x-link:external>...</a>
 *
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {boolean} isNested
 */
function handleExternal(el, Alpine, isNested) {
  if (!isNested && el.tagName !== "A") {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!isNested && el.tagName === "A" && !el.href) {
    return logger.error(
      "x-link directive requires an 'href' attribute, unless nested.",
      el,
    );
  }

  if (isNested && el.tagName === "A") {
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

  if (isNested) {
    el.querySelectorAll("a").forEach((el) => {
      handleExternal(el, Alpine, isNested);
    });
  }
}
