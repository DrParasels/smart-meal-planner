import "@testing-library/jest-dom";

if (typeof window !== "undefined") {
  // AntD / rc-* часто используют matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // AntD измеряет элементы через ResizeObserver
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });

  // Иногда вызывается в компонентах/либах
  window.scrollTo = jest.fn();

  // jsdom не реализует requestSubmit; user-event клик по submit внутри формы его вызывает
  Object.defineProperty(HTMLFormElement.prototype, "requestSubmit", {
    configurable: true,
    writable: true,
    value(this: HTMLFormElement, submitter?: HTMLElement) {
      if (submitter) {
        submitter.click();
        return;
      }
      this.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    },
  });

  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });

  window.getComputedStyle = jest.fn(
    () =>
      ({
        getPropertyValue: () => "",
      }) as unknown as CSSStyleDeclaration,
  ) as unknown as typeof window.getComputedStyle;
}