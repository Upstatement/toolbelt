import { expect, describe, beforeAll, beforeEach, test } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

import { createMockCustomEventListener, html, initializeAlpine } from "./utils";

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
      const item = screen.getByTestId("item-1");
      const trigger = screen.getByTestId("trigger-1");
      const content = screen.getByTestId("content-1");

      expect(item).toHaveAttribute("data-state", "closed");

      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-controls", content.id);

      expect(content).toHaveAttribute("aria-labelledby", trigger.id);
      expect(content).toHaveAttribute("role", "region");
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).not.toBeVisible();
    });

    describe("toggling items", () => {
      test("should open and close an item when clicked", async () => {
        const item = screen.getByTestId("item-1");
        const trigger = screen.getByTestId("trigger-1");
        const content = screen.getByTestId("content-1");

        fireEvent.click(trigger);

        await waitFor(() => {
          expectItemToBeOpen({ item, trigger, content }, true);
        });

        fireEvent.click(trigger);

        await waitFor(() => {
          expectItemToBeOpen({ item, trigger, content }, false);
        });
      });

      test("should be able to open multiple items", async () => {
        const item1 = screen.getByTestId("item-1");
        const trigger1 = screen.getByTestId("trigger-1");
        const content1 = screen.getByTestId("content-1");

        const item2 = screen.getByTestId("item-2");
        const trigger2 = screen.getByTestId("trigger-2");
        const content2 = screen.getByTestId("content-2");

        fireEvent.click(trigger1);
        fireEvent.click(trigger2);

        await waitFor(() => {
          expectItemToBeOpen(
            { item: item1, trigger: trigger1, content: content1 },
            true,
          );

          expectItemToBeOpen(
            { item: item2, trigger: trigger2, content: content2 },
            true,
          );
        });
      });
    });

    describe("custom events", () => {
      test("should indicate item is open", async () => {
        const item = screen.getByTestId("item-1");
        const trigger = screen.getByTestId("trigger-1");
        const content = screen.getByTestId("content-1");

        const listener = createMockCustomEventListener();

        item.addEventListener("accordion:change", listener);
        trigger.addEventListener("accordion:change", listener);
        content.addEventListener("accordion:change", listener);

        fireEvent.click(trigger);

        await waitFor(() => {
          expect(listener).toHaveBeenCalledTimes(3);
          expect(listener).toHaveReturnedWith([item, { open: true }]);
          expect(listener).toHaveReturnedWith([trigger, { open: true }]);
          expect(listener).toHaveReturnedWith([content, { open: true }]);
        });
      });

      test("should indicate item is closed", async () => {
        const item = screen.getByTestId("item-1");
        const trigger = screen.getByTestId("trigger-1");
        const content = screen.getByTestId("content-1");

        const listener = createMockCustomEventListener();

        fireEvent.click(trigger);
        await waitFor(() => {});

        item.addEventListener("accordion:change", listener);
        trigger.addEventListener("accordion:change", listener);
        content.addEventListener("accordion:change", listener);

        fireEvent.click(trigger);

        await waitFor(() => {
          expect(listener).toHaveBeenCalledTimes(3);
          expect(listener).toHaveReturnedWith([item, { open: false }]);
          expect(listener).toHaveReturnedWith([trigger, { open: false }]);
          expect(listener).toHaveReturnedWith([content, { open: false }]);
        });
      });
    });

    describe("keyboard navigation", () => {
      let trigger1, trigger2;

      beforeEach(() => {
        trigger1 = screen.getByTestId("trigger-1");
        trigger2 = screen.getByTestId("trigger-2");
      });

      test("pressing down arrow should move focus to the next trigger", async () => {
        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing down arrow on the last trigger should not loop", async () => {
        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing up arrow should move focus to the previous trigger", async () => {
        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing up arrow on the first trigger should not loop", async () => {
        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing home should move focus to the first trigger", async () => {
        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "Home" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing end should move focus to the last trigger", async () => {
        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "End" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });
    });
  });

  describe("(x-accordion.single) single item only configuration", () => {
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

    describe("opening items", () => {
      test("should only open one item at a time", async () => {
        const item1 = screen.getByTestId("item-1");
        const trigger1 = screen.getByTestId("trigger-1");
        const content1 = screen.getByTestId("content-1");

        const item2 = screen.getByTestId("item-2");
        const trigger2 = screen.getByTestId("trigger-2");
        const content2 = screen.getByTestId("content-2");

        fireEvent.click(trigger1);

        await waitFor(() => {
          expectItemToBeOpen(
            { item: item1, trigger: trigger1, content: content1 },
            true,
          );

          expectItemToBeOpen(
            { item: item2, trigger: trigger2, content: content2 },
            false,
          );
        });

        fireEvent.click(trigger2);

        await waitFor(() => {
          expectItemToBeOpen(
            { item: item1, trigger: trigger1, content: content1 },
            false,
          );

          expectItemToBeOpen(
            { item: item2, trigger: trigger2, content: content2 },
            true,
          );
        });
      });
    });

    describe("custom events", () => {
      test("should trigger separate events for opened and closed items.", async () => {
        const item1 = screen.getByTestId("item-1");
        const trigger1 = screen.getByTestId("trigger-1");
        const content1 = screen.getByTestId("content-1");

        const item2 = screen.getByTestId("item-2");
        const trigger2 = screen.getByTestId("trigger-2");
        const content2 = screen.getByTestId("content-2");

        fireEvent.click(trigger1);

        await waitFor(() => {});

        const listener = createMockCustomEventListener();

        item1.addEventListener("accordion:change", listener);
        trigger1.addEventListener("accordion:change", listener);
        content1.addEventListener("accordion:change", listener);

        item2.addEventListener("accordion:change", listener);
        trigger2.addEventListener("accordion:change", listener);
        content2.addEventListener("accordion:change", listener);

        fireEvent.click(trigger2);

        await waitFor(() => {
          expect(listener).toHaveBeenCalledTimes(6);

          expect(listener).toHaveReturnedWith([item1, { open: false }]);
          expect(listener).toHaveReturnedWith([trigger1, { open: false }]);
          expect(listener).toHaveReturnedWith([content1, { open: false }]);

          expect(listener).toHaveReturnedWith([item2, { open: true }]);
          expect(listener).toHaveReturnedWith([trigger2, { open: true }]);
          expect(listener).toHaveReturnedWith([content2, { open: true }]);
        });
      });
    });
  });

  describe("(x-accordion.loop) looping keyboard navigation configuration", () => {
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
      let trigger1, trigger2;

      beforeEach(() => {
        trigger1 = screen.getByTestId("trigger-1");
        trigger2 = screen.getByTestId("trigger-2");
      });

      test("pressing down arrow on the last trigger should loop", async () => {
        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowDown" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });

      test("pressing up arrow on the first trigger should loop", async () => {
        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowUp" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });
    });
  });

  describe("(x-accordion.horizontal) horizontal keyboard navigation configuration", () => {
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
      let trigger1, trigger2;

      beforeEach(() => {
        trigger1 = screen.getByTestId("trigger-1");
        trigger2 = screen.getByTestId("trigger-2");
      });

      test("pressing right arrow should move focus to the next trigger", async () => {
        trigger1.focus();
        fireEvent.keyDown(trigger1, { key: "ArrowRight" });

        await waitFor(() => {
          expect(trigger2).toHaveFocus();
        });
      });

      test("pressing left arrow should move focus to the previous trigger", async () => {
        trigger2.focus();
        fireEvent.keyDown(trigger2, { key: "ArrowLeft" });

        await waitFor(() => {
          expect(trigger1).toHaveFocus();
        });
      });
    });
  });
});

/**
 * @param {{ item: HTMLElement, trigger: HTMLElement, content: HTMLElement }} elements
 * @param {boolean} isOpen
 */
function expectItemToBeOpen(elements, isOpen) {
  const { item, trigger, content } = elements;

  expect(item).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  expect(trigger).toHaveAttribute("data-state", isOpen ? "open" : "closed");
  expect(trigger).toHaveAttribute("aria-expanded", isOpen ? "true" : "false");

  expect(content).toHaveAttribute("data-state", isOpen ? "open" : "closed");

  if (isOpen) {
    expect(content).toBeVisible();
  } else {
    expect(content).not.toBeVisible();
  }
}
