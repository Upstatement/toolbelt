import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { getByTestId } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-progress", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let progress, indicator;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div
          x-progress
          data-valuemin="0"
          data-valuemax="100"
          data-valuenow="40"
          data-valuetext="40%"
          data-testid="progress"
        >
          <div x-progress:indicator data-testid="indicator"></div>
        </div>
      `;

      progress = getByTestId(document.body, "progress");
      indicator = getByTestId(document.body, "indicator");
    });

    test("correct initial state", () => {
      expect(progress).toHaveAttribute("role", "progressbar");
      expect(progress).toHaveAttribute("aria-valuemin", "0");
      expect(progress).toHaveAttribute("aria-valuemax", "100");
      expect(progress).toHaveAttribute("aria-valuenow", "40");
      expect(progress).toHaveAttribute("aria-valuetext", "40%");

      expect(indicator).toHaveStyle({ "--tb-progress": "40%" });
    });
  });
});
