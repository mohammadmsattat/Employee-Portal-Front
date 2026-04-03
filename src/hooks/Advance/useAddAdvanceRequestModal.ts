// hooks/useAddAdvanceRequestModal.ts
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateAdvanceRequestMutation } from "@/rtk/Advance/advanceRequestApi";
import { useGetAllAdvanceTypesQuery } from "@/rtk/Advance/advanceTypeApi";

interface FormState {
  advanceTypeId: string;
  amount: string;
  installments: string;
  reason: string;
  attachment: File | null;
}

/**
 * Custom hook for managing Add Advance Request modal
 */
export const useAddAdvanceRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();

  // ===== Get user & group from localStorage =====
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const group = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("group") || "null");
    } catch {
      return null;
    }
  }, []);

  // ===== Form state =====
  const [formData, setFormData] = useState<FormState>({
    advanceTypeId: "",
    amount: "",
    installments: "",
    reason: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== Lock body scroll when modal is open =====
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ===== Fetch advance types =====
  const { data: advanceTypesData, isLoading: isAdvanceTypesLoading } =
    useGetAllAdvanceTypesQuery(
      {
        policyId: group?.advancePolicy?._id || "",
        page: 1,
        limit: 100,
      },
      { skip: !group?.advancePolicy?._id },
    );

  // ===== Selected advance type based on form =====
  const selectedAdvanceType = useMemo(() => {
    return advanceTypesData?.data?.find(
      (t: any) => t._id === formData.advanceTypeId,
    );
  }, [advanceTypesData, formData.advanceTypeId]);

  const [createAdvanceRequest] = useCreateAdvanceRequestMutation();

  // ===== Submit handler =====
  const handleSubmit = async () => {
    if (!user) return;

    //  Basic validation
    if (!formData.advanceTypeId || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill required fields.",
        variant: "destructive",
      });
      return;
    }

    const salary = Number(user.salary);
    const requestedAmount = Number(formData.amount);

    //  Policy validations
    if (selectedAdvanceType?.maxPercentageOfSalary) {
      const maxAllowed = salary * selectedAdvanceType.maxPercentageOfSalary;
      if (requestedAmount > maxAllowed) {
        toast({
          title: "Amount Exceeds Limit",
          description: `Maximum allowed is ${maxAllowed}`,
          variant: "destructive",
        });
        return;
      }
    }

    if (
      selectedAdvanceType?.allowInstallments === false &&
      formData.installments
    ) {
      toast({
        title: "Installments Not Allowed",
        description: "This advance type does not allow installments.",
        variant: "destructive",
      });
      return;
    }

    if (selectedAdvanceType?.requiresAttachment && !formData.attachment) {
      toast({
        title: "Attachment Required",
        description: "This advance type requires an attachment.",
        variant: "destructive",
      });
      return;
    }

    // ===== Submit request =====
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("advanceTypeId", formData.advanceTypeId);
      data.append("amount", formData.amount);
      // data.append("salarySnapshot", user.salary);
      data.append("userId", user._id);
      data.append("managerId", user.directManager);
      data.append("companyId", user.companyId);

      if (formData.installments)
        data.append("installments", formData.installments);
      if (formData.reason) data.append("reason", formData.reason);
      if (formData.attachment) data.append("attachment", formData.attachment);

      await createAdvanceRequest(data).unwrap();

      toast({
        title: "Advance Request Submitted",
        description: "Your advance request has been submitted.",
      });

      // Reset form & close modal
      setFormData({
        advanceTypeId: "",
        amount: "",
        installments: "",
        reason: "",
        attachment: null,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit advance request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    advanceTypesData,
    isAdvanceTypesLoading,
    selectedAdvanceType,
    handleSubmit,
  };
};
