import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-checkbox", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let checkbox, indicator, input, label;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-checkbox data-testid="checkbox">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      checkbox = screen.getByTestId("checkbox");
      indicator = screen.getByTestId("indicator");
      label = screen.getByTestId("label");

      /**
       * Wait for x-checkbox to insert the input element.
       *
       * Since input is inserted by x-checkbox, we cannot use
       * any testing-library queries and will have to
       * throw our own error for waitFor to catch and retry
       * until the input is inserted.
       */
      await waitFor(() => {
        input = document.querySelector("input");

        if (!input) {
          throw new Error();
        }
      });
    });

    test("correct initial state", () => {
      expect(checkbox).toBeInTheDocument();

      expect(indicator).toHaveAttribute("role", "checkbox");
      expect(indicator).toHaveAttribute("value", "on");

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "checkbox");
      expect(input).toHaveAttribute("aria-hidden", "true");
      expect(input).toHaveAttribute("tabindex", "-1");
      expect(input).toHaveAttribute("value", "on");

      expect(label).toHaveAttribute("for", indicator.id);
      expectCheckboxToBeChecked({ indicator, input }, false);
    });

    test("clicking indicator should toggle on checkbox", async () => {
      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, true);
      });
    });

    test("clicking indicator should toggle off checkbox", async () => {
      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, true);
      });

      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, false);
      });
    });

    test("clicking label should toggle on checkbox", async () => {
      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, true);
      });
    });

    test("clicking label should toggle off checkbox", async () => {
      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, true);
      });

      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ indicator, input }, false);
      });
    });
  });

  describe("checked by default configuration", () => {
    let checkbox, indicator, input, label;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-checkbox.checked data-testid="checkbox">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      checkbox = screen.getByTestId("checkbox");
      indicator = screen.getByTestId("indicator");
      label = screen.getByTestId("label");

      await waitFor(() => {
        input = document.querySelector("input");

        if (!input) {
          throw new Error();
        }
      });
    });

    test("should be initially checked", () => {
      expectCheckboxToBeChecked({ indicator, input }, true);
    });
  });
});

/**
 * @param {{ indicator: HTMLElement, input: HTMLInputElement }} elements
 * @param {boolean} isChecked
 */
function expectCheckboxToBeChecked(elements, isChecked) {
  const { indicator, input } = elements;

  expect(indicator).toHaveAttribute(
    "aria-checked",
    isChecked ? "true" : "false",
  );

  expect(indicator).toHaveAttribute(
    "data-state",
    isChecked ? "checked" : "unchecked",
  );

  expect(input.checked).toBe(isChecked);
}
