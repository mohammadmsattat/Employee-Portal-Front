import { useState, ReactNode } from "react";
import Topbar from "./Topbar";
import Bottombar from "./Bottombar";
import AddAdvanceRequestModal from "@/pages/Advance/AddAdvanceRequestModal";
import AddOvertimeRequestModal from "@/pages/Overtime/RequestOvertimeModal";
import AddLeaveRequestModal from "@/pages/Leaves/AddLeavesRequestModal";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);

  const openModal = (type: "leave" | "advance" | "overtime") => {
    setLeaveOpen(false);
    setAdvanceOpen(false);
    setOvertimeOpen(false);

    if (type === "leave") setLeaveOpen(true);
    if (type === "advance") setAdvanceOpen(true);
    if (type === "overtime") setOvertimeOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      <main className="container mx-auto px-4 py-8 bg-white">{children}</main>

      <Bottombar openModal={openModal} />

      {/* Modals */}
      {leaveOpen && (
        <AddLeaveRequestModal
          isOpen={leaveOpen}
          onClose={() => setLeaveOpen(false)}
        />
      )}

      {advanceOpen && (
        <AddAdvanceRequestModal
          isOpen={advanceOpen}
          onClose={() => setAdvanceOpen(false)}
        />
      )}

      {overtimeOpen && (
        <AddOvertimeRequestModal
          isOpen={overtimeOpen}
          onClose={() => setOvertimeOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
