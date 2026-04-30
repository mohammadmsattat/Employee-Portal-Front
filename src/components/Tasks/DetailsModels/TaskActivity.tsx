import { Paperclip, RefreshCw } from "lucide-react";

/* =========================
   SKELETON ITEM
========================= */
const ActivitySkeleton = () => {
  return (
    <div className="flex gap-3 mb-3 animate-pulse">
      {/* avatar */}
      <div className="w-9 h-9 rounded-full bg-slate-200" />

      {/* card */}
      <div className="flex-1 bg-white/60 border border-slate-200/40 rounded-2xl p-3">
        <div className="flex justify-between mb-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-2 w-16 bg-slate-200 rounded" />
        </div>

        <div className="h-3 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export default function TaskActivity({
  activity,
  commentText,
  setCommentText,
  addComment,
  loading,
  error,
  refetch,
}) {
  return (
    <div className="w-1/2 flex flex-col p-6 bg-slate-50/40">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-slate-500 tracking-wide">
          Activity
        </div>

        <button
          onClick={refetch}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* =========================
           LOADING (SKELETON LIST)
        ========================== */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)}

        {/* =========================
           ERROR
        ========================== */}
        {error && (
          <div className="text-xs text-red-500 text-center mt-10">
            Failed to load activity
          </div>
        )}

        {/* =========================
           EMPTY STATE
        ========================== */}
        {!loading && !error && activity.length === 0 && (
          <div className="text-xs text-slate-400 text-center mt-10">
            No activity yet
          </div>
        )}

        {/* =========================
           DATA
        ========================== */}
        {!loading &&
          !error &&
          activity.map((item) => {
            const d = item.data;
            const name =
              d.createdBy?.fullName || d.uploadedBy?.fullName || "User";

            return (
              <div key={d._id} className="flex gap-3 mb-3">
                {/* AVATAR */}
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold shadow-lg">
                  {name.charAt(0).toUpperCase()}
                </div>

                {/* CARD */}
                <div className="flex-1 bg-white/90 border border-slate-200/60 rounded-2xl p-3 shadow-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold truncate max-w-[150px]">
                      {name}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {new Date(item.date).toLocaleString("en-GB")}
                    </span>
                  </div>

                  {item.type === "comment" && (
                    <div className="text-sm text-slate-700">{d.content}</div>
                  )}

                  {item.type === "attachment" && (
                    <a
                      href={d.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Open file
                    </a>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* INPUT */}
      <div className="mt-3 pt-3 border-t flex gap-2 bg-white/70 rounded-2xl p-3">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-slate-200/60 rounded-xl px-3 py-2 text-sm outline-none bg-white shadow-sm focus:shadow-md transition"
          placeholder="Write comment..."
        />

        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-100 transition shadow-sm hover:shadow-md"
          title="Attach file"
          onClick={() => {
            console.log("open attachment");
          }}
        >
          <Paperclip className="w-4 h-4" />
        </button>

           <button
                onClick={() => {
                  if (!commentText.trim()) return;
                  addComment(commentText);
                  setCommentText("");
                }}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-[0.98]"
                title="Send"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
      </div>
    </div>
  );
}
