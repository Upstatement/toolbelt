import { Alpine } from "alpinejs";
import { focus } from "@alpinejs/focus";
import toolbelt from "../toolbelt";

/**
 * Convenient utility to provide HTML
 * editor formatting for a string.
 *
 * @param {string} document
 *
 * @return {string} the same document
 */
export function html(doc) {
  return doc;
}

export function initializeAlpine() {
  // Alpine.plugin(focus);
  Alpine.plugin(toolbelt);
  Alpine.start();
}
