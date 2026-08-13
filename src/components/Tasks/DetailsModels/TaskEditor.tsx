// TaskEditor.jsx
import {
  Save,
  CalendarDays,
  Users,
  ArrowRight,
  Clock,
  Edit2,
  Check,
  X as XIcon,
  AlignLeft,
} from "lucide-react";
import { useState, useCallback, memo } from "react";
import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";
import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";
import UpdateTaskTimeLogModal from "./TaskMenuActoions/TimeLogModal";

// ===== STYLES =====
const getActionButtonStyles = (isMobile) => {
  const baseStyles = `
    flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-2xl 
    bg-white/80 border border-slate-200/60 text-slate-700 
    hover:bg-white hover:shadow-sm hover:border-slate-300 
    transition-all duration-200 backdrop-blur-sm
  `;

  const mobileStyles = `
    flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl 
    bg-white/90 border border-slate-200/60 text-slate-700 
    hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm 
    transition-all duration-200 active:scale-95
    flex-1 justify-center min-h-[40px]
  `;

  return isMobile ? mobileStyles : baseStyles;
};

const getIconSize = (isMobile) => (isMobile ? "w-3.5 h-3.5" : "w-4 h-4");

// ===== SUB COMPONENTS =====
const ActionButton = memo(
  ({ isMobile, icon: Icon, label, onClick, iconColor, isMobileLabel }) => (
    <div className="relative">
      <button className={getActionButtonStyles(isMobile)} onClick={onClick}>
        <Icon className={`${getIconSize(isMobile)} ${iconColor}`} />
        <span>{isMobile ? isMobileLabel : label}</span>
      </button>
    </div>
  ),
);

ActionButton.displayName = "ActionButton";

const TitleEditor = memo(
  ({
    tempTitle,
    setTempTitle,
    handleTitleSave,
    handleTitleCancel,
    isMobile,
  }) => (
    <div className="flex items-center gap-2">
      <input
        value={tempTitle}
        onChange={(e) => setTempTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleTitleSave();
          if (e.key === "Escape") handleTitleCancel();
        }}
        className={`flex-1 font-semibold border-2 border-blue-300 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 bg-white transition
        ${isMobile ? "text-base px-3.5 py-2.5" : "text-lg px-4 py-2.5"}
      `}
        autoFocus
        placeholder="Enter task title..."
      />
      <button
        onClick={handleTitleSave}
        className={`flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm hover:shadow
        ${isMobile ? "h-10 w-10" : "h-11 w-11"}
      `}
      >
        <Check className={`${isMobile ? "h-4.5 w-4.5" : "h-5 w-5"}`} />
      </button>
      <button
        onClick={handleTitleCancel}
        className={`flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition
        ${isMobile ? "h-10 w-10" : "h-11 w-11"}
      `}
      >
        <XIcon className={`${isMobile ? "h-4.5 w-4.5" : "h-5 w-5"}`} />
      </button>
    </div>
  ),
);

TitleEditor.displayName = "TitleEditor";

// ✅ تم إضافة isMobile كـ prop
const TitleDisplay = memo(({ title, onEdit, isMobile }) => (
  <div className="flex items-start gap-2 cursor-pointer group" onClick={onEdit}>
    <h2
      className={`font-semibold text-slate-800 flex-1 line-clamp-2 ${isMobile ? "text-base" : "text-xl"}`}
    >
      {title || "Untitled Task"}
    </h2>
    <div className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition bg-slate-100 group-hover:bg-slate-200">
      <Edit2 className="w-4 h-4 text-slate-500" />
    </div>
  </div>
));

TitleDisplay.displayName = "TitleDisplay";

// ===== MAIN COMPONENT =====
function TaskEditor({
  form,
  updateField,
  saveTask,
  entity,
  openPanel,
  handleOpen,
  popoverStyle,
  closeSubModal,
  workspaceId,
  refetchTasks,
  listId,
  isMobile = false,
}) {
  // ===== STATE =====
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(form?.title || "");
  const [charCount, setCharCount] = useState(form?.description?.length || 0);

  // ===== HANDLERS =====
  const handleTitleSave = useCallback(() => {
    if (tempTitle.trim()) {
      updateField("title", tempTitle.trim());
      setIsEditingTitle(false);
    }
  }, [tempTitle, updateField]);

  const handleTitleCancel = useCallback(() => {
    setTempTitle(form?.title || "");
    setIsEditingTitle(false);
  }, [form?.title]);

  const handleDescriptionChange = useCallback(
    (e) => {
      const value = e.target.value;
      updateField("description", value);
      setCharCount(value.length);
    },
    [updateField],
  );

  const handleTitleEdit = useCallback(() => {
    setTempTitle(form?.title || "");
    setIsEditingTitle(true);
  }, [form?.title]);

  // ===== RENDER =====
  return (
    <div
      className={`flex-1 flex flex-col ${isMobile ? "bg-white" : "bg-slate-50/40"} overflow-hidden`}
    >
      {/* ===== TITLE SECTION ===== */}
      <div
        className={`shrink-0 ${isMobile ? "px-4 py-3 bg-white" : "p-6"} border-b border-slate-200/50`}
      >
        {isEditingTitle ? (
          <TitleEditor
            tempTitle={tempTitle}
            setTempTitle={setTempTitle}
            handleTitleSave={handleTitleSave}
            handleTitleCancel={handleTitleCancel}
            isMobile={isMobile}
          />
        ) : (
          // ✅ تم تمرير isMobile إلى TitleDisplay
          <TitleDisplay
            title={form?.title}
            onEdit={handleTitleEdit}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* ===== ACTIONS SECTION ===== */}
      <div
        className={`shrink-0 ${isMobile ? "px-3 py-2.5 bg-slate-50/80" : "px-6 py-4 bg-white/50"} border-b border-slate-200/50 ${isMobile ? "overflow-x-auto" : ""}`}
      >
        <div
          className={`
          flex gap-1.5 sm:gap-2
          ${isMobile ? "flex-nowrap min-w-max" : "flex-wrap"}
        `}
        >
          {/* Status */}
          <div className="relative">
            <ActionButton
              isMobile={isMobile}
              icon={ArrowRight}
              label="Status"
              isMobileLabel="Move"
              onClick={(e) => handleOpen(e, "status")}
              iconColor="text-blue-500"
            />
            {openPanel === "status" && (
              <div style={popoverStyle()}>
                <UpdateTaskStatusModal
                  entity={entity}
                  isOpen
                  onClose={closeSubModal}
                  workspaceId={workspaceId}
                  listId={listId}
                  refetchTasks={refetchTasks}
                />
              </div>
            )}
          </div>

          {/* Members */}
          <div className="relative">
            <ActionButton
              isMobile={isMobile}
              icon={Users}
              label="Members"
              isMobileLabel="Team"
              onClick={(e) => handleOpen(e, "members")}
              iconColor="text-indigo-500"
            />
            {openPanel === "members" && (
              <div style={{ ...popoverStyle(), overflow: "visible" }}>
                <UpdateTaskMembersModal
                  entity={entity}
                  isOpen
                  onClose={closeSubModal}
                  workspaceId={workspaceId}
                  listId={listId}
                  refetchTasks={refetchTasks}
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="relative">
            <ActionButton
              isMobile={isMobile}
              icon={CalendarDays}
              label="Dates"
              isMobileLabel="Due"
              onClick={(e) => handleOpen(e, "dates")}
              iconColor="text-emerald-500"
            />

            {openPanel === "dates" && (
              <div
                style={{
                  ...popoverStyle(),

                  // ===== MOBILE POSITIONING =====
                  ...(isMobile
                    ? {
                        left: "auto",
                        right: 0,
                        transform: "none",
                        width: "max-content",
                        maxWidth: "calc(100vw - 24px)",
                      }
                    : {}),
                }}
              >
                <UpdateTaskDatesModal
                  entity={entity}
                  isOpen
                  onClose={closeSubModal}
                  workspaceId={workspaceId}
                  listId={listId}
                  refetchTasks={refetchTasks}
                />
              </div>
            )}
          </div>

          {/* Time */}
          {/* Time */}
          <div className="relative">
            <ActionButton
              isMobile={isMobile}
              icon={Clock}
              label="Time"
              isMobileLabel="Time"
              onClick={(e) => handleOpen(e, "time")}
              iconColor="text-amber-500"
            />
            {openPanel === "time" && (
              <div
                className="fixed inset-0 z-[9999] pointer-events-none"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-end",
                  padding: isMobile ? "20px" : "24px",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    closeSubModal();
                  }
                }}
              >
                <div className="pointer-events-auto w-full max-w-[400px]">
                  <UpdateTaskTimeLogModal
                    entity={entity}
                    isOpen
                    onClose={closeSubModal}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESCRIPTION SECTION ===== */}
      <div
        className={`flex-1 ${isMobile ? "p-3" : "p-6"} overflow-hidden min-h-[80px]`}
      >
        <div className="relative h-full">
          {!isMobile && (
            <div className="flex items-center gap-2 mb-2.5">
              <AlignLeft className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">
                Description
              </span>
              {charCount > 0 && (
                <span className="text-[10px] text-slate-400 ml-auto">
                  {charCount} characters
                </span>
              )}
            </div>
          )}
          <textarea
            value={form?.description || ""}
            onChange={handleDescriptionChange}
            placeholder={
              isMobile
                ? "Add a description..."
                : "Write a detailed description..."
            }
            className={`w-full h-full min-h-[100px] border border-slate-200/60 rounded-xl p-3.5 outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none text-sm placeholder:text-slate-400 transition
              ${isMobile ? "sm:min-h-[120px]" : "sm:min-h-[150px]"}
            `}
          />
          {isMobile && charCount > 0 && (
            <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-white/80 px-2 py-0.5 rounded-full">
              {charCount}
            </span>
          )}
        </div>
      </div>

      {/* ===== SAVE SECTION ===== */}
      <div
        className={`shrink-0 ${isMobile ? "px-4 py-3 bg-white/95" : "p-6"} border-t border-slate-200/50 flex ${isMobile ? "" : "justify-end"} backdrop-blur-sm safe-area-bottom`}
      >
        <button
          onClick={saveTask}
          className={`
            bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md 
            hover:shadow-lg hover:from-blue-700 hover:to-blue-800 
            transition-all duration-200 flex items-center gap-2 text-sm font-medium
            active:scale-95
            ${
              isMobile
                ? "w-full justify-center py-3 px-4"
                : "px-8 py-2.5 rounded-2xl"
            }
          `}
        >
          <Save className={`${isMobile ? "w-4 h-4" : "w-4.5 h-4.5"}`} />
          {isMobile ? "Save" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default memo(TaskEditor);
