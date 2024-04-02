import plugin from "../src/index.js";

document.addEventListener("alpine:init", () => {
  plugin(window.Alpine);
});
