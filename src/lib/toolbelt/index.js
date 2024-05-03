import accordion from "./x-accordion";
import dialog from "./x-dialog";
import flyout from "./x-flyout";
import section from "./x-section";
import tabs from "./x-tabs";
import link from "./x-link";

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  accordion(Alpine);
  dialog(Alpine);
  flyout(Alpine);
  section(Alpine);
  link(Alpine);
  tabs(Alpine);
}
