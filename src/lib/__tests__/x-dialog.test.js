import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-dialog", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let toggle, content, overlay, title, description, close;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-dialog>
          <button x-dialog:trigger data-testid="toggle"></button>

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
        toggle = screen.getByTestId("toggle");
        content = screen.getByTestId("content");
        overlay = screen.getByTestId("overlay");
        title = screen.getByTestId("title");
        description = screen.getByTestId("description");
        close = screen.getByTestId("close");
      });
    });

    test("correct initial state", () => {
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveAttribute("data-state", "closed");
      expect(toggle).toHaveAttribute("aria-haspopup", "dialog");
      expect(toggle).toHaveAttribute("aria-controls", content.id);

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
      fireEvent.click(toggle);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, true);
      });
    });

    test("should close the dialog", async () => {
      fireEvent.click(toggle);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, true);
      });

      fireEvent.click(close);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, false);
      });
    });

    test("should close the dialog when overlay is clicked", async () => {
      fireEvent.click(toggle);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, true);
      });

      fireEvent.click(overlay);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, false);
      });
    });

    test("pressing escape should close the dialog", async () => {
      fireEvent.click(toggle);

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, true);
      });

      fireEvent.keyDown(content, { key: "Escape" });

      await waitFor(() => {
        expectDialogToBeOpen({ toggle, content }, false);
      });
    });
  });
});

/**
 * @param {{ toggle: HTMLElement, content: HTMLElement }} elements
 * @param {boolean} isOpen
 */
function expectDialogToBeOpen(elements, isOpen) {
  const { toggle, content } = elements;

  expect(toggle).toHaveAttribute("aria-expanded", isOpen ? "true" : "false");
  expect(toggle).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(content).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  if (isOpen) {
    expect(content).toBeVisible();
  } else {
    expect(content).not.toBeVisible();
  }
}
