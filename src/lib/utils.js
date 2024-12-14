/**
 * @typedef {('a'|'button'|'label')} ElementTag
 */

export const SR_ONLY_STYLE =
  "position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;";

/**
 * @param {HTMLElement} el
 * @param {ElementTag} tag
 */
export function isElementTag(el, tag) {
  return el.tagName.toLowerCase() === tag;
}

/**
 * @param {HTMLElement} el
 * @param {string} name
 * @param {object} detail
 */
export function dispatch(el, name, detail) {
  const event = new CustomEvent(name, { detail });
  el.dispatchEvent(event);
}
