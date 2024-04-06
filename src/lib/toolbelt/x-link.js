import logger from "../logger";
import { isElementTag } from "../utils";

/**
 * "x-link" determines whether a link is the current page
 * or an external link.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  Alpine.directive("link", (el, { value, modifiers }) => {
    const isNested = modifiers.includes("nested");

    if (value === "current") {
      handleCurrent(el, Alpine, { isNested });
    } else if (value === "external") {
      handleExternal(el, Alpine, { isNested });
    }
  });
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ isNested: boolean }} config
 */
function handleCurrent(el, Alpine, config) {
  if (!config.isNested && !isElementTag(el, "a")) {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!config.isNested && isElementTag(el, "a") && !el.href) {
    return logger.error(
      "x-link directive requires an 'href' attribute, unless nested.",
      el,
    );
  }

  if (isElementTag(el, "a")) {
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

  if (config.isNested) {
    el.querySelectorAll("a").forEach((el) => {
      handleCurrent(el, Alpine, config);
    });
  }
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ isNested: boolean }} config
 */
function handleExternal(el, Alpine, config) {
  if (!config.isNested && !isElementTag(el, "a")) {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!config.isNested && isElementTag(el, "a") && !el.href) {
    return logger.error(
      "x-link directive requires an 'href' attribute, unless nested.",
      el,
    );
  }

  if (isElementTag(el, "a")) {
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

  if (config.isNested) {
    el.querySelectorAll("a").forEach((el) => {
      handleExternal(el, Alpine, config);
    });
  }
}
