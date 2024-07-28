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

      expect(panel1).toHaveAttribute("role", "tabpanel");
      expect(panel1).toHaveAttribute("aria-labelledby", tab1.id);

      expect(panel2).toHaveAttribute("role", "tabpanel");
      expect(panel2).toHaveAttribute("aria-labelledby", tab2.id);
    });

    describe("opening tabs", () => {
      test("first tab should be selected by default", () => {
        expect(tab1).toHaveAttribute("tabindex", "0");
        expect(tab1).toHaveAttribute("aria-selected", "true");
        expect(tab1).toHaveAttribute("data-state", "active");

        expect(tab2).toHaveAttribute("tabindex", "-1");
        expect(tab2).toHaveAttribute("aria-selected", "false");
        expect(tab2).toHaveAttribute("data-state", "inactive");

        expect(panel1).toHaveAttribute("tabindex", "0");
        expect(panel1).toHaveAttribute("data-state", "active");
        expect(panel1).toBeVisible();

        expect(panel2).toHaveAttribute("tabindex", "-1");
        expect(panel2).toHaveAttribute("data-state", "inactive");
        expect(panel2).not.toBeVisible();
      });

      test("should open a tab", async () => {
        fireEvent.click(tab2);

        await waitFor(() => {
          expectTabToBeSelected({ tab: tab1, panel: panel1 }, false);
          expectTabToBeSelected({ tab: tab2, panel: panel2 }, true);
        });
      });
    });

    describe("keyboard navigation", () => {
      test("pressing right arrow should move focus to the next tab", async () => {
        fireEvent.keyDown(tab1, { key: "ArrowRight" });

        await waitFor(() => {
          expect(tab2).toHaveFocus();
        });
      });

      test("pressing right arrow on the last tab should not loop", async () => {
        fireEvent.keyDown(tab2, { key: "ArrowRight" });

        await waitFor(() => {
          expect(tab2).toHaveFocus();
        });
      });

      test("pressing left arrow should move focus to the previous tab", async () => {
        fireEvent.keyDown(tab2, { key: "ArrowLeft" });

        await waitFor(() => {
          expect(tab1).toHaveFocus();
        });
      });

      test("pressing left arrow on the first tab should not loop", async () => {
        fireEvent.keyDown(tab1, { key: "ArrowLeft" });

        await waitFor(() => {
          expect(tab1).toHaveFocus();
        });
      });

      test("pressing home should move focus to the first tab", async () => {
        fireEvent.keyDown(tab2, { key: "Home" });

        await waitFor(() => {
          expect(tab1).toHaveFocus();
        });
      });

      test("pressing end should move focus to the last tab", async () => {
        fireEvent.keyDown(tab1, { key: "End" });

        await waitFor(() => {
          expect(tab2).toHaveFocus();
        });
      });
    });
  });

  describe("(x-tabs:list.loop) looping keyboard navigation configuration", () => {
    let tab1, tab2;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-tabs data-testid="tabs">
          <div x-tabs:list.loop data-testid="list">
            <button x-tabs:tab="tab1" data-testid="tab1"></button>
            <button x-tabs:tab="tab2" data-testid="tab2"></button>
          </div>

          <div x-tabs:panel="tab1" data-testid="panel1"></div>
          <div x-tabs:panel="tab2" data-testid="panel2"></div>
        </div>
      `;

      tab1 = getByTestId(document.body, "tab1");
      tab2 = getByTestId(document.body, "tab2");
    });

    describe("keyboard navigation", () => {
      test("pressing right arrow on the last tab should loop", async () => {
        fireEvent.keyDown(tab2, { key: "ArrowRight" });

        await waitFor(() => {
          expect(tab1).toHaveFocus();
        });
      });

      test("pressing left arrow on the first tab should loop", async () => {
        fireEvent.keyDown(tab1, { key: "ArrowLeft" });

        await waitFor(() => {
          expect(tab2).toHaveFocus();
        });
      });
    });
  });

  describe("(x-tabs:list.automatic) automatic tab selection configuration", () => {
    let tab1, tab2, panel1, panel2;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-tabs data-testid="tabs">
          <div x-tabs:list.automatic data-testid="list">
            <button x-tabs:tab="tab1" data-testid="tab1"></button>
            <button x-tabs:tab="tab2" data-testid="tab2"></button>
          </div>

          <div x-tabs:panel="tab1" data-testid="panel1"></div>
          <div x-tabs:panel="tab2" data-testid="panel2"></div>
        </div>
      `;

      tab1 = getByTestId(document.body, "tab1");
      tab2 = getByTestId(document.body, "tab2");
      panel1 = getByTestId(document.body, "panel1");
      panel2 = getByTestId(document.body, "panel2");
    });

    describe("keyboard navigation", () => {
      test("pressing right arrow should automatically open the next tab", async () => {
        fireEvent.keyDown(tab1, { key: "ArrowRight" });

        await waitFor(() => {
          expectTabToBeSelected({ tab: tab1, panel: panel1 }, false);
          expectTabToBeSelected({ tab: tab2, panel: panel2 }, true);
        });
      });

      test("pressing left arrow should automatically open the previous tab", async () => {
        fireEvent.keyDown(tab2, { key: "ArrowLeft" });

        await waitFor(() => {
          expectTabToBeSelected({ tab: tab1, panel: panel1 }, true);
          expectTabToBeSelected({ tab: tab2, panel: panel2 }, false);
        });
      });

      test("pressing home should automatically open the first tab", async () => {
        fireEvent.keyDown(tab2, { key: "Home" });

        await waitFor(() => {
          expectTabToBeSelected({ tab: tab1, panel: panel1 }, true);
          expectTabToBeSelected({ tab: tab2, panel: panel2 }, false);
        });
      });

      test("pressing end should automatically open the last tab", async () => {
        fireEvent.keyDown(tab1, { key: "End" });

        await waitFor(() => {
          expectTabToBeSelected({ tab: tab1, panel: panel1 }, false);
          expectTabToBeSelected({ tab: tab2, panel: panel2 }, true);
        });
      });
    });
  });

  describe("(x-tabs:list.vertical) vertical keyboard navigation configuration", () => {
    let tab1, tab2, panel1, panel2;

    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-tabs data-testid="tabs">
          <div x-tabs:list.vertical data-testid="list">
            <button x-tabs:tab="tab1" data-testid="tab1"></button>
            <button x-tabs:tab="tab2" data-testid="tab2"></button>
          </div>

          <div x-tabs:panel="tab1" data-testid="panel1"></div>
          <div x-tabs:panel="tab2" data-testid="panel2"></div>
        </div>
      `;

      tab1 = getByTestId(document.body, "tab1");
      tab2 = getByTestId(document.body, "tab2");
      panel1 = getByTestId(document.body, "panel1");
      panel2 = getByTestId(document.body, "panel2");
    });

    describe("keyboard navigation", () => {
      test("pressing down arrow should move focus to the next tab", async () => {
        fireEvent.keyDown(tab1, { key: "ArrowDown" });

        await waitFor(() => {
          expect(tab2).toHaveFocus();
        });
      });

      test("pressing up arrow should move focus to the previous tab", async () => {
        fireEvent.keyDown(tab2, { key: "ArrowUp" });

        await waitFor(() => {
          expect(tab1).toHaveFocus();
        });
      });
    });
  });
});

/**
 * @param {{ tab: HTMLElement, panel: HTMLElement }} elements
 * @param {boolean} isSelected
 */
function expectTabToBeSelected(elements, isSelected) {
  const { tab, panel } = elements;

  expect(tab).toHaveAttribute("tabindex", isSelected ? "0" : "-1");
  expect(tab).toHaveAttribute("aria-selected", isSelected ? "true" : "false");
  expect(tab).toHaveAttribute("data-state", isSelected ? "active" : "inactive");

  expect(panel).toHaveAttribute("tabindex", isSelected ? "0" : "-1");
  expect(panel).toHaveAttribute(
    "data-state",
    isSelected ? "active" : "inactive",
  );

  if (isSelected) {
    expect(panel).toBeVisible();
  } else {
    expect(panel).not.toBeVisible();
  }
}
