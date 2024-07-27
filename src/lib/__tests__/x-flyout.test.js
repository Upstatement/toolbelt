import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-flyout", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-flyout data-testid="flyout">
          <button x-flyout:trigger data-testid="trigger"></button>
          <div x-flyout:content data-testid="content"></div>
        </div>
      `;
    });

    test("correct initial state", () => {
      const flyout = getByTestId(document.body, "flyout");
      const trigger = getByTestId(flyout, "trigger");
      const content = getByTestId(flyout, "content");

      expect(flyout).toHaveAttribute("data-state", "closed");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-controls", content.id);

      expect(content).toHaveAttribute("role", "dialog");
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).not.toBeVisible();
    });
  });
});
