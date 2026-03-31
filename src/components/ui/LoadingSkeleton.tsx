// components/ui/LoadingFull.tsx
import React from "react";

interface LoadingFullProps {
  titleLines?: number;   // عدد خطوط العنوان
  cardLines?: number;    // عدد خطوط المحتوى (مثل الجدول أو الكروت)
  className?: string;    // تخصيص إضافي للحاوية
}

/**
 * LoadingFull
 * مكون تحميل عام لجميع صفحات التطبيق
 * يمكن التحكم بعدد خطوط العنوان والمحتوى
 * يعكس الهوية البصرية للمنصة (ألوان أساسية، داكن، pulse animation)
 */
const LoadingFull: React.FC<LoadingFullProps> = ({
  titleLines = 2,
  cardLines = 4,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-start gap-4 p-6 animate-pulse ${className}`}
    >
      {/* أيقونة/دائرة */}
      <div className="h-12 w-12 rounded-full bg-primary/20"></div>

      {/* خطوط العنوان */}
      {Array.from({ length: titleLines }).map((_, idx) => (
        <div
          key={`title-${idx}`}
          className={`h-4 w-${titleLines === 1 ? "48" : "36"} rounded-md bg-primary/10`}
        ></div>
      ))}

      {/* بطاقة كبيرة تمثل الكارت الرئيسي */}
      <div className="w-full max-w-3xl h-48 rounded-2xl bg-white dark:bg-gray-800 shadow-md mt-4"></div>

      {/* جدول أو كروت */}
      <div className="w-full overflow-x-auto mt-6 max-w-3xl">
        {Array.from({ length: cardLines }).map((_, idx) => (
          <div
            key={`card-${idx}`}
            className="flex justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"
          >
            <div className="h-4 w-32 rounded-md bg-primary/10"></div>
            <div className="h-4 w-24 rounded-md bg-primary/10"></div>
            <div className="h-4 w-16 rounded-md bg-primary/10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingFull;
