import logger from "../logger";

/**
 * "x-progress" displays an indicator showing the completion progress of a task.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export default function (Alpine) {
  Alpine.directive("progress", (el, { value }) => {
    if (value === "indicator") {
      handleIndicator(el, Alpine);
    } else {
      handleRoot(el, Alpine);
    }
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleRoot(el, Alpine) {
  let valuemin = el.getAttribute("data-valuemin");
  let valuemax = el.getAttribute("data-valuemax");
  let valuenow = el.getAttribute("data-valuenow");
  const valuetext = el.getAttribute("data-valuetext");

  if (!valuemin) {
    logger.error("x-progress is missing data-valuemin.", el);
    return;
  }

  if (!valuemax) {
    logger.error("x-progress is missing data-valuemax.", el);
    return;
  }

  if (!valuenow) {
    logger.error("x-progress is missing data-valuenow.", el);
    return;
  }

  valuemin = parseFloat(valuemin);
  valuemax = parseFloat(valuemax);
  valuenow = parseFloat(valuenow);

  if (isNaN(valuemin)) {
    logger.error("x-progress data-valuemin must be a number.", el);
    return;
  }

  if (isNaN(valuemax)) {
    logger.error("x-progress data-valuemax must be a number.", el);
    return;
  }

  if (isNaN(valuenow)) {
    logger.error("x-progress data-valuenow must be a number.", el);
    return;
  }

  if (valuemin > valuemax) {
    logger.error(
      "x-progress data-valuemin must be less than data-valuemax.",
      el,
    );
    return;
  }

  if (valuenow < valuemin || valuenow > valuemax) {
    logger.error(
      "x-progress data-valuenow must be between data-valuemin and data-valuemax.",
      el,
    );
    return;
  }

  const progress = ((valuenow - valuemin) / (valuemax - valuemin)) * 100;

  Alpine.bind(el, {
    "x-data"() {
      return {
        __root: el,
        progress,
      };
    },

    role: "progressbar",

    "aria-valuemin": valuemin,
    "aria-valuemax": valuemax,
    "aria-valuenow": valuenow,
    "aria-valuetext": valuetext,
  });
}

/**
 * @param {HTMLElement} el
 * @param {import('alpinejs').Alpine} Alpine
 */
function handleIndicator(el, Alpine) {
  Alpine.bind(el, {
    "x-init"() {
      if (!this.__root) {
        logger.error(
          "x-progress:indicator must be placed inside an x-progress.",
          el,
        );
      }

      el.style.setProperty("--tb-progress", `${this.progress}%`);
    },
  });
}
