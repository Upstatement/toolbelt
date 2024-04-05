/**
 * @typedef {('a'|'button')} ElementTag
 */

/**
 * @param {HTMLElement} el
 * @param {ElementTag} tag
 */
export function isElementTag(el, tag) {
  return el.tagName.toLowerCase() === tag;
}
