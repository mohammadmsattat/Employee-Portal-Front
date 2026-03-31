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
import { Calendar as CalendarIcon, Upload, FileText } from "lucide-react";
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
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-end sm:items-center justify-center sm:overflow-y-auto">
      <div className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto sm:max-h-none sm:overflow-visible sm:my-10 p-5 sm:p-6">
        {/* Drag Handle (mobile only) */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">
            {selectedLeave
              ? t("leaveModal.editLeaveRequest")
              : t("buttons.requestLeave")}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Leave Balance */}
        {formData.leaveType && (
          <div className="my-4 p-4 bg-white border border-border rounded-lg flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("leaveModal.leaveBalance", {
                    type: getLeaveTypeName(selectedLeave),
                  })}
                </p>
                <p className="font-semibold text-lg">
                  {remainingDays} / {totalAllowed}{" "}
                  {t("leaveModal.daysRemaining")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>{t("leaveModal.leaveType")} *</Label>
            <Select
              value={formData.leaveType}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, leaveType: v }))
              }
              disabled={isLeaveTypesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLeaveTypesLoading
                      ? t("overtimeModal.loading")
                      : t("leaveModal.selectLeaveType")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {leaveTypesData?.data?.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {getLeaveTypeName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dateFields.map((field) => (
              <div key={field} className="space-y-2">
                <Label>
                  {field === "startDate"
                    ? t("leaveModal.startDate") + " *"
                    : t("leaveModal.endDate") + " *"}
                </Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData[field] && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData[field]
                        ? format(formData[field], "PPP")
                        : field === "startDate"
                          ? t("leaveModal.selectStartDate")
                          : t("leaveModal.selectEndDate")}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData[field]}
                      onSelect={(date) => handleDateSelect(field, date)}
                      disabled={(date) => date < new Date() || isHoliday(date)}
                      initialFocus
                      className="pointer-events-auto"
                      modifiers={{
                        holiday: (date) =>
                          group?.calendarRules?.some((rule) => {
                            if (rule.effectType !== "FULL_DAY_OFF")
                              return false;
                            if (rule.patternType === "SINGLE_DATE")
                              return isSameDay(date, new Date(rule.startDate));
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
          <div className="space-y-1">
            <Label>{t("leaveModal.numberOfDays")}</Label>
            <Input
              value={numberOfDays}
              readOnly
              className="bg-white max-w-[120px]"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>{t("leaveModal.reason")} *</Label>
            <Textarea
              placeholder={t("leaveModal.provideReason")}
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={4}
            />
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label>
              {t("leaveModal.attachment")} ({t("leaveModal.optional")})
            </Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
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
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("leaveModal.clickUploadOrDrag")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                  <span className="truncate">{formData.attachment.name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500"
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
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
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
