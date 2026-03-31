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
import { Calendar as CalendarIcon, Upload } from "lucide-react";
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
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-end sm:items-center justify-center sm:overflow-y-auto">
      {/* Container */}
      <div className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto sm:max-h-none sm:overflow-visible sm:my-10 p-5 sm:p-6">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">
            {selectedOvertime
              ? t("overtimeModal.editOvertime")
              : t("buttons.newOvertimeRequest")}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Overtime Type */}
          <div className="space-y-2">
            <Label>{t("overtimeModal.overtimeType")} *</Label>
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
                  "w-full",
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
              <SelectContent>
                {overtimeTypesData?.data?.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.typeKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Work Date */}
          <div className="space-y-2">
            <Label>{t("overtimeModal.workDate")} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.workDate && "text-muted-foreground",
                    isFieldError("workDate") && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.workDate
                    ? format(formData.workDate, "PPP")
                    : t("overtimeModal.selectWorkDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                <Calendar
                  mode="single"
                  selected={formData.workDate}
                  onSelect={(date) => {
                    if (!selectedOvertime) {
                      toast({
                        title: t("overtimeModal.selectOvertimeTypeFirst"),
                        description: t(
                          "overtimeModal.selectTypeBeforeDate"
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

          {/* Start & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("overtimeModal.startTime")} *</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className={isFieldError("startTime") ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("overtimeModal.endTime")} *</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className={isFieldError("endTime") ? "border-red-500" : ""}
              />
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-1">
            <Label>{t("overtimeModal.hours")}</Label>
            <Input
              value={formData.hours || 0}
              readOnly
              className="bg-white max-w-[120px]"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>{t("overtimeModal.reason")} *</Label>
            <Textarea
              placeholder={t("overtimeModal.provideReason")}
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={4}
              className={isFieldError("reason") ? "border-red-500" : ""}
            />
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label>
              {t("overtimeModal.attachment")}{" "}
              {selectedOvertime?.requiresAttachment
                ? "*"
                : `(${t("overtimeModal.optional")})`}
            </Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative"
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
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("overtimeModal.clickUploadOrDrag")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                  {formData.attachment.name}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, attachment: null }));
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? t("buttons.submitting") : t("buttons.submitRequest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOvertimeRequestModal;