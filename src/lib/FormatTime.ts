const FormatTime = (time: string | Date | undefined, includeTime = false): string => {
  if (!time) return "";

  const date = typeof time === "string" ? new Date(time) : time;
  if (isNaN(date.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = includeTime
    ? { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    : { year: "numeric", month: "2-digit", day: "2-digit" };

  return date.toLocaleString(undefined, options);
};

export default FormatTime;