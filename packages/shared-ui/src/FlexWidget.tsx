import type { ReactNode } from "react";

export type FlexWidgetProps = {
  children: ReactNode;
  column?: boolean;
};

export default function FlexWidget({
  children,
  column = false,
}: FlexWidgetProps) {
  const derivedClassName = "flex-widget" + (column ? " column" : "");
  return <div className={derivedClassName}>{children}</div>;
}