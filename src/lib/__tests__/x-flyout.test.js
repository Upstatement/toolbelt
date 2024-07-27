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
      const trigger = getByTestId(document.body, "trigger");
      const content = getByTestId(document.body, "content");

      expect(flyout).toHaveAttribute("data-state", "closed");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-controls", content.id);

      expect(content).toHaveAttribute("role", "dialog");
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).not.toBeVisible();
    });

    test("should open flyout", async () => {
      const flyout = getByTestId(document.body, "flyout");
      const trigger = getByTestId(document.body, "trigger");
      const content = getByTestId(document.body, "content");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });
    });

    test("should close flyout", async () => {
      const flyout = getByTestId(document.body, "flyout");
      const trigger = getByTestId(document.body, "trigger");
      const content = getByTestId(document.body, "content");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "closed");

        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(trigger).toHaveAttribute("data-state", "closed");

        expect(content).toHaveAttribute("data-state", "closed");
        expect(content).not.toBeVisible();
      });
    });

    test("focusing out of flyout should close it", async () => {
      const flyout = getByTestId(document.body, "flyout");
      const trigger = getByTestId(document.body, "trigger");
      const content = getByTestId(document.body, "content");

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });

      fireEvent.focusOut(content);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "closed");

        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(trigger).toHaveAttribute("data-state", "closed");

        expect(content).toHaveAttribute("data-state", "closed");
        expect(content).not.toBeVisible();
      });
    });
  });
});
