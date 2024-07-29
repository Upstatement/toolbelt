import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { screen } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-section", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let section, title;

    beforeEach(() => {
      document.body.innerHTML = html`
        <section x-section data-testid="section">
          <h2 x-section:title data-testid="title"></h2>
        </section>
      `;

      section = screen.getByTestId("section");
      title = screen.getByTestId("title");
    });

    test("should label section with title", () => {
      expect(section).toHaveAttribute("aria-labelledby", title.id);
    });
  });
});
