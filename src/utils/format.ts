import type { RenameCaseMode, RenameSettings } from "../types";

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const escapeForCharClass = (value: string): string =>
  value.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

export const splitName = (name: string): { stem: string; extension: string } => {
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0) return { stem: name, extension: "" };
  return {
    stem: name.slice(0, lastDot),
    extension: name.slice(lastDot + 1),
  };
};

const toCamelCase = (text: string): string => {
  const words = text
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return text;
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
};

export const applyCase = (name: string, mode: RenameCaseMode): string => {
  if (mode === "lower") return name.toLowerCase();
  if (mode === "upper") return name.toUpperCase();
  if (mode === "camel") return toCamelCase(name);
  return name;
};

export const buildNewName = (
  originalName: string,
  index: number,
  settings: RenameSettings
): string => {
  const { stem, extension } = splitName(originalName);
  let nextStem = stem;

  if (settings.search) {
    try {
      if (settings.useRegex) {
        const pattern = new RegExp(settings.search, settings.regexFlags || "g");
        nextStem = nextStem.replace(pattern, settings.replace);
      } else {
        nextStem = nextStem.split(settings.search).join(settings.replace);
      }
    } catch {
      // Invalid regex => keep original stem.
    }
  }

  nextStem = `${settings.prefix}${nextStem}${settings.suffix}`;
  nextStem = applyCase(nextStem, settings.caseMode);

  if (settings.enableSequence) {
    const number = String(settings.sequenceStart + index).padStart(
      settings.sequencePad,
      "0"
    );
    const sequenceStem = settings.sequenceKeepStem
      ? `${nextStem}${settings.sequenceSeparator}${number}`
      : `${settings.sequenceBase}${settings.sequenceSeparator}${number}`;
    nextStem = sequenceStem;
  }

  if (settings.templateEnabled && settings.template.trim()) {
    const indexedNumber = String(settings.sequenceStart + index).padStart(
      settings.sequencePad,
      "0"
    );
    const rendered = settings.template
      .replaceAll("{name}", nextStem)
      .replaceAll("{original}", stem)
      .replaceAll("{ext}", extension)
      .replaceAll("{index}", indexedNumber);
    nextStem = rendered;
  }

  return extension ? `${nextStem}.${extension}` : nextStem;
};

export const extractPrefixBySeparators = (
  fileName: string,
  separators: string
): string => {
  const { stem } = splitName(fileName);
  const chars = separators.trim();
  if (!chars) return "";
  const classParts = chars
    .split("")
    .map((char) => escapeForCharClass(char))
    .join("");
  if (!classParts) return "";
  const segments = stem
    .split(new RegExp(`[${classParts}]+`))
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments[0] ?? "";
};
