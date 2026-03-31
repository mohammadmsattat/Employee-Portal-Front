// AddAdvanceRequestModal.tsx
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
import { Upload } from "lucide-react";
import { useAddAdvanceRequestModal } from "@/hooks/Advance/useAddAdvanceRequestModal";
import { useTranslation } from "react-i18next";

const AddAdvanceRequestModal = ({ isOpen, onClose }: any) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    isSubmitting,
    advanceTypesData,
    handleSubmit,
  } = useAddAdvanceRequestModal({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-end sm:items-center justify-center sm:overflow-y-auto">
      <div className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto sm:max-h-none sm:overflow-visible sm:my-10 p-5 sm:p-6">
        {/* Drag handle */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {t("advanceModal.newAdvanceRequest")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Advance Type */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              {t("advanceModal.advanceType")} *
            </Label>
            <Select
              value={formData.advanceTypeId}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, advanceTypeId: v }))
              }
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder={t("advanceModal.advanceType")} />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base">
                {advanceTypesData?.data?.map((t: any) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.typeKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              {t("advanceModal.amount")} *
            </Label>
            <Input
              type="number"
              value={formData.amount}
              placeholder={t("advanceModal.amount")}
              onChange={(e) =>
                setFormData((p) => ({ ...p, amount: e.target.value }))
              }
              className="text-sm sm:text-base"
            />
          </div>

          {/* Installments */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              {t("advanceModal.installments")}
            </Label>
            <Input
              type="number"
              value={formData.installments || ""}
              placeholder={t("advanceModal.installments")}
              onChange={(e) =>
                setFormData((p) => ({ ...p, installments: e.target.value }))
              }
              className="text-sm sm:text-base"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              {t("advanceModal.reason")} *
            </Label>
            <Textarea
              value={formData.reason}
              placeholder={t("advanceModal.reason")}
              onChange={(e) =>
                setFormData((p) => ({ ...p, reason: e.target.value }))
              }
              rows={4}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              {t("advanceModal.attachment")}
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() =>
                document.getElementById("advance-file-input")?.click()
              }
            >
              <input
                id="advance-file-input"
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    attachment: e.target.files?.[0] || null,
                  }))
                }
              />
              {!formData.attachment ? (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t("advanceModal.clickUploadOrDrag")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                  <span className="truncate text-sm sm:text-base">
                    {formData.attachment.name}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((p) => ({ ...p, attachment: null }));
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
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
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

export default AddAdvanceRequestModal;
