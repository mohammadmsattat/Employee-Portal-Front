// TaskActivity.jsx
import {
  Paperclip,
  RefreshCw,
  Send,
  Image,
  File,
  MessageSquare,
  MoreVertical,
  Reply,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, memo } from "react";

// ===== SKELETON =====
const ActivitySkeleton = memo(() => (
  <div className="flex gap-3 mb-3 animate-pulse">
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200" />
    <div className="flex-1 bg-white/60 border border-slate-200/40 rounded-2xl p-3">
      <div className="flex justify-between mb-2">
        <div className="h-3 w-20 sm:w-24 bg-slate-200 rounded" />
        <div className="h-2 w-12 sm:w-16 bg-slate-200 rounded" />
      </div>
      <div className="h-3 w-3/4 bg-slate-200 rounded" />
    </div>
  </div>
));

ActivitySkeleton.displayName = "ActivitySkeleton";

// ===== TIME HELPER =====
const getTimeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

// ===== ACTIVITY ITEM =====
const ActivityItem = memo(({ item, isOwn, isMobile }) => {
  const d = item.data;
  const name = d.createdBy?.fullName || d.uploadedBy?.fullName || "User";
  const avatar = d.createdBy?.avatar || d.uploadedBy?.avatar;
  const timeAgo = getTimeAgo(item.date || item.createdAt);

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className={`${isMobile ? "w-8 h-8" : "w-9 h-9"} rounded-full object-cover border-2 border-white shadow-sm`}
          />
        ) : (
          <div
            className={`${isMobile ? "w-8 h-8" : "w-9 h-9"} rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-sm`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 ${isMobile ? "max-w-[85%]" : ""}`}>
        <div
          className={`rounded-2xl p-3 shadow-sm ${
            isOwn
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
              : "bg-white border border-slate-200/60"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span
              className={`text-xs font-semibold ${isOwn ? "text-blue-100" : "text-slate-700"}`}
            >
              {isOwn ? "You" : name}
            </span>
            <span
              className={`text-[10px] ${isOwn ? "text-blue-200" : "text-slate-400"}`}
            >
              {timeAgo}
            </span>
          </div>

          {/* Content */}
          {item.type === "comment" && (
            <p
              className={`text-sm leading-relaxed ${isOwn ? "text-white" : "text-slate-700"}`}
            >
              {d.content}
            </p>
          )}

          {item.type === "attachment" && (
            <div className="space-y-2">
              <a
                href={d.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                  isOwn
                    ? "text-blue-100 hover:text-white"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {d.fileType?.startsWith("image/") ? (
                  <Image className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                {d.fileName || "Open attachment"}
              </a>
              {d.fileType?.startsWith("image/") && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200/20">
                  <img
                    src={d.downloadUrl}
                    alt="Attachment"
                    className={`w-full h-auto ${isMobile ? "max-h-[150px]" : "max-h-[200px]"} object-cover`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

// ===== MAIN COMPONENT =====
function TaskActivity({
  activity,
  commentText,
  setCommentText,
  addComment,
  loading,
  error,
  refetch,
  isMobile = false,
}) {
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // ===== SCROLL HANDLERS =====
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 150);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // ===== EFFECTS =====
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (scrollRef.current && activity?.length > 0) {
      const container = scrollRef.current;
      const shouldScroll =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      if (shouldScroll) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [activity]);

  // ===== HANDLERS =====
  const handleFileAttach = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  }, []);

  const handleSendComment = useCallback(() => {
    if (!commentText.trim()) return;
    addComment(commentText);
    setCommentText("");
  }, [commentText, addComment, setCommentText]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        addComment(commentText);
        setCommentText("");
      }
    }
  }, [commentText, addComment, setCommentText]);

  const handleInput = useCallback((e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }, []);

  // ===== RENDER =====
  return (
    <div
      className={`flex-1 flex flex-col ${isMobile ? "bg-white" : "bg-slate-50/40"} overflow-hidden`}
    >
      {/* ===== HEADER ===== */}
      <div
        className={`shrink-0 ${isMobile ? "px-3 py-2.5 bg-white/90" : "px-6 py-4 bg-white/80"} border-b border-slate-200/50 flex items-center justify-between backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`${isMobile ? "p-1.5" : "p-2"} rounded-lg bg-blue-50`}
          >
            <MessageSquare
              className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} text-blue-500`}
            />
          </div>
          <span
            className={`font-semibold text-slate-700 ${isMobile ? "text-xs" : "text-sm"}`}
          >
            Activity
          </span>
        </div>

        <button
          onClick={refetch}
          className="text-[10px] flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition px-2 py-1 rounded-lg hover:bg-slate-100"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span className={isMobile ? "hidden" : "inline"}>Refresh</span>
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto overscroll-contain ${isMobile ? "px-3 py-3 space-y-3" : "px-4 py-4 space-y-3"}`}
      >
        {/* Loading */}
        {loading &&
          Array.from({ length: isMobile ? 3 : 4 }).map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <X className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Failed to load messages
            </p>
            <p className="text-xs text-slate-400 mt-1">Please try again</p>
            <button
              onClick={refetch}
              className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-800 transition"
            >
              Try again →
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && activity?.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center h-full text-center ${isMobile ? "p-6" : "p-8"}`}
          >
            <div
              className={`rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center ${isMobile ? "w-16 h-16" : "w-20 h-20"} mb-4`}
            >
              <MessageSquare
                className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} text-blue-300`}
              />
            </div>
            <p
              className={`font-semibold text-slate-700 ${isMobile ? "text-sm" : "text-base"}`}
            >
              No messages yet
            </p>
            <p
              className={`text-slate-400 ${isMobile ? "text-xs mt-1" : "text-sm mt-1.5"}`}
            >
              Start the conversation
            </p>
          </div>
        )}

        {/* Data */}
        {!loading &&
          !error &&
          activity?.map((item, index) => {
            const d = item.data;
            const isOwn = d.createdBy?._id === "currentUser";
            return (
              <ActivityItem
                key={d._id || item._id || index}
                item={item}
                isOwn={isOwn}
                isMobile={isMobile}
              />
            );
          })}

        {/* Scroll to bottom */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="sticky bottom-0 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full shadow-lg px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            ↓ New messages
          </button>
        )}
      </div>

      {/* ===== INPUT ===== */}
      <div
        className={`shrink-0 ${isMobile ? "px-3 py-2.5 bg-white/95" : "px-4 py-3 bg-white/95"} border-t border-slate-200/50 backdrop-blur-sm safe-area-bottom`}
      >
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isMobile ? "Type a message..." : "Write a comment..."
              }
              className="w-full border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none min-h-[44px] max-h-[120px] transition placeholder:text-slate-400"
              rows={1}
              style={{ height: "auto" }}
              onInput={handleInput}
            />
          </div>

          <div className="flex gap-1.5 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileAttach}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`${isMobile ? "h-11 w-11" : "h-11 w-11"} flex items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95`}
              title="Attach file"
            >
              <Paperclip
                className={`${isMobile ? "w-4.5 h-4.5" : "w-5 h-5"}`}
              />
            </button>

            <button
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className={`${isMobile ? "h-11 w-11" : "h-11 w-11"} flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
              title="Send"
            >
              <Send className={`${isMobile ? "w-4.5 h-4.5" : "w-5 h-5"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskActivity);