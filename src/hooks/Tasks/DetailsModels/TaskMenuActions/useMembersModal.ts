import { useEffect, useRef, useState } from "react";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { useToast } from "@/hooks/use-toast";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";

export const useMembersModal = ({ isOpen, onClose, task, workspaceId }) => {
  const { toast } = useToast();

  const [updateMembers, { isLoading }] = useUpdateTaskMutation();

  const { data } = useGetAllStaffQuery({
    directManager: JSON.parse(localStorage.getItem("user"))?._id,
  });

  const [selectedMembers, setSelectedMembers] = useState([]);

  const hasInitialized = useRef(false);

  // init selected members safely
  useEffect(() => {
    if (!isOpen || !task?._id) return;

    const ids = task?.assignedTo?.map((m) => m._id) || [];
    setSelectedMembers(ids);

    hasInitialized.current = true;
  }, [task?._id, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      setSelectedMembers([]);
    }
  }, [isOpen]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const addMember = (id) => {
    setSelectedMembers((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeMember = (id) => {
    setSelectedMembers((prev) => prev.filter((m) => m !== id));
  };

  const handleSave = async () => {
    try {
      await updateMembers({
        workspaceId,
        id: task._id,
        data: {
          assignedTo: selectedMembers,
        },
      }).unwrap();

      toast({
        title: "Updated",
        description: "Task members updated successfully",
      });

      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update members",
        variant: "destructive",
      });
    }
  };

  return {
    staff: data?.data || [],
    selectedMembers,
    toggleMember,
    addMember,
    removeMember,
    handleSave,
    isLoading,
  };
};
