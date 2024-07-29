import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-checkbox", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let root, indicator, input, label;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-checkbox data-testid="root">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      root = screen.getByTestId("root");
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
      expect(root).toBeInTheDocument();

      expect(indicator).toHaveAttribute("role", "checkbox");
      expect(indicator).toHaveAttribute("value", "on");

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "checkbox");
      expect(input).toHaveAttribute("aria-hidden", "true");
      expect(input).toHaveAttribute("tabindex", "-1");
      expect(input).toHaveAttribute("value", "on");
      expect(input).toBeScreenReaderOnly();

      expect(label).toHaveAttribute("for", indicator.id);
      expectCheckboxToBeChecked({ root, indicator, input, label }, false);
    });

    test("clicking indicator should toggle checkbox", async () => {
      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, true);
      });

      fireEvent.click(indicator);

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, false);
      });
    });

    test("clicking label should toggle checkbox", async () => {
      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, true);
      });

      fireEvent.click(label);

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, false);
      });
    });

    test("pressing space should toggle checkbox", async () => {
      fireEvent.keyDown(indicator, { key: " " });

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, true);
      });

      fireEvent.keyDown(indicator, { key: " " });

      await waitFor(() => {
        expectCheckboxToBeChecked({ root, indicator, input, label }, false);
      });
    });
  });

  describe("(x-checkbox='custom-value') custom value configuration", () => {
    const customValue = "custom-value";
    let root, indicator, input, label;

    beforeEach(async () => {
      document.body.innerHTML = `
        <div x-checkbox="${customValue}" data-testid="root">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      root = screen.getByTestId("root");
      indicator = screen.getByTestId("indicator");
      label = screen.getByTestId("label");

      await waitFor(() => {
        input = document.querySelector("input");

        if (!input) {
          throw new Error();
        }
      });
    });

    test("should use custom value", () => {
      expect(indicator).toHaveAttribute("value", customValue);
      expect(input).toHaveAttribute("value", customValue);
    });
  });

  describe("(x-checkbox.checked) checked by default configuration", () => {
    let root, indicator, input, label;

    beforeEach(async () => {
      document.body.innerHTML = html`
        <div x-checkbox.checked data-testid="root">
          <button x-checkbox:indicator data-testid="indicator"></button>
          <label x-checkbox:label data-testid="label"></label>
        </div>
      `;

      root = screen.getByTestId("root");
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
      expectCheckboxToBeChecked({ root, indicator, input, label }, true);
    });
  });
});

/**
 * @param {{ indicator: HTMLElement, input: HTMLInputElement }} elements
 * @param {boolean} isChecked
 */
function expectCheckboxToBeChecked(elements, isChecked) {
  const { root, indicator, input, label } = elements;

  expect(root).toHaveAttribute(
    "data-state",
    isChecked ? "checked" : "unchecked",
  );

  expect(indicator).toHaveAttribute(
    "aria-checked",
    isChecked ? "true" : "false",
  );

  expect(indicator).toHaveAttribute(
    "data-state",
    isChecked ? "checked" : "unchecked",
  );

  expect(input.checked).toBe(isChecked);

  expect(label).toHaveAttribute(
    "data-state",
    isChecked ? "checked" : "unchecked",
  );
}
