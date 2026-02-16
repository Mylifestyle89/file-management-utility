type MessageBarProps = {
  unsupported?: boolean;
  error: string | null;
  message: string | null;
};

export function MessageBar({ unsupported, error, message }: MessageBarProps) {
  return (
    <>
      {unsupported && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Trình duyệt hiện tại chưa hỗ trợ đầy đủ File System Access API. Vui
          lòng dùng Chrome/Edge bản mới.
        </p>
      )}
      {error && (
        <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          {message}
        </p>
      )}
    </>
  );
}
