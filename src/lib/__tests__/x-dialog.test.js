import { getByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";

import { html, initializeAlpine } from "./utils";

describe("x-dialog", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    beforeEach(() => {
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
    });

    test("correct initial state", () => {
      const toggle = getByTestId(document, "toggle");
      const content = getByTestId(document, "content");
      const title = getByTestId(document, "title");
      const description = getByTestId(document, "description");
      const close = getByTestId(document, "close");

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
  });
});
