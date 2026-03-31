import * as React from "react";
import { cn } from "@/lib/utils";

// ================= Types & Constants =================

interface BaseCardProps {
  interactive?: boolean;
  compact?: boolean;
  elevated?: boolean;
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}

type SpacingSize = "none" | "sm" | "md" | "lg";
type TouchSize = "sm" | "md" | "lg";

const CARD_PADDING = {
  compact: "p-3 sm:p-4",
  default: "p-4 sm:p-6"
} as const;

const CARD_SPACING = {
  none: "space-y-0",
  sm: "space-y-2 sm:space-y-3",
  md: "space-y-4 sm:space-y-5",
  lg: "space-y-6 sm:space-y-7"
} as const;

const BORDER_COLORS = {
  default: "border-portal-card-border dark:border-gray-700",
  muted: "border-border/40 dark:border-gray-700/40",
  light: "border-border/60 dark:border-gray-700/60",
  error: "border-red-300 dark:border-red-800",
  warning: "border-yellow-300 dark:border-yellow-800"
} as const;

const TOUCH_TARGETS = {
  sm: "min-h-[36px] min-w-[36px]",
  md: "min-h-[44px] min-w-[44px]",
  lg: "min-h-[52px] min-w-[52px]"
} as const;

// ================= Skeleton Loader =================

const MobileCardSkeleton = () => (
  <MobileCard>
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <div className="flex justify-end gap-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  </MobileCard>
);

// ================= Empty State =================

interface MobileCardEmptyProps {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const MobileCardEmpty = ({ 
  message = "لا توجد بيانات", 
  icon, 
  action 
}: MobileCardEmptyProps) => (
  <MobileCard>
    <div className="text-center py-8 sm:py-12 px-4">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <p className="text-muted-foreground text-sm sm:text-base">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  </MobileCard>
);

// ================= Root Card =================

interface MobileCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseCardProps {
  spacing?: SpacingSize;
  touchSize?: TouchSize;
  borderColor?: keyof typeof BORDER_COLORS;
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ 
    className, 
    interactive, 
    compact, 
    elevated, 
    loading,
    error,
    disabled,
    dir = "ltr",
    spacing = "md",
    touchSize = "md",
    borderColor = "default",
    children,
    ...props 
  }, ref) => {
    const paddingClass = compact ? CARD_PADDING.compact : CARD_PADDING.default;
    const spacingClass = CARD_SPACING[spacing];
    const touchClass = interactive ? TOUCH_TARGETS[touchSize] : "";
    
    // Determine border color based on state
    const getBorderColor = () => {
      if (error) return BORDER_COLORS.error;
      if (disabled) return BORDER_COLORS.muted;
      return BORDER_COLORS[borderColor];
    };

    // Loading state
    if (loading) {
      return <MobileCardSkeleton />;
    }

    // RTL support
    const rtlClasses = dir === "rtl" ? "rtl:flex-row-reverse rtl:text-right" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card dark:bg-gray-800 border rounded-2xl",
          "transition-all duration-200",
          getBorderColor(),
          paddingClass,
          spacingClass,
          touchClass,
          rtlClasses,
          elevated && "shadow-md dark:shadow-gray-900/30",
          !elevated && "shadow-sm dark:shadow-gray-900/20",
          interactive && !disabled && [
            "cursor-pointer",
            "hover:shadow-lg hover:border-portal-card-border/80 dark:hover:border-gray-600",
            "active:scale-[0.98] active:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          ],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        role={interactive ? "button" : "article"}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-busy={loading}
        dir={dir}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MobileCard.displayName = "MobileCard";

// ================= Header =================

interface MobileCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

const MobileCardHeader = React.forwardRef<HTMLDivElement, MobileCardHeaderProps>(
  ({ className, noBorder, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-4",
        "rtl:flex-row-reverse",
        !noBorder && "pb-4 border-b border-border/60 dark:border-gray-700",
        className
      )}
      {...props}
    />
  )
);
MobileCardHeader.displayName = "MobileCardHeader";

// ================= Content =================

interface MobileCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noSpacing?: boolean;
}

const MobileCardContent = React.forwardRef<HTMLDivElement, MobileCardContentProps>(
  ({ className, noSpacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(!noSpacing && "space-y-5", className)}
      {...props}
    />
  )
);
MobileCardContent.displayName = "MobileCardContent";

// ================= Footer =================

interface MobileCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right";
  noBorder?: boolean;
}

const MobileCardFooter = React.forwardRef<HTMLDivElement, MobileCardFooterProps>(
  ({ className, align = "right", noBorder, ...props }, ref) => {
    const alignClass = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end"
    }[align];

    return (
      <div
        ref={ref}
        className={cn(
          "pt-4 flex items-center gap-2 flex-wrap",
          "rtl:flex-row-reverse",
          !noBorder && "border-t border-border/60 dark:border-gray-700",
          alignClass,
          className
        )}
        {...props}
      />
    );
  }
);
MobileCardFooter.displayName = "MobileCardFooter";

// ================= Row =================

interface MobileCardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  withDivider?: boolean;
  cols?: 2 | 3 | 4;
}

const MobileCardRow = React.forwardRef<HTMLDivElement, MobileCardRowProps>(
  ({ className, withDivider, cols = 2, ...props }, ref) => {
    const colsClass = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4"
    }[cols];

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-x-4 sm:gap-x-8 gap-y-3",
          colsClass,
          withDivider && "pb-4 border-b border-border/40 dark:border-gray-700/40",
          className
        )}
        {...props}
      />
    );
  }
);
MobileCardRow.displayName = "MobileCardRow";

// ================= Label =================

interface MobileCardLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md";
}

const MobileCardLabel = React.forwardRef<HTMLParagraphElement, MobileCardLabelProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const sizeClass = {
      sm: "text-[11px] sm:text-xs",
      md: "text-xs sm:text-sm"
    }[size];

    return (
      <p
        ref={ref}
        className={cn(
          sizeClass,
          "font-medium uppercase tracking-wide",
          "text-muted-foreground/70 dark:text-gray-400",
          className
        )}
        {...props}
      />
    );
  }
);
MobileCardLabel.displayName = "MobileCardLabel";

// ================= Value =================

interface MobileCardValueProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
  muted?: boolean;
}

const MobileCardValue = React.forwardRef<HTMLParagraphElement, MobileCardValueProps>(
  ({ className, size = "sm", muted, ...props }, ref) => {
    const sizeClass = {
      sm: "text-sm sm:text-base",
      md: "text-base sm:text-lg",
      lg: "text-lg sm:text-xl"
    }[size];

    return (
      <p
        ref={ref}
        className={cn(
          sizeClass,
          "font-semibold leading-relaxed break-words",
          muted 
            ? "text-muted-foreground dark:text-gray-400" 
            : "text-portal-header dark:text-white",
          className
        )}
        {...props}
      />
    );
  }
);
MobileCardValue.displayName = "MobileCardValue";

// ================= Divider =================

const MobileCardDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn(
      "border-border/40 dark:border-gray-700/40 my-2",
      className
    )}
    {...props}
  />
));
MobileCardDivider.displayName = "MobileCardDivider";

// ================= Error State =================

interface MobileCardErrorProps {
  message?: string;
  retry?: () => void;
}

const MobileCardError = ({ 
  message = "حدث خطأ في تحميل البيانات", 
  retry 
}: MobileCardErrorProps) => (
  <MobileCard error>
    <div className="text-center py-8 sm:py-12 px-4">
      <div className="mb-4 text-red-500 dark:text-red-400 text-4xl">⚠️</div>
      <p className="text-red-600 dark:text-red-400 text-sm sm:text-base mb-4">
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  </MobileCard>
);

export {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardFooter,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
  MobileCardDivider,
  MobileCardSkeleton,
  MobileCardEmpty,
  MobileCardError,
  BORDER_COLORS,
  CARD_PADDING,
  CARD_SPACING,
  TOUCH_TARGETS,
};