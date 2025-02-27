/**
 * @param {string} message
 * @param {HTMLElement} el
 *
 * @return {void}
 */
function error(message, el) {
  console.error(message, "\n\n", el.outerHTML);
}

/**
 * @param {string} message
 * @param {HTMLElement} el
 *
 * @return {void}
 */
function warn(message, el) {
  console.warn(message, "\n\n", el.outerHTML);
}

export default {
  error,
  warn,
};
