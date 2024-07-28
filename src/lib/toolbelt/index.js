import accordion from "./x-accordion";
import checkbox from "./x-checkbox";
import dialog from "./x-dialog";
import flyout from "./x-flyout";
import section from "./x-section";
import progress from "./x-progress";
import tabs from "./x-tabs";
import link from "./x-link";

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  accordion(Alpine);
  checkbox(Alpine);
  dialog(Alpine);
  flyout(Alpine);
  section(Alpine);
  progress(Alpine);
  link(Alpine);
  tabs(Alpine);
}
