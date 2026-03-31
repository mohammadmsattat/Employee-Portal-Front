import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

type UnifiedPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  className?: string;
};

const UnifiedPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  perPage,
  setPerPage,
  className,
}: UnifiedPaginationProps) => {
  const prevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const nextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <nav
      className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-lg shadow-sm",
        className,
      )}
    >
      {/* Page info and per page selector */}
      <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
        {/* Per-page selector: hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <span>Per Page:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <PaginationButton onClick={prevPage} disabled={currentPage <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </PaginationButton>

        {currentPage - 1 > 0 && (
          <PaginationButton onClick={() => setCurrentPage(currentPage - 1)}>
            {currentPage - 1}
          </PaginationButton>
        )}

        <PaginationButton isActive>{currentPage}</PaginationButton>

        {currentPage + 1 <= totalPages && (
          <PaginationButton onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </PaginationButton>
        )}

        <PaginationButton
          onClick={nextPage}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationButton>
      </div>
    </nav>
  );
};

type PaginationButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
};

const PaginationButton = ({
  children,
  onClick,
  disabled,
  isActive,
}: PaginationButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      buttonVariants({ variant: isActive ? "outline" : "ghost", size: "icon" }),
      "h-9 w-9 flex items-center justify-center text-sm rounded-lg transition-colors hover:bg-primary/10",
      disabled && "opacity-50 cursor-not-allowed",
    )}
  >
    {children}
  </button>
);

export default UnifiedPagination;
