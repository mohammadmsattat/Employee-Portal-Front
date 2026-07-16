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
import { BadgeDollarSign, Paperclip, Upload, Wallet, X } from "lucide-react";
import { useAddAdvanceRequestModal } from "@/hooks/Advance/useAddAdvanceRequestModal";
import { useTranslation } from "react-i18next";

type AddAdvanceRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AdvanceTypeOption = {
  _id: string;
  typeKey: string;
};

const AddAdvanceRequestModal = ({
  isOpen,
  onClose,
}: AddAdvanceRequestModalProps) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    isSubmitting,
    advanceTypesData,
    isAdvanceTypesLoading,
    selectedAdvanceType,
    handleSubmit,
  } = useAddAdvanceRequestModal({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-2xl sm:rounded-2xl">
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
                <Wallet className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {t("buttons.requestAdvance") || "Request Advance"}
                </p>

                <h3 className="text-lg font-bold text-blue-900">
                  {t("advanceModal.newAdvanceRequest") || "New Advance Request"}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              aria-label={t("buttons.cancel")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedAdvanceType && (
            <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
              <BadgeDollarSign className="h-3.5 w-3.5" />
              <span className="truncate">
                {selectedAdvanceType.typeKey}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4">
            {/* Advance Type */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("advanceModal.advanceType") || "Advance Type"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.advanceTypeId}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, advanceTypeId: v }))
                }
                disabled={isAdvanceTypesLoading}
              >
                <SelectTrigger className="h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500">
                  <SelectValue
                    placeholder={
                      isAdvanceTypesLoading
                        ? t("overtimeModal.loading") || "Loading..."
                        : t("advanceModal.advanceType") || "Select advance type"
                    }
                  />
                </SelectTrigger>

                <SelectContent className="rounded-2xl sm:rounded-lg border-slate-200">
                  {(
                    advanceTypesData?.data as AdvanceTypeOption[] | undefined
                  )?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.typeKey}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount & Installments */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("advanceModal.amount") || "Amount"}{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <BadgeDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />

                  <Input
                    min={1}
                    type="number"
                    value={formData.amount}
                    placeholder={t("advanceModal.amount") || "Enter amount"}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("advanceModal.installments") || "Installments"}
                </Label>

                <Input
                  type="number"
                  value={formData.installments || ""}
                  placeholder={t("advanceModal.installments") || "Number of installments"}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      installments: e.target.value,
                    }))
                  }
                  className="h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("advanceModal.reason") || "Reason"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Textarea
                value={formData.reason}
                placeholder={t("advanceModal.reason") || "Provide a reason for your advance request"}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, reason: e.target.value }))
                }
                rows={4}
                className="min-h-[100px] resize-none rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* Attachment */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("advanceModal.attachment") || "Attachment"}{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({t("advanceModal.optional") || "optional"})
                </span>
              </Label>

              <div
                onClick={() =>
                  document.getElementById("advance-file-input")?.click()
                }
                className="cursor-pointer rounded-2xl sm:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
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
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {t("advanceModal.clickUploadOrDrag") || "Click to upload or drag & drop"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PDF, JPG, PNG, DOC
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
                        setFormData((p) => ({ ...p, attachment: null }));
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

        {/* Sticky actions */}
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

export default AddAdvanceRequestModal;