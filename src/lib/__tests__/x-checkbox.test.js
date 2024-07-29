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
      expect(indicator).toHaveAttribute("value", "on");

      expect(label).toHaveAttribute("for", indicator.id);
      expectCheckboxToBeChecked({ indicator }, false);
    });

    test("clicking indicator should toggle on checkbox", async () => {
      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, true);
      });
    });

    test("clicking indicator should toggle off checkbox", async () => {
      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, true);
      });

      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, false);
      });
    });

    test("clicking label should toggle on checkbox", async () => {
      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, true);
      });
    });

    test("clicking label should toggle off checkbox", async () => {
      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, true);
      });

      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator }, false);
      });
    });
  });

  describe("checked by default configuration", () => {
    let checkbox, indicator, label;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-checkbox.checked data-testid="checkbox">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      checkbox = getByTestId(document.body, "checkbox");
      indicator = getByTestId(document.body, "indicator");
      label = getByTestId(document.body, "label");
    });

    test("should be initially checked", () => {
      expectCheckboxToBeChecked({ indicator }, true);
    });
  });
});

/**
 * @param {{ indicator: HTMLElement }} elements
 * @param {boolean} checked
 */
function expectCheckboxToBeChecked(elements, checked) {
  const { indicator } = elements;

  expect(indicator).toHaveAttribute("aria-checked", checked ? "true" : "false");
  expect(indicator).toHaveAttribute(
    "data-state",
    checked ? "checked" : "unchecked",
  );
}
