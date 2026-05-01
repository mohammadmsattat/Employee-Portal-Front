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
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-[#f8fafc] shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-3xl sm:rounded-[34px]">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-white px-5 pb-5 pt-4 sm:px-7 sm:pt-6">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 sm:hidden" />

          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-orange-100 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-amber-100 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <FileClock className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  {t("buttons.requestOvertime")}
                </p>

                <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:text-2xl">
                  {selectedOvertime
                    ? t("overtimeModal.editOvertime")
                    : t("buttons.newOvertimeRequest")}
                </h3>

                {selectedOvertime && (
                  <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
                    <Timer className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{selectedOvertime.typeKey}</span>
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
            {/* Overtime Type */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("overtimeModal.overtimeType")}{" "}
                <span className="required">*</span>
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
                    "h-12 w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none focus:ring-2 focus:ring-slate-950",
                    isFieldError("overtimeType") && "border-red-500",
                  )}
                >
                  <SelectValue
                    placeholder={
                      isOvertimeTypesLoading
                        ? t("overtimeModal.loading")
                        : t("overtimeModal.selectType")
                    }
                  />
                </SelectTrigger>

                <SelectContent className="rounded-2xl border-slate-200">
                  {overtimeTypesData?.data?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.typeKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work Date */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("overtimeModal.workDate")}{" "}
                <span className="required">*</span>
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-12 w-full justify-start rounded-2xl border-slate-200 bg-slate-50 text-left font-bold text-slate-950 shadow-none hover:bg-slate-100",
                      !formData.workDate && "font-medium text-slate-400",
                      isFieldError("workDate") && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                    {formData.workDate
                      ? format(formData.workDate, "P")
                      : t("overtimeModal.selectWorkDate")}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="z-[1000] w-auto rounded-2xl border-slate-200 p-2 shadow-xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.workDate}
                    onSelect={(date) => {
                      if (!selectedOvertime) {
                        toast({
                          title: t("overtimeModal.selectOvertimeTypeFirst"),
                          description: t("overtimeModal.selectTypeBeforeDate"),
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
                      holiday: "bg-red-200 text-red-700 rounded-full",
                      disabledDay: "opacity-50 cursor-not-allowed",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Times */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("overtimeModal.startTime")}{" "}
                  <span className="required">*</span>
                </Label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />

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
                      "h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-bold text-slate-950 shadow-none focus-visible:ring-2 focus-visible:ring-slate-950",
                      isFieldError("startTime") && "border-red-500",
                    )}
                  />
                </div>
              </div>

              <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("overtimeModal.endTime")}{" "}
                  <span className="required">*</span>
                </Label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />

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
                      "h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-bold text-slate-950 shadow-none focus-visible:ring-2 focus-visible:ring-slate-950",
                      isFieldError("endTime") && "border-red-500",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <Timer className="h-5 w-5" />
                  </div>

                  <div>
                    <Label className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {t("overtimeModal.hours")}
                    </Label>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {t("overtimeModal.startTime")} -{" "}
                      {t("overtimeModal.endTime")}
                    </p>
                  </div>
                </div>

                <Input
                  value={formData.hours || 0}
                  readOnly
                  className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 text-center text-lg font-black text-slate-950 shadow-none sm:w-[120px]"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("overtimeModal.reason")} <span className="required">*</span>
              </Label>

              <Textarea
                placeholder={t("overtimeModal.provideReason")}
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={4}
                className={cn(
                  "min-h-[120px] resize-none rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950",
                  isFieldError("reason") && "border-red-500",
                )}
              />
            </div>

            {/* Attachment */}
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("overtimeModal.attachment")}{" "}
                {selectedOvertime?.requiresAttachment
                  ? "*"
                  : `(${t("overtimeModal.optional")})`}
              </Label>

              <div
                className="relative cursor-pointer rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-orange-400 hover:bg-orange-50"
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {t("overtimeModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
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

export default AddOvertimeRequestModal;
