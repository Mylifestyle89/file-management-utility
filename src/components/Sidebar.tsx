import { Edit, Folder, Moon, Sun } from "lucide-react";
import type {
  ApplyScope,
  Preset,
  RenameCaseMode,
  RenameSettings,
  SelectedDirectory,
  SortMode,
} from "../types";
import { MAX_SELECTED_DIRECTORIES } from "../types";

type SidebarProps = {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  unsupported: boolean;
  busy: boolean;
  directoryHandle: FileSystemDirectoryHandle | null;
  selectedDirectories: SelectedDirectory[];
  selectedDirectoryIds: Set<string>;
  directoryHandleActive: FileSystemDirectoryHandle | null;
  filterText: string;
  filterExt: string;
  applyScope: ApplyScope;
  prefixSeparators: string;
  allFilteredSelected: boolean;
  presets: Preset[];
  presetName: string;
  sortMode: SortMode;
  sortPrefix: string;
  sortSuffix: string;
  settings: RenameSettings;
  onPickDirectory: (mode: "replace" | "append") => void;
  onSwitchActiveDirectory: (id: string) => void;
  onRemoveDirectory: (id: string) => void;
  onToggleDirectorySelection: (id: string) => void;
  onSetAllDirectoriesSelected: (value: boolean) => void;
  onFilterTextChange: (value: string) => void;
  onFilterExtChange: (value: string) => void;
  onApplyScopeChange: (value: ApplyScope) => void;
  onSetAllFilteredSelected: (value: boolean) => void;
  onPrefixSeparatorsChange: (value: string) => void;
  onOrganizeIntoSubFoldersByPrefix: () => void;
  onPresetNameChange: (value: string) => void;
  onSavePreset: () => void;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
  onSortModeChange: (value: SortMode) => void;
  onSortPrefixChange: (value: string) => void;
  onSortSuffixChange: (value: string) => void;
  onSettingsChange: (settings: RenameSettings) => void;
  selectedDirectoryCount: number;
  allDirectoriesSelected: boolean;
};

export function Sidebar({
  darkMode,
  onDarkModeToggle,
  unsupported,
  busy,
  directoryHandle,
  selectedDirectories,
  selectedDirectoryIds,
  directoryHandleActive,
  filterText,
  filterExt,
  applyScope,
  prefixSeparators,
  allFilteredSelected,
  presets,
  presetName,
  sortMode,
  sortPrefix,
  sortSuffix,
  settings,
  onPickDirectory,
  onSwitchActiveDirectory,
  onRemoveDirectory,
  onToggleDirectorySelection,
  onSetAllDirectoriesSelected,
  onFilterTextChange,
  onFilterExtChange,
  onApplyScopeChange,
  onSetAllFilteredSelected,
  onPrefixSeparatorsChange,
  onOrganizeIntoSubFoldersByPrefix,
  onPresetNameChange,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onSortModeChange,
  onSortPrefixChange,
  onSortSuffixChange,
  onSettingsChange,
  selectedDirectoryCount,
  allDirectoriesSelected,
}: SidebarProps) {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-[360px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <Edit className="h-4 w-4" />
          Công cụ đổi tên
        </div>
        <button
          type="button"
          onClick={onDarkModeToggle}
          className="rounded-lg border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onPickDirectory("replace")}
          disabled={unsupported || busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Folder className="h-4 w-4" />
          Chọn lại
        </button>
        <button
          type="button"
          onClick={() => onPickDirectory("append")}
          disabled={
            unsupported ||
            busy ||
            selectedDirectories.length >= MAX_SELECTED_DIRECTORIES
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Folder className="h-4 w-4" />
          Thêm thư mục
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Danh sách thư mục ({selectedDirectories.length}/
          {MAX_SELECTED_DIRECTORIES})
        </p>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Đã tick {selectedDirectoryCount}/{selectedDirectories.length} thư mục
          </p>
          <button
            type="button"
            onClick={() => onSetAllDirectoriesSelected(!allDirectoriesSelected)}
            disabled={selectedDirectories.length === 0}
            className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {allDirectoriesSelected ? "Bỏ tick tất cả" : "Tick tất cả"}
          </button>
        </div>
        <div className="max-h-28 space-y-1 overflow-auto">
          {selectedDirectories.map((item) => {
            const isActive = item.handle === directoryHandleActive;
            const isChecked = selectedDirectoryIds.has(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-md border px-2 py-1 ${
                  isActive
                    ? "border-blue-500/60 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <label className="mr-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleDirectorySelection(item.id)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onSwitchActiveDirectory(item.id)}
                  className="flex-1 truncate text-left text-xs hover:underline"
                  title={item.name}
                >
                  {item.name}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveDirectory(item.id)}
                  className="text-xs text-rose-500"
                >
                  Xóa
                </button>
              </div>
            );
          })}
          {selectedDirectories.length === 0 && (
            <p className="text-xs text-slate-500">Chưa có thư mục nào.</p>
          )}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Có thể chọn tối đa {MAX_SELECTED_DIRECTORIES} thư mục trong một lần
          thao tác.
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Phạm vi và bộ lọc
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={filterText}
              onChange={(e) => onFilterTextChange(e.target.value)}
              placeholder="Lọc theo tên tệp"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <input
              value={filterExt}
              onChange={(e) => onFilterExtChange(e.target.value)}
              placeholder="Lọc đuôi tệp (vd: png)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <select
              value={applyScope}
              onChange={(e) =>
                onApplyScopeChange(e.target.value as ApplyScope)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">Áp dụng cho tệp đang lọc</option>
              <option value="selected">Chỉ áp dụng cho tệp đã chọn</option>
            </select>
            <button
              type="button"
              onClick={() => onSetAllFilteredSelected(!allFilteredSelected)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700"
            >
              {allFilteredSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          </div>
          <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              Tạo thư mục con theo tiền tố
            </p>
            <input
              value={prefixSeparators}
              onChange={(e) => onPrefixSeparatorsChange(e.target.value)}
              placeholder="Ký tự phân tách (vd: -_.)"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Ví dụ: `Cao Phuong Nam_abc.pdf` sẽ vào thư mục `Cao Phuong Nam`.
            </p>
            <button
              type="button"
              onClick={onOrganizeIntoSubFoldersByPrefix}
              disabled={!directoryHandle || busy}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Tạo thư mục và di chuyển theo tiền tố
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mẫu cấu hình
          </p>
          <div className="flex gap-2">
            <input
              value={presetName}
              onChange={(e) => onPresetNameChange(e.target.value)}
              placeholder="Tên mẫu cấu hình"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={onSavePreset}
              className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-200 dark:text-slate-900"
            >
              Lưu
            </button>
          </div>
          <div className="mt-2 max-h-28 space-y-1 overflow-auto">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-2 py-1 dark:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => onLoadPreset(preset)}
                  className="text-left text-xs hover:underline"
                >
                  {preset.name}
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePreset(preset.id)}
                  className="text-xs text-rose-500"
                >
                  Xóa
                </button>
              </div>
            ))}
            {presets.length === 0 && (
              <p className="text-xs text-slate-500">Chưa có mẫu cấu hình.</p>
            )}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-slate-500">Kiểu sắp xếp</span>
          <select
            value={sortMode}
            onChange={(e) => onSortModeChange(e.target.value as SortMode)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="alpha">Theo bảng chữ cái</option>
            <option value="extension">Theo phần mở rộng</option>
            <option value="prefixMatch">Ưu tiên theo tiền tố</option>
            <option value="suffixMatch">Ưu tiên theo hậu tố</option>
          </select>
        </label>

        {sortMode === "prefixMatch" && (
          <input
            value={sortPrefix}
            onChange={(e) => onSortPrefixChange(e.target.value)}
            placeholder="Tiền tố để ưu tiên"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        )}
        {sortMode === "suffixMatch" && (
          <input
            value={sortSuffix}
            onChange={(e) => onSortSuffixChange(e.target.value)}
            placeholder="Hậu tố để ưu tiên"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          <input
            value={settings.prefix}
            onChange={(e) =>
              onSettingsChange({ ...settings, prefix: e.target.value })
            }
            placeholder="Thêm tiền tố"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={settings.suffix}
            onChange={(e) =>
              onSettingsChange({ ...settings, suffix: e.target.value })
            }
            placeholder="Thêm hậu tố"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={settings.search}
            onChange={(e) =>
              onSettingsChange({ ...settings, search: e.target.value })
            }
            placeholder="Tìm kiếm"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={settings.replace}
            onChange={(e) =>
              onSettingsChange({ ...settings, replace: e.target.value })
            }
            placeholder="Thay thế"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.useRegex}
            onChange={(e) =>
              onSettingsChange({ ...settings, useRegex: e.target.checked })
            }
          />
          Dùng Regex cho Search & Replace
        </label>

        {settings.useRegex && (
          <input
            value={settings.regexFlags}
            onChange={(e) =>
              onSettingsChange({ ...settings, regexFlags: e.target.value })
            }
            placeholder="Cờ Regex (vd: gi)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          />
        )}

        <label className="block">
          <span className="mb-1 block text-slate-500">Kiểu chữ</span>
          <select
            value={settings.caseMode}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                caseMode: e.target.value as RenameCaseMode,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="keep">Giữ nguyên</option>
            <option value="lower">chữ thường</option>
            <option value="upper">CHỮ HOA</option>
            <option value="camel">kiểu camelCase</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enableSequence}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                enableSequence: e.target.checked,
              })
            }
          />
          Bật đánh số thứ tự
        </label>

        {settings.enableSequence && (
          <>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.sequenceKeepStem}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    sequenceKeepStem: e.target.checked,
                  })
                }
              />
              Giữ tên gốc + số thứ tự
            </label>

            {!settings.sequenceKeepStem && (
              <input
                value={settings.sequenceBase}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    sequenceBase: e.target.value,
                  })
                }
                placeholder="Tên gốc mới (vd: tep)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              />
            )}

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={settings.sequenceStart}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    sequenceStart: Number(e.target.value || 1),
                  })
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              />
              <input
                type="number"
                value={settings.sequencePad}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    sequencePad: Number(e.target.value || 2),
                  })
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              />
              <input
                value={settings.sequenceSeparator}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    sequenceSeparator: e.target.value,
                  })
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.templateEnabled}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                templateEnabled: e.target.checked,
              })
            }
          />
          Bật template tên file
        </label>
        {settings.templateEnabled && (
          <div>
            <input
              value={settings.template}
              onChange={(e) =>
                onSettingsChange({ ...settings, template: e.target.value })
              }
              placeholder="{name}-{index} | {original} | {ext} | {index}"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Biến hỗ trợ: {"{name}"} {"{original}"} {"{ext}"} {"{index}"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
