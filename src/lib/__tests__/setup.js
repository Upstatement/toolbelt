import { expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import { SR_ONLY_STYLE } from "../utils";

expect.extend({
  /**
   * @param {HTMLElement} received
   */
  toBeScreenReaderOnly(received) {
    const isScreenReaderOnly = received.style.cssText === SR_ONLY_STYLE;

    if (!isScreenReaderOnly) {
      return {
        message: () => "Element is not screen reader only",
        pass: false,
      };
    }

    return {
      message: () => "Element is screen reader only",
      pass: true,
    };
  },
});
