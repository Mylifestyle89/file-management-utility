import { AnimatePresence, motion } from "framer-motion";
import { File as FileIcon } from "lucide-react";
import type { PreviewItem } from "../types";
import { formatBytes } from "../utils";

type FileTableProps = {
  previewItems: PreviewItem[];
  allFilteredSelected: boolean;
  selectedInListCount: number;
  onToggleSelect: (name: string) => void;
  onSelectAll: () => void;
};

export function FileTable({
  previewItems,
  allFilteredSelected,
  selectedInListCount,
  onToggleSelect,
  onSelectAll,
}: FileTableProps) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Đang chọn {selectedInListCount}/{previewItems.length} tệp trong danh
          sách.
        </p>
        <button
          type="button"
          onClick={onSelectAll}
          disabled={previewItems.length === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {allFilteredSelected ? "Bỏ đánh dấu tất cả" : "Chọn tất cả"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2">Chọn</th>
              <th className="px-3 py-2">Tệp</th>
              <th className="px-3 py-2">Phần mở rộng</th>
              <th className="px-3 py-2">Dung lượng</th>
              <th className="px-3 py-2">Tên hiện tại</th>
              <th className="px-3 py-2">Tên mới (xem trước)</th>
            </tr>
          </thead>
          <motion.tbody layout>
            <AnimatePresence>
              {previewItems.map((item) => (
                <motion.tr
                  key={item.file.name}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => onToggleSelect(item.file.name)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FileIcon className="h-4 w-4 text-slate-500" />
                  </td>
                  <td className="px-3 py-2">{item.extension}</td>
                  <td className="px-3 py-2">
                    {formatBytes(item.file.size)}
                  </td>
                  <td className="px-3 py-2">{item.file.name}</td>
                  <td
                    className={`px-3 py-2 font-medium ${
                      item.changed && item.willApply
                        ? "text-blue-600 dark:text-blue-400"
                        : item.changed
                          ? "text-amber-500 dark:text-amber-400"
                          : "text-slate-500"
                    }`}
                  >
                    {item.newName}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </>
  );
}
