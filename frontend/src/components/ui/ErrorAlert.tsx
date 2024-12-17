import React from "react";
import { clsx } from "clsx";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function ErrorAlert({ children, className }: Props) {
  return (
    <div
      className={clsx(
        "p-3 bg-red-200 border border-red-400 rounded-md text-red-900 w-full",
        className,
      )}
    >
      {children}
    </div>
  )
}