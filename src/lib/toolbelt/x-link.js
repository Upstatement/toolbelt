import logger from "../logger";

/**
 * "x-link" determines whether a link is the current page
 * or an external link.
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

  if (el.tagName === "A") {
    Alpine.bind(el, {
      ":aria-current"() {
        const url = new URL(el.href);
        const windowUrl = new URL(window.location.href);

        if (
          url.origin === windowUrl.origin &&
          url.pathname.replace(/\/$/, "") ===
            windowUrl.pathname.replace(/\/$/, "")
        ) {
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

  if (el.tagName === "A") {
    const isExternal = !el.href.startsWith(window.location.origin);

    Alpine.bind(el, {
      ":target"() {
        if (isExternal) {
          return "_blank";
        }
      },

      ":rel"() {
        if (isExternal) {
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
