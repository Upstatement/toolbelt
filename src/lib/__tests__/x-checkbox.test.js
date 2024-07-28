import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-checkbox", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let checkbox, indicator, label;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-checkbox data-testid="checkbox">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      checkbox = getByTestId(document.body, "checkbox");
      indicator = getByTestId(document.body, "indicator");
      label = getByTestId(document.body, "label");
    });

    test("correct initial state", () => {
      expect(checkbox).toBeInTheDocument();

      expect(indicator).toHaveAttribute("role", "checkbox");
      expect(indicator).toHaveAttribute("aria-checked", "false");
      expect(indicator).toHaveAttribute("data-state", "unchecked");
      expect(indicator).toHaveAttribute("value", "on");

      expect(label).toHaveAttribute("for", indicator.id);
    });
  });
});
