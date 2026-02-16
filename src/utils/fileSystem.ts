import type { FileRecord, PreviewItem } from "../types";
import type { MoveToSubFolderResult } from "../types";

export const canCheckSameEntry = (
  handle: FileSystemDirectoryHandle
): handle is FileSystemDirectoryHandle & {
  isSameEntry: (other: FileSystemHandle) => Promise<boolean>;
} => typeof (handle as { isSameEntry?: unknown }).isSameEntry === "function";

export const readFilesFromDirectory = async (
  handle: FileSystemDirectoryHandle
): Promise<FileRecord[] | null> => {
  const nextFiles: FileRecord[] = [];
  if (!handle.entries) {
    return null;
  }
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind !== "file") continue;
    const fileHandle = entry as FileSystemFileHandle;
    const file = await fileHandle.getFile();
    nextFiles.push({
      handle: fileHandle,
      name,
      size: file.size,
    });
  }
  return nextFiles;
};

export const renameFileByName = async (
  handle: FileSystemDirectoryHandle,
  sourceName: string,
  targetName: string
): Promise<void> => {
  if (sourceName === targetName) return;
  const sourceHandle = await handle.getFileHandle(sourceName);
  if (typeof sourceHandle.move === "function") {
    await sourceHandle.move(targetName);
    return;
  }
  const sourceFile = await sourceHandle.getFile();
  const targetHandle = await handle.getFileHandle(targetName, {
    create: true,
  });
  const writable = await targetHandle.createWritable();
  await writable.write(await sourceFile.arrayBuffer());
  await writable.close();
  await handle.removeEntry(sourceName);
};

export const moveFileToSubFolder = async (
  handle: FileSystemDirectoryHandle,
  sourceName: string,
  subFolderName: string
): Promise<MoveToSubFolderResult> => {
  const targetDir = await handle.getDirectoryHandle(subFolderName, {
    create: true,
  });

  try {
    await targetDir.getFileHandle(sourceName);
    return { moved: false, reason: "exists" };
  } catch {
    // File chưa tồn tại trong thư mục đích.
  }

  const sourceHandle = await handle.getFileHandle(sourceName);
  const sourceFile = await sourceHandle.getFile();
  const targetHandle = await targetDir.getFileHandle(sourceName, {
    create: true,
  });
  const writable = await targetHandle.createWritable();
  await writable.write(await sourceFile.arrayBuffer());
  await writable.close();
  await handle.removeEntry(sourceName);
  return { moved: true, reason: null };
};

export const validateConflicts = (
  items: PreviewItem[],
  allFileNames: string[]
): Set<string> => {
  const duplicates = new Set<string>();
  const seen = new Set<string>();
  const unchangedNames = new Set(
    allFileNames.filter(
      (name) => !items.some((item) => item.file.name === name)
    )
  );

  for (const item of items) {
    if (seen.has(item.newName)) duplicates.add(item.newName);
    seen.add(item.newName);
    if (unchangedNames.has(item.newName)) duplicates.add(item.newName);
  }

  return duplicates;
};
