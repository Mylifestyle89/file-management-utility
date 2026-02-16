import { describe, it, expect } from "vitest";
import {
  formatBytes,
  escapeForCharClass,
  splitName,
  applyCase,
  buildNewName,
  extractPrefixBySeparators,
} from "./format";
import { defaultSettings } from "../types";

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(500)).toBe("500 B");
  });
  it("formats KB", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
  it("formats MB and GB", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.0 GB");
  });
});

describe("escapeForCharClass", () => {
  it("escapes special regex chars", () => {
    expect(escapeForCharClass("-")).toBe("\\-");
    expect(escapeForCharClass(".")).toBe("\\.");
  });
});

describe("splitName", () => {
  it("splits stem and extension", () => {
    expect(splitName("file.txt")).toEqual({ stem: "file", extension: "txt" });
    expect(splitName("a.b.c")).toEqual({ stem: "a.b", extension: "c" });
  });
  it("returns full name as stem when no extension", () => {
    expect(splitName("noext")).toEqual({ stem: "noext", extension: "" });
  });
  it("treats leading dot as no extension", () => {
    expect(splitName(".hidden")).toEqual({ stem: ".hidden", extension: "" });
  });
});

describe("applyCase", () => {
  it("keeps name when mode is keep", () => {
    expect(applyCase("Hello World", "keep")).toBe("Hello World");
  });
  it("lowercases when mode is lower", () => {
    expect(applyCase("Hello World", "lower")).toBe("hello world");
  });
  it("uppercases when mode is upper", () => {
    expect(applyCase("Hello World", "upper")).toBe("HELLO WORLD");
  });
  it("converts to camelCase when mode is camel", () => {
    expect(applyCase("hello world", "camel")).toBe("helloWorld");
    expect(applyCase("some_file-name", "camel")).toBe("someFileName");
  });
});

describe("buildNewName", () => {
  it("returns same name with default settings", () => {
    expect(buildNewName("photo.jpg", 0, defaultSettings)).toBe("photo.jpg");
  });
  it("adds prefix and suffix", () => {
    expect(
      buildNewName("a.txt", 0, { ...defaultSettings, prefix: "x-", suffix: "-y" })
    ).toBe("x-a-y.txt");
  });
  it("replaces search with replace (plain)", () => {
    expect(
      buildNewName("hello.txt", 0, {
        ...defaultSettings,
        search: "hello",
        replace: "world",
      })
    ).toBe("world.txt");
  });
  it("replaces with regex when useRegex", () => {
    expect(
      buildNewName("abc123.txt", 0, {
        ...defaultSettings,
        search: "\\d+",
        replace: "",
        useRegex: true,
        regexFlags: "g",
      })
    ).toBe("abc.txt");
  });
  it("adds sequence when enableSequence", () => {
    expect(
      buildNewName("f.txt", 0, {
        ...defaultSettings,
        enableSequence: true,
        sequenceStart: 1,
        sequencePad: 2,
        sequenceSeparator: "_",
        sequenceKeepStem: true,
      })
    ).toBe("f_01.txt");
    expect(
      buildNewName("f.txt", 1, {
        ...defaultSettings,
        enableSequence: true,
        sequenceStart: 1,
        sequencePad: 2,
        sequenceSeparator: "_",
        sequenceKeepStem: true,
      })
    ).toBe("f_02.txt");
  });
  it("uses template when templateEnabled", () => {
    // template output becomes stem, then extension is appended
    expect(
      buildNewName("old.pdf", 0, {
        ...defaultSettings,
        templateEnabled: true,
        template: "{name}-{index}",
      })
    ).toBe("old-01.pdf");
  });
});

describe("extractPrefixBySeparators", () => {
  it("returns first segment before separator", () => {
    expect(extractPrefixBySeparators("Cao Phuong Nam_abc.pdf", "-_.")).toBe(
      "Cao Phuong Nam"
    );
  });
  it("returns empty when no separators", () => {
    expect(extractPrefixBySeparators("file.pdf", "")).toBe("");
  });
  it("returns stem when no separator in name", () => {
    expect(extractPrefixBySeparators("single.pdf", "-_")).toBe("single");
  });
});
