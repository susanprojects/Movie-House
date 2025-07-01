import { describe, it, expect } from "vitest";
import { useStripTags } from "./useStripTags";

describe("useStripTags", () => {
  it("removes HTML tags from a string", () => {
    const { stripTags } = useStripTags();
    const input = "<p>This is <strong>bold</strong> text.</p>";
    const output = stripTags(input);
    expect(output).toBe("This is bold text.");
  });

  it("returns an empty string when input is empty", () => {
    const { stripTags } = useStripTags();
    expect(stripTags("")).toBe("");
  });

  it("handles null or undefined input gracefully", () => {
    const { stripTags } = useStripTags();
    expect(stripTags(undefined as unknown as string)).toBe("");
    expect(stripTags(null as unknown as string)).toBe("");
  });
});
