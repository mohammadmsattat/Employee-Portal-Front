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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center sm:overflow-y-auto">
      <div className="w-full sm:max-w-3xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1.5 w-14 rounded-full bg-slate-300" />
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold tracking-wide text-orange-700">
                  {t("buttons.requestOvertime")}
                </div>

                <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">
                  {selectedOvertime
                    ? t("overtimeModal.editOvertime")
                    : t("buttons.newOvertimeRequest")}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t("overtimeModal.provideReason")}
                </p>
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                onClick={onClose}
                type="button"
                aria-label={t("buttons.cancel")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedOvertime && (
              <div className="mb-6 rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-blue-50/70 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
                    <FileClock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {t("overtimeModal.overtimeType")}
                    </p>
                    <p className="truncate text-lg font-bold tracking-[-0.02em] text-slate-900">
                      {selectedOvertime.typeKey}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
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
                      "h-12 w-full rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-orange-500",
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

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("overtimeModal.workDate")}{" "}
                  <span className="required">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start rounded-2xl border-slate-200 bg-white text-left font-medium text-slate-900 shadow-sm hover:bg-slate-50",
                        !formData.workDate && "text-slate-400",
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
                            description: t(
                              "overtimeModal.selectTypeBeforeDate",
                            ),
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
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
                        "h-12 rounded-2xl border-slate-200 bg-white pl-11 text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500",
                        isFieldError("startTime") && "border-red-500",
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
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
                        "h-12 rounded-2xl border-slate-200 bg-white pl-11 text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500",
                        isFieldError("endTime") && "border-red-500",
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("overtimeModal.hours")}
                </Label>
                <div className="relative max-w-[140px]">
                  <Timer className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />
                  <Input
                    value={formData.hours || 0}
                    readOnly
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-semibold text-slate-900 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("overtimeModal.reason")}{" "}
                  <span className="required">*</span>
                </Label>
                <Textarea
                  placeholder={t("overtimeModal.provideReason")}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  rows={4}
                  className={cn(
                    "rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500",
                    isFieldError("reason") && "border-red-500",
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("overtimeModal.attachment")}{" "}
                  {selectedOvertime?.requiresAttachment
                    ? "*"
                    : `(${t("overtimeModal.optional")})`}
                </Label>
                <div
                  className="relative cursor-pointer rounded-[24px] border border-dashed border-orange-200 bg-orange-50/40 p-5 text-center transition-colors hover:border-orange-300 hover:bg-orange-50/70"
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
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {t("overtimeModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-orange-100">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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
                        aria-label={t("buttons.cancel")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                  className="h-12 w-full rounded-2xl bg-orange-600 px-6 font-semibold text-white shadow-[0_12px_24px_rgba(234,88,12,0.22)] hover:bg-orange-700 sm:w-auto"
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

export default AddOvertimeRequestModal;
