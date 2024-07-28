import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-flyout", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let flyout, trigger, content;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-flyout data-testid="flyout">
          <button x-flyout:trigger data-testid="trigger"></button>
          <div x-flyout:content data-testid="content"></div>
        </div>
      `;

      flyout = getByTestId(document.body, "flyout");
      trigger = getByTestId(document.body, "trigger");
      content = getByTestId(document.body, "content");
    });

    test("correct initial state", () => {
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

    /**
     * This test is skipped because we haven't figured out how to
     * properly fire a click event outside of the flyout. This test
     * case is working in the browser but not in the test environment.
     */
    test.skip("clicking outside of flyout should close it", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });

      fireEvent.click(document.body);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "closed");

        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(trigger).toHaveAttribute("data-state", "closed");

        expect(content).toHaveAttribute("data-state", "closed");
        expect(content).not.toBeVisible();
      });
    });
  });

  describe("open on hover configuration (x-flyout:hoverable)", () => {
    let flyout, trigger, content;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-flyout.hoverable data-testid="flyout">
          <button x-flyout:trigger data-testid="trigger"></button>
          <div x-flyout:content data-testid="content"></div>
        </div>
      `;

      flyout = getByTestId(document.body, "flyout");
      trigger = getByTestId(document.body, "trigger");
      content = getByTestId(document.body, "content");
    });

    test("should open flyout on mouse enter", async () => {
      fireEvent.mouseEnter(flyout);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });
    });

    test("should close flyout on mouse leave", async () => {
      fireEvent.mouseEnter(flyout);

      await waitFor(() => {
        expect(flyout).toHaveAttribute("data-state", "open");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-state", "open");

        expect(content).toHaveAttribute("data-state", "open");
        expect(content).toBeVisible();
      });

      fireEvent.mouseLeave(flyout);

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
