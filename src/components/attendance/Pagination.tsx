// pages/attendance/components/Pagination.tsx

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  className?: string;
  size?: "sm" | "md";
  "aria-label"?: string;
}

const PaginationButton = ({
  children,
  onClick,
  disabled,
  isActive,
  className,
  size = "md",
  "aria-label": ariaLabel,
}: PaginationButtonProps) => {
  const sizeClasses = {
    sm: "min-w-[32px] h-8 text-xs",
    md: "min-w-[36px] h-9 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        sizeClasses[size],
        isActive
          ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm hover:bg-blue-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
};

interface UnifiedPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  className?: string;
}

export const UnifiedPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  className,
}: UnifiedPaginationProps) => {
  const prevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const nextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const total = totalPages;
    const current = currentPage;

    if (total <= 4) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (current <= 2) {
      pages.push(1);
      pages.push(2);
      pages.push(3);
      pages.push("…");
      pages.push(total);
    } else if (current >= total - 1) {
      pages.push(1);
      pages.push("…");
      pages.push(total - 2);
      pages.push(total - 1);
      pages.push(total);
    } else {
      pages.push(1);
      pages.push("…");
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push("…");
      pages.push(total);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={cn("flex items-center justify-center gap-1 py-2", className)}
      role="navigation"
      aria-label="Pagination"
    >
      <PaginationButton
        onClick={prevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        size="sm"
        className="sm:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      <PaginationButton
        onClick={prevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="hidden sm:flex gap-1 px-3"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </PaginationButton>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {visiblePages.map((page, index) => {
          if (page === "…") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm text-slate-400 select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;
          const pageNumber = page as number;

          return isCurrent ? (
            <span
              key={pageNumber}
              className="min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50/80 rounded-lg border border-blue-200/60 select-none"
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <PaginationButton
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              size="md"
            >
              {pageNumber}
            </PaginationButton>
          );
        })}
      </div>

      <PaginationButton
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        size="sm"
        className="sm:hidden"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>

      <PaginationButton
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="hidden sm:flex gap-1 px-3"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
};