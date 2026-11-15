import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SessionExpiredModal = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("staffToken");
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          Session Expired
        </h2>
        <p className="mb-8 text-sm text-slate-500">
          For security reasons, you have been automatically logged out. Please
          log in again to continue.
        </p>

        <Button
          onClick={handleLoginRedirect}
          className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};
