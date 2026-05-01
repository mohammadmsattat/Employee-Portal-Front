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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center sm:overflow-y-auto">
      <div className="w-full sm:max-w-4xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">
          {/* drag handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1.5 w-14 rounded-full bg-slate-300" />
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest")
                    : t("buttons.requestLeave")}
                </div>

                <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest")
                    : t("buttons.requestLeave")}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t("leaveModal.provideReason")}
                </p>
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Leave Balance */}
            {formData.leaveType && (
              <div className="mb-6 rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {t("leaveModal.leaveBalance", {
                          type: getLeaveTypeName(selectedLeave),
                        })}
                      </p>
                      <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-900">
                        {remainingDays} / {totalAllowed}{" "}
                        <span className="text-slate-500">
                          {t("leaveModal.daysRemaining")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("leaveModal.leaveType")}{" "}
                  <span className="required">*</span>
                </Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, leaveType: v }))
                  }
                  disabled={isLeaveTypesLoading}
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {dateFields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
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
                            "h-12 w-full justify-start rounded-2xl border-slate-200 bg-white text-left font-medium text-slate-900 shadow-sm hover:bg-slate-50",
                            !formData[field] && "text-slate-400",
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
                          disabled={(date) =>
                            date < new Date() || isHoliday(date)
                          }
                          initialFocus
                          className="pointer-events-auto"
                          modifiers={{
                            holiday: (date) =>
                              group?.calendarRules?.some((rule) => {
                                if (rule.effectType !== "FULL_DAY_OFF")
                                  return false;
                                if (rule.patternType === "SINGLE_DATE")
                                  return isSameDay(
                                    date,
                                    new Date(rule.startDate),
                                  );
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
                                  return rule.daysOfWeek?.some(
                                    (day) => weekDays[date.getDay()] === day,
                                  );
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
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        {t("leaveModal.numberOfDays")}
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">
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
                    className="h-12 w-full rounded-2xl border-slate-200 bg-white text-center text-lg font-bold text-slate-900 shadow-sm sm:w-[120px]"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("leaveModal.reason")} <span className="required">*</span>
                </Label>
                <Textarea
                  placeholder={t("leaveModal.provideReason")}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  rows={5}
                  className="rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("leaveModal.attachment")} ({t("leaveModal.optional")})
                </Label>

                <div
                  className="rounded-[24px] border border-dashed border-blue-200 bg-blue-50/40 p-5 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/70 cursor-pointer"
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
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {t("leaveModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        PDF, JPG, PNG
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-blue-100">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <span className="truncate text-sm font-medium text-slate-700">
                          {formData.attachment.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({
                            ...prev,
                            attachment: null,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="h-12 w-full rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  {t("buttons.cancel")}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-blue-600 px-6 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] hover:bg-blue-700 sm:w-auto"
                >
                  {isSubmitting
                    ? t("buttons.submitting")
                    : t("buttons.submitRequest")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveRequestModal;
