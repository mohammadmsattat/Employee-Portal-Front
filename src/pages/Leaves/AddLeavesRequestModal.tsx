import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Upload,
  FileText,
  X,
  Paperclip,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useAddLeaveRequestModal } from "@/hooks/Leaves/useAddLeaveRequest";

const AddLeaveRequestModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    isSubmitting,
    leaveTypesData,
    isLeaveTypesLoading,
    numberOfDays,
    handleDateSelect,
    handleSubmit,
    isHoliday,
    group,
    getLeaveTypeName,
    selectedLeave,
  } = useAddLeaveRequestModal({ isOpen, onClose });

  if (!isOpen) return null;

  const remainingDays = selectedLeave?.remainingDays ?? 0;
  const totalAllowed = selectedLeave?.totalAllowed ?? 0;

  const dateFields = ["startDate", "endDate"] as const;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-[#f8fafc] shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-3xl sm:rounded-[34px]">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-white px-5 pb-5 pt-4 sm:px-7 sm:pt-6">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 sm:hidden" />

          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-100 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-indigo-100 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <FileText className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest")
                    : t("buttons.requestLeave")}
                </p>

                <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:text-2xl">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest")
                    : t("buttons.requestLeave")}
                </h3>

                {formData.leaveType && (
                  <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {remainingDays} / {totalAllowed}{" "}
                      {t("leaveModal.daysRemaining")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              onClick={onClose}
              type="button"
              aria-label={t("buttons.cancel")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4">
            {/* Leave Type */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("leaveModal.leaveType")} <span className="required">*</span>
              </Label>

              <Select
                value={formData.leaveType}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, leaveType: v }))
                }
                disabled={isLeaveTypesLoading}
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none focus:ring-2 focus:ring-slate-950">
                  <SelectValue
                    placeholder={
                      isLeaveTypesLoading
                        ? t("overtimeModal.loading")
                        : t("leaveModal.selectLeaveType")
                    }
                  />
                </SelectTrigger>

                <SelectContent className="rounded-2xl border-slate-200">
                  {leaveTypesData?.data?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {getLeaveTypeName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              {dateFields.map((field) => (
                <div
                  key={field}
                  className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80"
                >
                  <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    {field === "startDate"
                      ? t("leaveModal.startDate")
                      : t("leaveModal.endDate")}{" "}
                    <span className="required">*</span>
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start rounded-2xl border-slate-200 bg-slate-50 text-left font-bold text-slate-950 shadow-none hover:bg-slate-100",
                          !formData[field] && "font-medium text-slate-400",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                        {formData[field]
                          ? format(formData[field], "P")
                          : field === "startDate"
                            ? t("leaveModal.selectStartDate")
                            : t("leaveModal.selectEndDate")}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="z-[1000] w-auto rounded-2xl border-slate-200 p-2 shadow-xl"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData[field]}
                        onSelect={(date) => handleDateSelect(field, date)}
                        // disabled={(date) =>
                        //   date < new Date() || isHoliday(date)
                        // }
                        initialFocus
                        className="pointer-events-auto"
                        modifiers={{
                          holiday: (date) =>
                            group?.calendarRules?.some((rule) => {
                              if (rule.effectType !== "FULL_DAY_OFF")
                                return false;

                              if (rule.patternType === "SINGLE_DATE") {
                                return isSameDay(
                                  date,
                                  new Date(rule.startDate),
                                );
                              }

                              if (rule.patternType === "RECURRING_WEEKLY") {
                                const weekDays = [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ];

                                return rule.daysOfWeek?.includes(
                                  weekDays[date.getDay()],
                                );
                              }

                              if (rule.patternType === "DATE_RANGE") {
                                const start = new Date(rule.startDate);
                                const end = new Date(rule.endDate);
                                const current = new Date(date);

                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                current.setHours(0, 0, 0, 0);

                                return current >= start && current <= end;
                              }

                              return false;
                            }),
                        }}
                        modifiersClassNames={{
                          holiday: "bg-red-200 text-red-700 rounded-full",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>

            {/* Number of Days */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <CalendarIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <Label className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {t("leaveModal.numberOfDays")}
                    </Label>

                    <p className="mt-1 truncate text-sm font-medium text-slate-500">
                      {formData.startDate && formData.endDate
                        ? `${format(formData.startDate, "PP")} - ${format(
                            formData.endDate,
                            "PP",
                          )}`
                        : t("leaveModal.selectStartDate")}
                    </p>
                  </div>
                </div>

                <Input
                  value={numberOfDays}
                  readOnly
                  className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 text-center text-lg font-black text-slate-950 shadow-none sm:w-[120px]"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("leaveModal.reason")} <span className="required">*</span>
              </Label>

              <Textarea
                placeholder={t("leaveModal.provideReason")}
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={4}
                className="min-h-[120px] resize-none rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950"
              />
            </div>

            {/* Attachment */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("leaveModal.attachment")} ({t("leaveModal.optional")})
              </Label>

              <div
                className="cursor-pointer rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    setFormData((prev) => ({ ...prev, attachment: file }));
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      setFormData((prev) => ({ ...prev, attachment: file }));
                  }}
                />

                {!formData.attachment ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {t("leaveModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        PDF, JPG, PNG
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <Paperclip className="h-5 w-5" />
                      </div>

                      <span className="truncate text-sm font-bold text-slate-800">
                        {formData.attachment.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({
                          ...prev,
                          attachment: null,
                        }));
                      }}
                      aria-label={t("buttons.cancel")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 w-full rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              {t("buttons.cancel")}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-slate-950 px-7 font-bold text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)] hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting
                ? t("buttons.submitting")
                : t("buttons.submitRequest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveRequestModal;
