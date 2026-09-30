import type { HTMLAttributes } from "react";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export default function LoadingSpinner({
  label = "Loading",
  className = "",
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex items-center justify-center ${className}`.trim()}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
      />
    </div>
  );
}
