import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock3,
  FileClock,
  Paperclip,
  Timer,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAddOvertimeRequestModal } from "@/hooks/Overtime/useAddOvertimeRequestModal";
import { toast } from "@/hooks/use-toast";

const AddOvertimeRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    isSubmitting,
    overtimeTypesData,
    isOvertimeTypesLoading,
    handleSubmit,
    selectedOvertime,
    handleDateSelect,
    isHoliday,
  } = useAddOvertimeRequestModal({ isOpen, onClose });

  if (!isOpen) return null;

  const isFieldError = (field: keyof typeof formData) =>
    !formData[field] && isSubmitting;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-3xl sm:rounded-2xl">
        {/* Header with Gradient matching Layout */}
        <div className="relative overflow-hidden px-5 py-4 sm:px-7 sm:py-5" style={{
          background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))'
        }}>
          {/* Decorative blur elements */}
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-indigo-200/20 blur-2xl" />

          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-blue-200/40 sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:rounded-xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40">
                <FileClock className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {t("buttons.requestOvertime") || "Request Overtime"}
                </p>

                <h3 className="text-lg font-bold text-blue-900">
                  {selectedOvertime
                    ? t("overtimeModal.editOvertime") || "Edit Overtime"
                    : t("buttons.newOvertimeRequest") || "New Overtime Request"}
                </h3>
              </div>
            </div>

            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm"
              onClick={onClose}
              type="button"
              aria-label={t("buttons.cancel")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedOvertime && (
            <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
              <Timer className="h-3.5 w-3.5" />
              <span className="truncate">{selectedOvertime.typeKey}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4">
            {/* Overtime Type */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("overtimeModal.overtimeType") || "Overtime Type"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.overtimeType}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    overtimeType: v,
                    workDate: undefined,
                  }))
                }
                disabled={isOvertimeTypesLoading}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500",
                    isFieldError("overtimeType") && "border-red-500",
                  )}
                >
                  <SelectValue
                    placeholder={
                      isOvertimeTypesLoading
                        ? t("overtimeModal.loading") || "Loading..."
                        : t("overtimeModal.selectType") || "Select overtime type"
                    }
                  />
                </SelectTrigger>

                <SelectContent className="rounded-2xl sm:rounded-lg border-slate-200">
                  {overtimeTypesData?.data?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.typeKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work Date */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("overtimeModal.workDate") || "Work Date"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start rounded-2xl sm:rounded-lg border-slate-200 bg-white text-left font-medium text-slate-900 hover:bg-slate-50",
                      !formData.workDate && "text-slate-400",
                      isFieldError("workDate") && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                    {formData.workDate
                      ? format(formData.workDate, "P")
                      : t("overtimeModal.selectWorkDate") || "Select work date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="z-[1000] w-auto rounded-2xl sm:rounded-lg border-slate-200 p-2 shadow-lg"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.workDate}
                    onSelect={(date) => {
                      if (!selectedOvertime) {
                        toast({
                          title: t("overtimeModal.selectOvertimeTypeFirst") || "Select overtime type first",
                          description: t("overtimeModal.selectTypeBeforeDate") || "Please select a type before choosing a date",
                          variant: "destructive",
                        });
                        return;
                      }

                      handleDateSelect("workDate", date);
                    }}
                    disabled={(date) => {
                      if (date < new Date()) return true;
                      if (!selectedOvertime) return true;

                      const holiday = isHoliday(date);

                      if (selectedOvertime.typeKey === "holiday" && !holiday)
                        return true;

                      if (selectedOvertime.typeKey === "normal" && holiday)
                        return true;

                      return false;
                    }}
                    initialFocus
                    className="pointer-events-auto"
                    modifiersClassNames={{
                      holiday: "bg-red-100 text-red-700 rounded-full",
                      disabledDay: "opacity-50 cursor-not-allowed",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Times */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("overtimeModal.startTime") || "Start Time"}{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />

                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className={cn(
                      "h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500",
                      isFieldError("startTime") && "border-red-500",
                    )}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("overtimeModal.endTime") || "End Time"}{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />

                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className={cn(
                      "h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500",
                      isFieldError("endTime") && "border-red-500",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <Timer className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {t("overtimeModal.hours") || "Hours"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t("overtimeModal.startTime") || "Start Time"} -{" "}
                      {t("overtimeModal.endTime") || "End Time"}
                    </p>
                  </div>
                </div>

                <Input
                  value={formData.hours || 0}
                  readOnly
                  className="h-10 w-full rounded-2xl sm:rounded-lg border-slate-200 bg-white text-center text-base font-bold text-blue-900 shadow-none sm:w-[100px]"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("overtimeModal.reason") || "Reason"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Textarea
                placeholder={t("overtimeModal.provideReason") || "Provide a reason for your overtime request"}
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={4}
                className={cn(
                  "min-h-[100px] resize-none rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500",
                  isFieldError("reason") && "border-red-500",
                )}
              />
            </div>

            {/* Attachment */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("overtimeModal.attachment") || "Attachment"}{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({selectedOvertime?.requiresAttachment ? t("overtimeModal.required") || "required" : t("overtimeModal.optional") || "optional"})
                </span>
              </Label>

              <div
                className="relative cursor-pointer rounded-2xl sm:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
                onClick={() =>
                  document.getElementById("overtime-file-input")?.click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    setFormData((prev) => ({ ...prev, attachment: file }));
                }}
              >
                <input
                  id="overtime-file-input"
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {t("overtimeModal.clickUploadOrDrag") || "Click to upload or drag & drop"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-blue-50 text-blue-600">
                        <Paperclip className="h-4 w-4" />
                      </div>

                      <span className="truncate text-sm font-medium text-slate-700">
                        {formData.attachment.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({
                          ...prev,
                          attachment: null,
                        }));
                      }}
                      aria-label={t("buttons.cancel")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 w-full rounded-2xl sm:rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 w-full rounded-2xl sm:rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting
                ? t("buttons.submitting") || "Submitting..."
                : t("buttons.submitRequest") || "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOvertimeRequestModal;