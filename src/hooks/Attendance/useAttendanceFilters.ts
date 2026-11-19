import { useState, useEffect, useCallback, useMemo } from "react";

export type FilterType = "all" | "month" | "custom";

interface UseAttendanceFiltersProps {
  initialFilterType?: FilterType;
  initialMonth?: number;
  initialYear?: number;
}

export const useAttendanceFilters = (
  props: UseAttendanceFiltersProps = {},
) => {
  const {
    initialFilterType = "month",
    initialMonth = new Date().getMonth(),
    initialYear = new Date().getFullYear(),
  } = props;

  const [filterType, setFilterType] =
    useState<FilterType>(initialFilterType);

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (filterType !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  }, [filterType]);

  /**
   * Actual date range used by attendance API/calculator
   */
  const periodStartDate = useMemo(() => {
    if (filterType === "month") {
      return `${selectedYear}-${String(selectedMonth + 1).padStart(
        2,
        "0",
      )}-01`;
    }

    if (filterType === "custom" && startDate) {
      return startDate;
    }

    // all
    return undefined;
  }, [
    filterType,
    selectedMonth,
    selectedYear,
    startDate,
  ]);

  const periodEndDate = useMemo(() => {
    if (filterType === "month") {
      const lastDay = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
      ).getDate();

      return `${selectedYear}-${String(selectedMonth + 1).padStart(
        2,
        "0",
      )}-${String(lastDay).padStart(2, "0")}`;
    }

    if (filterType === "custom" && endDate) {
      return endDate;
    }

    // all
    return undefined;
  }, [
    filterType,
    selectedMonth,
    selectedYear,
    endDate,
  ]);

  const getFilterLabel = useCallback(
    (locale: string): string => {
      if (filterType === "month") {
        return new Date(
          selectedYear,
          selectedMonth,
        ).toLocaleString(locale, {
          month: "long",
          year: "numeric",
        });
      }

      if (filterType === "custom" && startDate && endDate) {
        return `${startDate} → ${endDate}`;
      }

      return "All records";
    },
    [
      filterType,
      selectedMonth,
      selectedYear,
      startDate,
      endDate,
    ],
  );

  const isFilterActive = filterType !== "all";

  const resetFilters = useCallback(() => {
    setFilterType("all");
    setStartDate("");
    setEndDate("");
  }, []);

  return {
    filterType,
    setFilterType,

    selectedMonth,
    setSelectedMonth,

    selectedYear,
    setSelectedYear,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    periodStartDate,
    periodEndDate,

    getFilterLabel,
    isFilterActive,
    resetFilters,
  };
};