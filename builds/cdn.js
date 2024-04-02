import plugin from "../src/alpine";

document.addEventListener("alpine:init", () => {
  plugin(window.Alpine);
});
