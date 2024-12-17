import React from "react";
import { clsx } from "clsx";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className }: Props) {
  return (
    <div
      className={clsx(
        "p-3 border border-slate-200 rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  )
}