import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import toolbelt from "../toolbelt";

window.Alpine = Alpine;

Alpine.plugin(focus);
Alpine.plugin(toolbelt);
Alpine.start();
