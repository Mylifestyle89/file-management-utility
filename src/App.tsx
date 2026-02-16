import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import {
  defaultSettings,
  MAX_SELECTED_DIRECTORIES,
  PRESETS_STORAGE_KEY,
  type ApplyScope,
  type FileRecord,
  type Preset,
  type RenameOperation,
  type RenameSettings,
  type SelectedDirectory,
  type SortMode,
  type PreviewItem,
} from "./types";
import {
  buildNewName,
  canCheckSameEntry,
  extractPrefixBySeparators,
  readFilesFromDirectory,
  renameFileByName,
  moveFileToSubFolder,
  splitName,
  validateConflicts,
} from "./utils";
import { ConfirmDialog, FileTable, MessageBar, Sidebar } from "./components";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("alpha");
  const [sortPrefix, setSortPrefix] = useState("");
  const [sortSuffix, setSortSuffix] = useState("");
  const [selectedDirectories, setSelectedDirectories] = useState<
    SelectedDirectory[]
  >([]);
  const [selectedDirectoryIds, setSelectedDirectoryIds] = useState<Set<string>>(
    new Set()
  );
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [applyScope, setApplyScope] = useState<ApplyScope>("all");
  const [filterText, setFilterText] = useState("");
  const [filterExt, setFilterExt] = useState("");
  const [prefixSeparators, setPrefixSeparators] = useState("-_.");
  const [settings, setSettings] = useState<RenameSettings>(defaultSettings);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [lastOperations, setLastOperations] = useState<RenameOperation[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmPending, setConfirmPending] = useState<
    "commit" | "organize" | null
  >(null);

  const unsupported = typeof window.showDirectoryPicker !== "function";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Preset[];
      if (Array.isArray(parsed)) {
        setPresets(parsed);
      }
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const sortedFiles = useMemo(() => {
    const items = [...files];
    if (sortMode === "alpha") {
      items.sort((a, b) => a.name.localeCompare(b.name));
      return items;
    }
    if (sortMode === "extension") {
      items.sort((a, b) => {
        const extA = splitName(a.name).extension;
        const extB = splitName(b.name).extension;
        return extA.localeCompare(extB) || a.name.localeCompare(b.name);
      });
      return items;
    }
    if (sortMode === "prefixMatch") {
      const prefix = sortPrefix.toLowerCase();
      items.sort((a, b) => {
        const aMatch = prefix ? a.name.toLowerCase().startsWith(prefix) : false;
        const bMatch = prefix ? b.name.toLowerCase().startsWith(prefix) : false;
        if (aMatch !== bMatch) return aMatch ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      return items;
    }
    const suffix = sortSuffix.toLowerCase();
    items.sort((a, b) => {
      const aMatch = suffix ? a.name.toLowerCase().endsWith(suffix) : false;
      const bMatch = suffix ? b.name.toLowerCase().endsWith(suffix) : false;
      if (aMatch !== bMatch) return aMatch ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return items;
  }, [files, sortMode, sortPrefix, sortSuffix]);

  const filteredFiles = useMemo(() => {
    const text = filterText.trim().toLowerCase();
    const ext = filterExt.trim().toLowerCase().replace(".", "");
    return sortedFiles.filter((file) => {
      const matchesText = text ? file.name.toLowerCase().includes(text) : true;
      const fileExt = splitName(file.name).extension.toLowerCase();
      const matchesExt = ext ? fileExt === ext : true;
      return matchesText && matchesExt;
    });
  }, [sortedFiles, filterText, filterExt]);

  const activeFiles = filteredFiles;

  const previewItems = useMemo<PreviewItem[]>(() => {
    return activeFiles.map((file, index) => {
      const nextName = buildNewName(file.name, index, settings);
      const isSelected = selected.has(file.name);
      const willApply = applyScope === "all" || isSelected;
      return {
        file,
        extension: splitName(file.name).extension || "—",
        newName: nextName,
        changed: nextName !== file.name,
        selected: isSelected,
        willApply,
      };
    });
  }, [settings, activeFiles, selected, applyScope]);

  const commitCandidates = previewItems.filter(
    (item) => item.changed && item.willApply
  );
  const changedCount = commitCandidates.length;

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const setAllFilteredSelected = (value: boolean) => {
    const names = filteredFiles.map((file) => file.name);
    setSelected((prev) => {
      const next = new Set(prev);
      names.forEach((name) => {
        if (value) next.add(name);
        else next.delete(name);
      });
      return next;
    });
  };

  const loadCurrentDirectoryFiles = async (
    handle: FileSystemDirectoryHandle,
    showMessage = false
  ) => {
    setLoadingFiles(true);
    try {
      const nextFiles = await readFilesFromDirectory(handle);
      if (!nextFiles) {
        setError(
          "Trình duyệt chưa hỗ trợ duyệt file trong thư mục đã chọn."
        );
        return false;
      }
      setFiles(nextFiles);
      setSelected(new Set());
      if (showMessage) {
        setMessage(`Đã tải ${nextFiles.length} tệp trong thư mục "${handle.name}".`);
      }
      return true;
    } finally {
      setLoadingFiles(false);
    }
  };

  const isDuplicateDirectory = async (candidate: FileSystemDirectoryHandle) => {
    for (const item of selectedDirectories) {
      if (canCheckSameEntry(item.handle)) {
        const same = await item.handle.isSameEntry(candidate);
        if (same) return true;
      } else if (item.name === candidate.name) {
        return true;
      }
    }
    return false;
  };

  const pickDirectory = async (mode: "replace" | "append" = "replace") => {
    if (unsupported) return;
    if (
      mode === "append" &&
      selectedDirectories.length >= MAX_SELECTED_DIRECTORIES
    ) {
      setError(
        `Chỉ được chọn tối đa ${MAX_SELECTED_DIRECTORIES} thư mục mỗi lần.`
      );
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const handle = await window.showDirectoryPicker!();
      const permission = handle.requestPermission
        ? await handle.requestPermission({ mode: "readwrite" })
        : "granted";
      if (permission !== "granted") {
        setError("Bạn chưa cấp quyền đọc/ghi thư mục.");
        return;
      }
      const duplicateDirectory =
        mode === "append" ? await isDuplicateDirectory(handle) : false;
      if (mode === "append" && duplicateDirectory) {
        setError(`Thư mục "${handle.name}" đã có trong danh sách.`);
        return;
      }
      const directoryItem: SelectedDirectory = {
        id: crypto.randomUUID(),
        name: handle.name,
        handle,
      };
      const nextDirectories =
        mode === "replace"
          ? [directoryItem]
          : [...selectedDirectories, directoryItem];
      setSelectedDirectories(nextDirectories);
      setSelectedDirectoryIds((prev) => {
        if (mode === "replace") return new Set([directoryItem.id]);
        const next = new Set(prev);
        next.add(directoryItem.id);
        return next;
      });
      setDirectoryHandle(handle);
      await loadCurrentDirectoryFiles(handle, true);
    } catch (pickError) {
      if ((pickError as Error).name === "AbortError") return;
      setError("Không thể mở thư mục. Vui lòng thử lại.");
    }
  };

  const switchActiveDirectory = async (directoryId: string) => {
    const target = selectedDirectories.find((item) => item.id === directoryId);
    if (!target) return;
    setError(null);
    setMessage(null);
    setDirectoryHandle(target.handle);
    await loadCurrentDirectoryFiles(target.handle, true);
  };

  const removeDirectory = async (directoryId: string) => {
    const nextDirectories = selectedDirectories.filter(
      (item) => item.id !== directoryId
    );
    setSelectedDirectories(nextDirectories);
    setSelectedDirectoryIds((prev) => {
      const next = new Set(prev);
      next.delete(directoryId);
      return next;
    });
    if (nextDirectories.length === 0) {
      setDirectoryHandle(null);
      setFiles([]);
      setSelected(new Set());
      setMessage("Đã xóa toàn bộ thư mục khỏi danh sách.");
      return;
    }
    const currentStillExists = nextDirectories.some(
      (item) => item.handle === directoryHandle
    );
    if (!currentStillExists) {
      const nextActive = nextDirectories[0];
      setDirectoryHandle(nextActive.handle);
      await loadCurrentDirectoryFiles(nextActive.handle, true);
    }
  };

  const toggleDirectorySelection = (directoryId: string) => {
    setSelectedDirectoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(directoryId)) next.delete(directoryId);
      else next.add(directoryId);
      return next;
    });
  };

  const setAllDirectoriesSelected = (value: boolean) => {
    if (value) {
      setSelectedDirectoryIds(
        new Set(selectedDirectories.map((item) => item.id))
      );
      return;
    }
    setSelectedDirectoryIds(new Set());
  };

  const commitChanges = async () => {
    if (!directoryHandle || changedCount === 0) return;
    setConfirmPending(null);
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const duplicates = validateConflicts(
        commitCandidates,
        files.map((f) => f.name)
      );
      if (duplicates.size > 0) {
        setError(
          `Có xung đột tên file: ${Array.from(duplicates).slice(0, 3).join(", ")}`
        );
        setBusy(false);
        return;
      }
      const operations: RenameOperation[] = [];
      for (const item of commitCandidates) {
        await renameFileByName(
          directoryHandle,
          item.file.name,
          item.newName
        );
        operations.push({ from: item.file.name, to: item.newName });
      }
      setLastOperations(operations);
      await loadCurrentDirectoryFiles(directoryHandle);
      setMessage(`Đổi tên thành công ${operations.length} file.`);
    } catch {
      setError(
        "Không thể áp dụng thay đổi. Trình duyệt có thể chưa hỗ trợ đầy đủ đổi tên file."
      );
    } finally {
      setBusy(false);
    }
  };

  const undoLastCommit = async () => {
    if (!directoryHandle || lastOperations.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      for (const operation of [...lastOperations].reverse()) {
        await renameFileByName(directoryHandle, operation.to, operation.from);
      }
      const undoCount = lastOperations.length;
      setLastOperations([]);
      await loadCurrentDirectoryFiles(directoryHandle);
      setMessage(`Đã hoàn tác ${undoCount} thay đổi gần nhất.`);
    } catch {
      setError(
        "Không thể hoàn tác. Hãy kiểm tra lại trạng thái file hiện tại."
      );
    } finally {
      setBusy(false);
    }
  };

  const doOrganizeIntoSubFoldersByPrefix = async () => {
    const checkedDirectories = selectedDirectories.filter((item) =>
      selectedDirectoryIds.has(item.id)
    );
    const targetDirectories =
      checkedDirectories.length > 0
        ? checkedDirectories
        : selectedDirectories.length > 0
          ? []
          : directoryHandle
            ? [
                {
                  id: "single",
                  name: directoryHandle.name,
                  handle: directoryHandle,
                },
              ]
            : [];

    if (targetDirectories.length === 0) {
      setError("Vui lòng tick ít nhất một thư mục để thực hiện.");
      return;
    }
    if (!prefixSeparators.trim()) {
      setError("Vui lòng nhập ít nhất một ký tự phân tách tiền tố.");
      return;
    }
    setConfirmPending(null);
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      let movedCount = 0;
      let noPrefixCount = 0;
      let existsCount = 0;
      let failedCount = 0;
      let processedFolderCount = 0;

      for (const targetDirectory of targetDirectories) {
        const sourceNames =
          selectedDirectories.length === 0
            ? previewItems
                .filter((item) => item.willApply)
                .map((item) => item.file.name)
            : (await readFilesFromDirectory(targetDirectory.handle))?.map(
                (file) => file.name
              ) ?? [];
        if (sourceNames.length === 0) continue;
        processedFolderCount += 1;

        for (const sourceName of sourceNames) {
          const prefix = extractPrefixBySeparators(
            sourceName,
            prefixSeparators
          );
          if (!prefix) {
            noPrefixCount += 1;
            continue;
          }
          try {
            const result = await moveFileToSubFolder(
              targetDirectory.handle,
              sourceName,
              prefix
            );
            if (result.moved) movedCount += 1;
            else existsCount += 1;
          } catch {
            failedCount += 1;
          }
        }
      }

      setLastOperations([]);
      if (directoryHandle) {
        await loadCurrentDirectoryFiles(directoryHandle);
      }
      setMessage(
        `Phân loại xong ${processedFolderCount} thư mục: đã di chuyển ${movedCount} tệp, không có tiền tố ${noPrefixCount}, trùng tên ${existsCount}, lỗi ${failedCount}.`
      );
    } catch {
      setError(
        "Không thể tạo thư mục con theo tiền tố. Vui lòng thử lại."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleOrganizeClick = () => {
    const checkedDirectories = selectedDirectories.filter((item) =>
      selectedDirectoryIds.has(item.id)
    );
    const targetDirectories =
      checkedDirectories.length > 0
        ? checkedDirectories
        : selectedDirectories.length > 0
          ? []
          : directoryHandle
            ? [
                {
                  id: "single",
                  name: directoryHandle.name,
                  handle: directoryHandle,
                },
              ]
            : [];
    if (targetDirectories.length === 0) {
      setError("Vui lòng tick ít nhất một thư mục để thực hiện.");
      return;
    }
    if (!prefixSeparators.trim()) {
      setError("Vui lòng nhập ít nhất một ký tự phân tách tiền tố.");
      return;
    }
    setConfirmPending("organize");
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) {
      setError("Nhập tên mẫu cấu hình trước khi lưu.");
      return;
    }
    const preset: Preset = {
      id: crypto.randomUUID(),
      name,
      settings,
    };
    setPresets((prev) => [preset, ...prev]);
    setPresetName("");
    setMessage(`Đã lưu mẫu cấu hình "${name}".`);
  };

  const loadPreset = (preset: Preset) => {
    setSettings(preset.settings);
    setMessage(`Đã áp dụng mẫu cấu hình "${preset.name}".`);
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const allFilteredSelected =
    filteredFiles.length > 0 &&
    filteredFiles.every((file) => selected.has(file.name));
  const selectedInListCount = previewItems.filter((item) => item.selected)
    .length;
  const selectedDirectoryCount = selectedDirectories.filter((item) =>
    selectedDirectoryIds.has(item.id)
  ).length;
  const allDirectoriesSelected =
    selectedDirectories.length > 0 &&
    selectedDirectories.every((item) => selectedDirectoryIds.has(item.id));

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 lg:flex-row">
          <Sidebar
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode((prev) => !prev)}
            unsupported={unsupported}
            busy={busy}
            directoryHandle={directoryHandle}
            selectedDirectories={selectedDirectories}
            selectedDirectoryIds={selectedDirectoryIds}
            directoryHandleActive={directoryHandle}
            filterText={filterText}
            filterExt={filterExt}
            applyScope={applyScope}
            prefixSeparators={prefixSeparators}
            allFilteredSelected={allFilteredSelected}
            presets={presets}
            presetName={presetName}
            sortMode={sortMode}
            sortPrefix={sortPrefix}
            sortSuffix={sortSuffix}
            settings={settings}
            onPickDirectory={pickDirectory}
            onSwitchActiveDirectory={switchActiveDirectory}
            onRemoveDirectory={removeDirectory}
            onToggleDirectorySelection={toggleDirectorySelection}
            onSetAllDirectoriesSelected={setAllDirectoriesSelected}
            onFilterTextChange={setFilterText}
            onFilterExtChange={setFilterExt}
            onApplyScopeChange={setApplyScope}
            onSetAllFilteredSelected={setAllFilteredSelected}
            onPrefixSeparatorsChange={setPrefixSeparators}
            onOrganizeIntoSubFoldersByPrefix={handleOrganizeClick}
            onPresetNameChange={setPresetName}
            onSavePreset={savePreset}
            onLoadPreset={loadPreset}
            onDeletePreset={deletePreset}
            onSortModeChange={setSortMode}
            onSortPrefixChange={setSortPrefix}
            onSortSuffixChange={setSortSuffix}
            onSettingsChange={setSettings}
            selectedDirectoryCount={selectedDirectoryCount}
            allDirectoriesSelected={allDirectoriesSelected}
          />

          <main className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">
                  Tiện ích quản lý và đổi tên tệp
                </h1>
                <p className="text-sm text-slate-500">
                  {directoryHandle
                    ? `Thư mục: ${directoryHandle.name}`
                    : "Chưa chọn thư mục"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={undoLastCommit}
                  disabled={
                    busy ||
                    lastOperations.length === 0 ||
                    !directoryHandle
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Hoàn tác lần gần nhất ({lastOperations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmPending("commit")}
                  disabled={
                    busy || changedCount === 0 || !directoryHandle
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  Áp dụng thay đổi ({changedCount})
                </button>
              </div>
            </div>

            <MessageBar
              unsupported={unsupported}
              error={error}
              message={message}
            />

            {loadingFiles && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
                  aria-hidden
                />
                Đang tải danh sách file…
              </div>
            )}

            <FileTable
              previewItems={previewItems}
              allFilteredSelected={allFilteredSelected}
              selectedInListCount={selectedInListCount}
              onToggleSelect={toggleSelect}
              onSelectAll={() => setAllFilteredSelected(!allFilteredSelected)}
            />

            <ConfirmDialog
              open={confirmPending === "commit"}
              title="Xác nhận đổi tên"
              message={`Bạn sẽ đổi tên ${changedCount} file. Có thể dùng "Hoàn tác lần gần nhất" để khôi phục toàn bộ lần đổi tên này. Tiếp tục?`}
              confirmLabel="Áp dụng"
              cancelLabel="Hủy"
              onConfirm={commitChanges}
              onCancel={() => setConfirmPending(null)}
            />
            <ConfirmDialog
              open={confirmPending === "organize"}
              title="Tạo thư mục con theo tiền tố"
              message="Tạo các thư mục con và di chuyển file vào thư mục trùng tên tiền tố (tách bằng ký tự đã nhập). Tiếp tục?"
              confirmLabel="Thực hiện"
              cancelLabel="Hủy"
              onConfirm={doOrganizeIntoSubFoldersByPrefix}
              onCancel={() => setConfirmPending(null)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
