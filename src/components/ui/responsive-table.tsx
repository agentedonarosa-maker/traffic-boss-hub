import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveTable({ children, className, ...props }: ResponsiveTableProps) {
  const [showLeftShadow, setShowLeftShadow] = React.useState(false);
  const [showRightShadow, setShowRightShadow] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const checkScrollPosition = React.useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  React.useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [checkScrollPosition]);

  return (
    <div className={cn("relative", className)} {...props}>
      {/* Left scroll indicator */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none flex items-center">
          <ChevronLeft className="w-4 h-4 text-muted-foreground animate-pulse" />
        </div>
      )}

      {/* Right scroll indicator */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none flex items-center justify-end">
          <ChevronRight className="w-4 h-4 text-muted-foreground animate-pulse" />
        </div>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
      >
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
}
