type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="mt-2 text-sm text-slate-600 dark:text-slate-300"
        >
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              danger
                ? "bg-rose-600 hover:bg-rose-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
