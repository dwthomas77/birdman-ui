import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextValue = {
  addToast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          style={{
            minWidth: "220px",
            maxWidth: "320px",
            padding: "0.85rem 1rem",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.16)",
            color: "#fff",
            background:
              toast.type === "error"
                ? "#dc2626"
                : toast.type === "success"
                  ? "#15803d"
                  : "#1d4ed8",
            fontSize: "0.95rem",
            lineHeight: 1.4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "1rem",
                padding: 0,
              }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.duration, toast.id]);

  return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type: options.type ?? "info",
        duration: options.duration ?? 4000,
      },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
