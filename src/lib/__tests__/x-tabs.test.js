import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-tabs", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    let tabs, list, tab1, tab2, panel1, panel2;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-tabs data-testid="tabs">
          <div x-tabs:list data-testid="list">
            <button x-tabs:tab="tab1" data-testid="tab1"></button>
            <button x-tabs:tab="tab2" data-testid="tab2"></button>
          </div>

          <div x-tabs:panel="tab1" data-testid="panel1"></div>
          <div x-tabs:panel="tab2" data-testid="panel2"></div>
        </div>
      `;

      tabs = getByTestId(document.body, "tabs");
      list = getByTestId(document.body, "list");
      tab1 = getByTestId(document.body, "tab1");
      tab2 = getByTestId(document.body, "tab2");
      panel1 = getByTestId(document.body, "panel1");
      panel2 = getByTestId(document.body, "panel2");
    });

    test("correct initial state", () => {
      expect(tabs).toBeInTheDocument();

      expect(list).toHaveAttribute("role", "tablist");
      expect(list).toHaveAttribute("tabindex", "0");

      expect(tab1).toHaveAttribute("role", "tab");
      expect(tab1).toHaveAttribute("aria-controls", panel1.id);

      expect(tab2).toHaveAttribute("role", "tab");
      expect(tab2).toHaveAttribute("aria-controls", panel2.id);
    });

    test("first tab should be selected", () => {
      expect(tab1).toHaveAttribute("tabindex", "0");
      expect(tab1).toHaveAttribute("aria-selected", "true");
      expect(tab1).toHaveAttribute("data-state", "active");

      expect(tab2).toHaveAttribute("tabindex", "-1");
      expect(tab2).toHaveAttribute("aria-selected", "false");
      expect(tab2).toHaveAttribute("data-state", "inactive");
    });
  });
});
