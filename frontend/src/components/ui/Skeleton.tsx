import React from "react";
import { clsx } from "clsx";

import { Card } from "./Card";

export function Skeleton({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-gray-900/10",
        className,
      )}
    />
  )
}

export function SkeletonCard({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
      <Card className={clsx(
        "flex flex-col gap-4",
        className,
      )}>
        <Skeleton className="h-6 w-1/4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>
  );
}