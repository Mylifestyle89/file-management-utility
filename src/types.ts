export type RenameCaseMode = "keep" | "lower" | "upper" | "camel";
export type SortMode = "alpha" | "extension" | "prefixMatch" | "suffixMatch";
export type ApplyScope = "all" | "selected";

export type FileRecord = {
  handle: FileSystemFileHandle;
  name: string;
  size: number;
};

export type PreviewItem = {
  file: FileRecord;
  extension: string;
  newName: string;
  changed: boolean;
  selected: boolean;
  willApply: boolean;
};

export type RenameSettings = {
  prefix: string;
  suffix: string;
  search: string;
  replace: string;
  useRegex: boolean;
  regexFlags: string;
  caseMode: RenameCaseMode;
  enableSequence: boolean;
  sequenceStart: number;
  sequencePad: number;
  sequenceSeparator: string;
  sequenceBase: string;
  sequenceKeepStem: boolean;
  templateEnabled: boolean;
  template: string;
};

export type RenameOperation = {
  from: string;
  to: string;
};

export type Preset = {
  id: string;
  name: string;
  settings: RenameSettings;
};

export type MoveToSubFolderResult = {
  moved: boolean;
  reason: "exists" | null;
};

export type SelectedDirectory = {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
};

export const MAX_SELECTED_DIRECTORIES = 10;
export const PRESETS_STORAGE_KEY = "rename_tool_presets_v1";

export const defaultSettings: RenameSettings = {
  prefix: "",
  suffix: "",
  search: "",
  replace: "",
  useRegex: false,
  regexFlags: "g",
  caseMode: "keep",
  enableSequence: false,
  sequenceStart: 1,
  sequencePad: 2,
  sequenceSeparator: "_",
  sequenceBase: "file",
  sequenceKeepStem: true,
  templateEnabled: false,
  template: "{name}",
};
