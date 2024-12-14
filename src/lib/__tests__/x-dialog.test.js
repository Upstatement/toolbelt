import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { createMockCustomEventListener, html, initializeAlpine } from "./utils";

describe("x-dialog", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let root, trigger, content, overlay, title, description, close;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-dialog data-testid="root">
          <button x-dialog:trigger data-testid="trigger"></button>

          <template x-teleport="body">
            <div x-dialog:content data-testid="content">
              <div x-dialog:overlay data-testid="overlay"></div>
              <h2 x-dialog:title data-testid="title"></h2>
              <p x-dialog:description data-testid="description"></p>
              <button x-dialog:close data-testid="close"></button>
            </div>
          </template>
        </div>
      `;

      await waitFor(() => {
        root = screen.getByTestId("root");
        trigger = screen.getByTestId("trigger");
        content = screen.getByTestId("content");
        overlay = screen.getByTestId("overlay");
        title = screen.getByTestId("title");
        description = screen.getByTestId("description");
        close = screen.getByTestId("close");
      });
    });

    test("correct initial state", () => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-controls", content.id);

      expect(content).toHaveAttribute("role", "dialog");
      expect(content).toHaveAttribute("tabindex", "-1");
      expect(content).toHaveAttribute("aria-modal", "true");
      expect(content).toHaveAttribute("aria-labelledby", title.id);
      expect(content).toHaveAttribute("aria-describedby", description.id);
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).not.toBeVisible();

      expect(close).toBeInTheDocument();
    });

    test("should open the dialog", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, true);
      });
    });

    test("should close the dialog", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, true);
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, false);
      });
    });

    test("close button should close the dialog", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, true);
      });

      fireEvent.click(close);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, false);
      });
    });

    test("should close the dialog when overlay is clicked", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, true);
      });

      fireEvent.click(overlay);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, false);
      });
    });

    test("pressing escape should close the dialog", async () => {
      fireEvent.click(trigger);

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, true);
      });

      fireEvent.keyDown(content, { key: "Escape" });

      await waitFor(() => {
        expectDialogToBeOpen({ root, trigger, content }, false);
      });
    });

    describe("custom events", () => {
      test("should indicate dialog is open", async () => {
        const listener = createMockCustomEventListener();

        root.addEventListener("x-dialog:change", listener);
        trigger.addEventListener("x-dialog:change", listener);
        content.addEventListener("x-dialog:change", listener);

        fireEvent.click(trigger);

        await waitFor(() => {
          expect(listener).toHaveBeenCalledTimes(3);
          expect(listener).toHaveReturnedWith([root, { open: true }]);
          expect(listener).toHaveReturnedWith([trigger, { open: true }]);
          expect(listener).toHaveReturnedWith([content, { open: true }]);
        });
      });

      test("should indicate dialog is closed", async () => {
        fireEvent.click(trigger);
        await waitFor(() => {});

        const listener = createMockCustomEventListener();

        root.addEventListener("x-dialog:change", listener);
        trigger.addEventListener("x-dialog:change", listener);
        content.addEventListener("x-dialog:change", listener);

        fireEvent.click(trigger);

        await waitFor(() => {
          expect(listener).toHaveBeenCalledTimes(3);
          expect(listener).toHaveReturnedWith([root, { open: false }]);
          expect(listener).toHaveReturnedWith([trigger, { open: false }]);
          expect(listener).toHaveReturnedWith([content, { open: false }]);
        });
      });
    });
  });
});

/**
 * @param {{ trigger: HTMLElement, content: HTMLElement }} elements
 * @param {boolean} isOpen
 */
function expectDialogToBeOpen(elements, isOpen) {
  const { root, trigger, content } = elements;

  expect(root).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(trigger).toHaveAttribute("aria-expanded", isOpen ? "true" : "false");
  expect(trigger).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(content).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  if (isOpen) {
    expect(content).toBeVisible();
  } else {
    expect(content).not.toBeVisible();
  }
}
