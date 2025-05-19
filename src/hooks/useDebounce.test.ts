import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  // Set up and restore the fake timers
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial value", 500));

    // Initial value should be returned immediately
    expect(result.current).toBe("initial value");
  });

  it("should delay updating the value until the specified delay has elapsed", () => {
    // Start with an initial value
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial value", delay: 500 },
    });

    // Initial value should be returned immediately
    expect(result.current).toBe("initial value");

    // Change the value
    rerender({ value: "updated value", delay: 500 });

    // Value should not change yet since the delay hasn't elapsed
    expect(result.current).toBe("initial value");

    // Fast-forward time by 250ms (half the delay)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Value should still not change
    expect(result.current).toBe("initial value");

    // Fast-forward time to complete the delay
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Now the value should be updated
    expect(result.current).toBe("updated value");
  });

  it("should handle multiple updates within the delay period", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial value", delay: 500 },
    });

    // Change the value multiple times
    rerender({ value: "update 1", delay: 500 });

    // Advance time a bit, but not enough to trigger the update
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Value should still be the initial value
    expect(result.current).toBe("initial value");

    // Change the value again before the delay has elapsed
    rerender({ value: "update 2", delay: 500 });

    // Advance time a bit more, but still not enough for the second update
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Value should still be the initial value
    expect(result.current).toBe("initial value");

    // Change the value one more time
    rerender({ value: "final update", delay: 500 });

    // Complete the delay for the last update
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Only the final update should be reflected
    expect(result.current).toBe("final update");
  });

  it("should handle delay changes", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial value", delay: 500 },
    });

    // Change the value and reduce the delay
    rerender({ value: "updated value", delay: 200 });

    // Advance time to complete the new shorter delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // The value should be updated with the shorter delay
    expect(result.current).toBe("updated value");

    // Change the value and increase the delay
    rerender({ value: "final value", delay: 1000 });

    // Advance time but not enough for the longer delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // The value should not be updated yet
    expect(result.current).toBe("updated value");

    // Complete the longer delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe("final value");
  });

  it("should clear timeout on unmount", () => {
    // Spy on clearTimeout
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    // Render the hook
    const { unmount } = renderHook(() => useDebounce("test", 500));

    // Unmount the component
    unmount();

    // Check if clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("should handle different types of values", () => {
    // Test with a number
    const { result: numberResult, rerender: numberRerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 42, delay: 500 },
    });

    expect(numberResult.current).toBe(42);

    // Update and complete delay
    numberRerender({ value: 100, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(numberResult.current).toBe(100);

    // Test with an object
    const { result: objectResult, rerender: objectRerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: { name: "John" }, delay: 500 },
    });

    expect(objectResult.current).toEqual({ name: "John" });

    // Update and complete delay
    objectRerender({ value: { name: "Jane" }, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(objectResult.current).toEqual({ name: "Jane" });
  });
});
