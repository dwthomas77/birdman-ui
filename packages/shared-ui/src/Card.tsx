import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-lg border ${className}`.trim()}
      {...props}
    />
  );
}
