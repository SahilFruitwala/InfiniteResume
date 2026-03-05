import React from "react";
import { cn } from "@/lib/utils";

interface ResizerProps {
  onMouseDown: (e: React.MouseEvent) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
  side?: "left" | "right";
}

export const Resizer = ({
  onMouseDown,
  orientation = "vertical",
  className,
  side,
}: ResizerProps) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        "group relative flex items-center justify-center cursor-col-resize transition-all duration-300 z-30",
        orientation === "vertical"
          ? "w-1 hover:w-2 h-full"
          : "h-1 hover:h-2 w-full",
        side === "left" ? "-ml-0.5" : "-mr-0.5",
        className,
      )}
    >
      {/* Invisible wider handle for easier grabbing */}
      <div
        className={cn(
          "absolute inset-y-0 -inset-x-2",
          orientation === "horizontal" && "inset-x-0 -inset-y-2",
        )}
      />

      {/* The visible line */}
      <div
        className={cn(
          "w-0.5 h-full bg-black/10 dark:bg-white/10 group-hover:bg-accent transition-colors",
          orientation === "horizontal" && "h-0.5 w-full",
        )}
      />
    </div>
  );
};
