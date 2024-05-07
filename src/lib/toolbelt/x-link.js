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
    const nested = modifiers.includes("nested");

    if (value === "current") {
      handleCurrent(el, Alpine, { nested });
    } else if (value === "external") {
      handleExternal(el, Alpine, { nested });
    }
  });
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ nested: boolean }} config
 */
function handleCurrent(el, Alpine, config) {
  if (!config.nested && !isElementTag(el, "a")) {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!config.nested && isElementTag(el, "a") && !el.href) {
    return logger.error(
      "x-link directive requires an 'href' attribute, unless nested.",
      el,
    );
  }

  if (isElementTag(el, "a")) {
    const url = new URL(el.href);
    const windowUrl = new URL(window.location.href);

    const isExternal =
      url.origin === windowUrl.origin &&
      url.pathname.replace(/\/$/, "") === windowUrl.pathname.replace(/\/$/, "");

    Alpine.bind(el, {
      ":aria-current"() {
        if (isExternal) {
          return "page";
        }
      },

      ":data-current"() {
        return isExternal;
      },
    });
  }

  if (config.nested) {
    el.querySelectorAll("a").forEach((el) => {
      handleCurrent(el, Alpine, config);
    });
  }
}

/**
 * @param {HTMLAnchorElement} el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ nested: boolean }} config
 */
function handleExternal(el, Alpine, config) {
  if (!config.nested && !isElementTag(el, "a")) {
    return logger.error(
      "x-link directive can only be used on <a> elements, unless nested.",
      el,
    );
  }

  if (!config.nested && isElementTag(el, "a") && !el.href) {
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

      ":data-external"() {
        return isExternal;
      },
    });
  }

  if (config.nested) {
    el.querySelectorAll("a").forEach((el) => {
      handleExternal(el, Alpine, config);
    });
  }
}
