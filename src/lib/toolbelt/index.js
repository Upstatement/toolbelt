import dialog from "./x-dialog";
import section from "./x-section";
import link from "./x-link";

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function(Alpine) {
  section(Alpine);
  link(Alpine);
  dialog(Alpine);
}
