import { describe, it, expect } from "vitest";
import { validateConflicts } from "./fileSystem";
import type { PreviewItem } from "../types";

function mockPreviewItem(
  fileName: string,
  newName: string,
  overrides?: Partial<PreviewItem>
): PreviewItem {
  return {
    file: {
      handle: {} as FileSystemFileHandle,
      name: fileName,
      size: 0,
    },
    extension: "",
    newName,
    changed: fileName !== newName,
    selected: false,
    willApply: true,
    ...overrides,
  };
}

describe("validateConflicts", () => {
  it("returns empty set when no conflicts", () => {
    const items: PreviewItem[] = [
      mockPreviewItem("a.txt", "x.txt"),
      mockPreviewItem("b.txt", "y.txt"),
    ];
    const allNames = ["a.txt", "b.txt"];
    expect(validateConflicts(items, allNames)).toEqual(new Set());
  });

  it("detects duplicate new names among items", () => {
    const items: PreviewItem[] = [
      mockPreviewItem("a.txt", "same.txt"),
      mockPreviewItem("b.txt", "same.txt"),
    ];
    const allNames = ["a.txt", "b.txt"];
    expect(validateConflicts(items, allNames)).toEqual(new Set(["same.txt"]));
  });

  it("detects conflict when new name equals an unchanged file", () => {
    const items: PreviewItem[] = [
      mockPreviewItem("a.txt", "b.txt"), // renaming a -> b, but b.txt already exists
    ];
    const allNames = ["a.txt", "b.txt"];
    expect(validateConflicts(items, allNames)).toEqual(new Set(["b.txt"]));
  });

  it("returns multiple conflicting names", () => {
    const items: PreviewItem[] = [
      mockPreviewItem("x.txt", "target.txt"),
      mockPreviewItem("y.txt", "target.txt"),
      mockPreviewItem("z.txt", "other.txt"),
    ];
    const allNames = ["x.txt", "y.txt", "z.txt", "other.txt"];
    expect(validateConflicts(items, allNames)).toEqual(
      new Set(["target.txt", "other.txt"])
    );
  });
});
