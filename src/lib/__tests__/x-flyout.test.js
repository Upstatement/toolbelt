import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-flyout", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let root, trigger, content;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-flyout data-testid="root">
          <button x-flyout:trigger data-testid="trigger"></button>
          <div x-flyout:content data-testid="content"></div>
        </div>
      `;

      root = screen.getByTestId("root");
      trigger = screen.getByTestId("trigger");
      content = screen.getByTestId("content");
    });

    test("correct initial state", () => {
      expect(root).toHaveAttribute("data-state", "closed");

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
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, true);
      });
    });

    test("should close flyout", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, true);
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, false);
      });
    });

    test("focusing out of flyout should close it", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, true);
      });

      fireEvent.focusOut(content);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, false);
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
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, true);
      });

      fireEvent.click(document.body);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout: root, trigger, content }, false);
      });
    });
  });

  describe("(x-flyout:hoverable) open on hover configuration", () => {
    let flyout, trigger, content;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-flyout.hoverable data-testid="flyout">
          <button x-flyout:trigger data-testid="trigger"></button>
          <div x-flyout:content data-testid="content"></div>
        </div>
      `;

      flyout = screen.getByTestId("flyout");
      trigger = screen.getByTestId("trigger");
      content = screen.getByTestId("content");
    });

    test("should open flyout on mouse enter", async () => {
      fireEvent.mouseEnter(flyout);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout, trigger, content }, true);
      });
    });

    test("should close flyout on mouse leave", async () => {
      fireEvent.mouseEnter(flyout);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout, trigger, content }, true);
      });

      fireEvent.mouseLeave(flyout);

      await waitFor(() => {
        expectFlyoutToBeOpen({ flyout, trigger, content }, false);
      });
    });
  });
});

/**
 * @param {{ flyout: HTMLElement, trigger: HTMLElement, content: HTMLElement }} elements
 * @param {boolean} isOpen
 */
function expectFlyoutToBeOpen(elements, isOpen) {
  const { flyout, trigger, content } = elements;

  expect(flyout).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(trigger).toHaveAttribute("aria-expanded", isOpen ? "true" : "false");
  expect(trigger).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(content).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  if (isOpen) {
    expect(content).toBeVisible();
  } else {
    expect(content).not.toBeVisible();
  }
}
