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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center sm:overflow-y-auto">
      <div className="w-full sm:max-w-3xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1.5 w-14 rounded-full bg-slate-300" />
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                  {t("buttons.requestAdvance")}
                </div>

                <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">
                  {t("advanceModal.newAdvanceRequest")}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t("advanceModal.reason")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                type="button"
                aria-label={t("buttons.cancel")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedAdvanceType && (
              <div className="mb-6 rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50/70 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {t("advanceModal.advanceType")}
                    </p>
                    <p className="truncate text-lg font-bold tracking-[-0.02em] text-slate-900">
                      {selectedAdvanceType.typeKey}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("advanceModal.advanceType")}{" "}
                  <span className="required">*</span>
                </Label>
                <Select
                  value={formData.advanceTypeId}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, advanceTypeId: v }))
                  }
                  disabled={isAdvanceTypesLoading}
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500">
                    <SelectValue
                      placeholder={
                        isAdvanceTypesLoading
                          ? t("overtimeModal.loading")
                          : t("advanceModal.advanceType")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200">
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

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("advanceModal.amount")} <span className="required">*</span>
                </Label>
                <div className="relative">
                  <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                  <Input
                    min={1}
                    type="number"
                    value={formData.amount}
                    placeholder={t("advanceModal.amount")}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("advanceModal.installments")}
                </Label>
                <Input
                  type="number"
                  value={formData.installments || ""}
                  placeholder={t("advanceModal.installments")}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      installments: e.target.value,
                    }))
                  }
                  className="h-12 max-w-[180px] rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("advanceModal.reason")} <span className="required">*</span>
                </Label>
                <Textarea
                  value={formData.reason}
                  placeholder={t("advanceModal.reason")}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, reason: e.target.value }))
                  }
                  rows={4}
                  className="rounded-2xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  {t("advanceModal.attachment")}
                </Label>
                <div
                  className="cursor-pointer rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-5 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50/70"
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
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {t("advanceModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        PDF, JPG, PNG, DOC
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-emerald-100">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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
                          setFormData((p) => ({ ...p, attachment: null }));
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
                  className="h-12 w-full rounded-2xl bg-emerald-600 px-6 font-semibold text-white shadow-[0_12px_24px_rgba(5,150,105,0.22)] hover:bg-emerald-700 sm:w-auto"
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

export default AddAdvanceRequestModal;
