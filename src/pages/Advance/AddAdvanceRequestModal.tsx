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
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-[#f8fafc] shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-2xl sm:rounded-[34px]">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-white px-5 pb-5 pt-4 sm:px-7 sm:pt-6">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 sm:hidden" />

          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-100 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-100 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <Wallet className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  {t("buttons.requestAdvance")}
                </p>

                <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:text-2xl">
                  {t("advanceModal.newAdvanceRequest")}
                </h3>

                {selectedAdvanceType && (
                  <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    <BadgeDollarSign className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {selectedAdvanceType.typeKey}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              aria-label={t("buttons.cancel")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4">
            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
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
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none focus:ring-2 focus:ring-slate-950">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("advanceModal.amount")} <span className="required">*</span>
                </Label>

                <div className="relative">
                  <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />

                  <Input
                    min={1}
                    type="number"
                    value={formData.amount}
                    placeholder={t("advanceModal.amount")}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-12 font-bold text-slate-950 shadow-none placeholder:font-medium focus-visible:ring-2 focus-visible:ring-slate-950"
                  />
                </div>
              </div>

              <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
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
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-950 shadow-none placeholder:font-medium focus-visible:ring-2 focus-visible:ring-slate-950"
                />
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("advanceModal.reason")} <span className="required">*</span>
              </Label>

              <Textarea
                value={formData.reason}
                placeholder={t("advanceModal.reason")}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, reason: e.target.value }))
                }
                rows={4}
                className="min-h-[120px] resize-none rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-none focus-visible:ring-2 focus-visible:ring-slate-950"
              />
            </div>

            <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <Label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                {t("advanceModal.attachment")}
              </Label>

              <div
                onClick={() =>
                  document.getElementById("advance-file-input")?.click()
                }
                className="cursor-pointer rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {t("advanceModal.clickUploadOrDrag")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        PDF, JPG, PNG, DOC
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
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
          </div>
        </div>

        {/* Sticky actions */}
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

export default AddAdvanceRequestModal;
