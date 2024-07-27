import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";

import { html, initializeAlpine } from "./utils";

describe("x-accordion", () => {
  beforeAll(initializeAlpine);

  describe("default configuration", () => {
    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-data x-accordion>
          <div x-accordion:item data-testid="item-1">
            <button x-accordion:trigger data-testid="trigger-1"></button>
            <div x-accordion:content data-testid="content-1"></div>
          </div>

          <div x-accordion:item data-testid="item-2">
            <button x-accordion:trigger data-testid="trigger-2"></button>
            <div x-accordion:content data-testid="content-2"></div>
          </div>
        </div>
      `;
    });

    test("correct initial state", () => {
      const item = getByTestId(document.body, "item-1");
      const trigger = getByTestId(document.body, "trigger-1");
      const content = getByTestId(document.body, "content-1");

      expect(item).toHaveAttribute("data-state", "closed");

      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-controls", content.id);

      expect(content).toHaveAttribute("aria-labelledby", trigger.id);
      expect(content).toHaveAttribute("role", "region");
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).not.toBeVisible();
    });

    describe("opening tabs", () => {
      test("should open a tab when clicked", async () => {
        const item = getByTestId(document.body, "item-1");
        const trigger = getByTestId(document.body, "trigger-1");
        const content = getByTestId(document.body, "content-1");

        fireEvent.click(trigger);

        await waitFor(() => {
          expect(item).toHaveAttribute("data-state", "open");

          expect(trigger).toHaveAttribute("data-state", "open");
          expect(trigger).toHaveAttribute("aria-expanded", "true");

          expect(content).toHaveAttribute("data-state", "open");
          expect(content).toBeVisible();
        });
      });

      test("should be able to open multiple tabs", async () => {
        const item1 = getByTestId(document.body, "item-1");
        const trigger1 = getByTestId(document.body, "trigger-1");
        const content1 = getByTestId(document.body, "content-1");

        const item2 = getByTestId(document.body, "item-2");
        const trigger2 = getByTestId(document.body, "trigger-2");
        const content2 = getByTestId(document.body, "content-2");

        fireEvent.click(trigger1);
        fireEvent.click(trigger2);

        await waitFor(() => {
          expect(item1).toHaveAttribute("data-state", "open");
          expect(trigger1).toHaveAttribute("data-state", "open");
          expect(trigger1).toHaveAttribute("aria-expanded", "true");
          expect(content1).toHaveAttribute("data-state", "open");
          expect(content1).toBeVisible();

          expect(item2).toHaveAttribute("data-state", "open");
          expect(trigger2).toHaveAttribute("data-state", "open");
          expect(trigger2).toHaveAttribute("aria-expanded", "true");
          expect(content2).toHaveAttribute("data-state", "open");
          expect(content2).toBeVisible();
        });
      });
    });

    describe("keyboard navigation", () => {
      test("pressing down arrow should move focus to the next trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing down arrow on the last trigger should not loop", async () => {
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing up arrow should move focus to the previous trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing up arrow on the first trigger should not loop", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");

        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing home should move focus to the first trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "Home" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing end should move focus to the last trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "End" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });
    });
  });

  describe("single tab only configuration (x-accordion.single)", () => {
    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-data x-accordion.single>
          <div x-accordion:item data-testid="item-1">
            <button x-accordion:trigger data-testid="trigger-1"></button>
            <div x-accordion:content data-testid="content-1"></div>
          </div>

          <div x-accordion:item data-testid="item-2">
            <button x-accordion:trigger data-testid="trigger-2"></button>
            <div x-accordion:content data-testid="content-2"></div>
          </div>
        </div>
      `;
    });

    describe("opening tabs", () => {
      test("should only open one tab at a time", async () => {
        const item1 = getByTestId(document.body, "item-1");
        const trigger1 = getByTestId(document.body, "trigger-1");
        const content1 = getByTestId(document.body, "content-1");

        const item2 = getByTestId(document.body, "item-2");
        const trigger2 = getByTestId(document.body, "trigger-2");
        const content2 = getByTestId(document.body, "content-2");

        fireEvent.click(trigger1);

        await waitFor(() => {
          expect(item1).toHaveAttribute("data-state", "open");
          expect(trigger1).toHaveAttribute("data-state", "open");
          expect(trigger1).toHaveAttribute("aria-expanded", "true");
          expect(content1).toHaveAttribute("data-state", "open");
          expect(content1).toBeVisible();

          expect(item2).toHaveAttribute("data-state", "closed");
          expect(trigger2).toHaveAttribute("data-state", "closed");
          expect(trigger2).toHaveAttribute("aria-expanded", "false");
          expect(content2).toHaveAttribute("data-state", "closed");
          expect(content2).not.toBeVisible();
        });

        fireEvent.click(trigger2);

        await waitFor(() => {
          expect(item1).toHaveAttribute("data-state", "closed");
          expect(trigger1).toHaveAttribute("data-state", "closed");
          expect(trigger1).toHaveAttribute("aria-expanded", "false");
          expect(content1).toHaveAttribute("data-state", "closed");
          expect(content1).not.toBeVisible();

          expect(item2).toHaveAttribute("data-state", "open");
          expect(trigger2).toHaveAttribute("data-state", "open");
          expect(trigger2).toHaveAttribute("aria-expanded", "true");
          expect(content2).toHaveAttribute("data-state", "open");
          expect(content2).toBeVisible();
        });
      });
    });
  });

  describe("looping keyboard navigation configuration (x-accordion.loop)", () => {
    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-data x-accordion.loop>
          <div x-accordion:item data-testid="item-1">
            <button x-accordion:trigger data-testid="trigger-1"></button>
            <div x-accordion:content data-testid="content-1"></div>
          </div>

          <div x-accordion:item data-testid="item-2">
            <button x-accordion:trigger data-testid="trigger-2"></button>
            <div x-accordion:content data-testid="content-2"></div>
          </div>
        </div>
      `;
    });

    describe("keyboard navigation", () => {
      test("pressing down arrow on the last trigger should loop", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing up arrow on the first trigger should loop", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });
    });
  });

  describe("horizontal keyboard navigation configuration (x-accordion.horizontal)", () => {
    beforeEach(() => {
      document.body.innerHTML = html`
        <div x-data x-accordion.horizontal>
          <div x-accordion:item data-testid="item-1">
            <button x-accordion:trigger data-testid="trigger-1"></button>
            <div x-accordion:content data-testid="content-1"></div>
          </div>

          <div x-accordion:item data-testid="item-2">
            <button x-accordion:trigger data-testid="trigger-2"></button>
            <div x-accordion:content data-testid="content-2"></div>
          </div>
        </div>
      `;
    });

    describe("keyboard navigation", () => {
      test("pressing right arrow should move focus to the next trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowRight" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing left arrow should move focus to the previous trigger", async () => {
        const trigger1 = getByTestId(document.body, "trigger-1");
        const trigger2 = getByTestId(document.body, "trigger-2");

        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowLeft" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });
    });
  });
});
