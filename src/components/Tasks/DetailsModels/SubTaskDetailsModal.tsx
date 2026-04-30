// import {
//   X,
//   Trash2,
//   Upload,
//   Paperclip,
//   MessageSquare,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import StatusBadge from "@/components/portal/StatusBadge";

// import {
//   useCreateCommentMutation,
//   useDeleteCommentMutation,
//   useGetCommentsQuery,
// } from "@/rtk/Tasks/commentsApi";

// import {
//   useGetAttachmentsQuery,
//   useUploadAttachmentMutation,
//   useDeleteAttachmentMutation,
// } from "@/rtk/Tasks/attachmentsApi";

// import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

// const SubTaskDetailsModal = ({ task, subTask, isOpen, onClose }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [commentText, setCommentText] = useState("");

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     status: "",
//     priority: "",
//   });

//   const [updateSubTask] = useUpdateSubTaskMutation();
//   const [uploadAttachment] = useUploadAttachmentMutation();
//   const [deleteAttachment] = useDeleteAttachmentMutation();

//   const [createComment] = useCreateCommentMutation();
//   const [deleteComment] = useDeleteCommentMutation();

//   const { data: attachmentsData } = useGetAttachmentsQuery(
//     { subTaskId: subTask?._id },
//     { skip: !subTask }
//   );

//   const { data: commentsData } = useGetCommentsQuery(
//     { subTaskId: subTask?._id },
//     { skip: !subTask }
//   );

//   useEffect(() => {
//     if (subTask) {
//       setForm({
//         title: subTask.title || "",
//         description: subTask.description || "",
//         status: subTask.status || "todo",
//         priority: subTask.priority || "medium",
//       });
//     }
//   }, [subTask]);

//   if (!isOpen || !subTask) return null;

//   const attachments = attachmentsData?.data || [];
//   const comments = Array.isArray(commentsData)
//     ? commentsData
//     : commentsData?.data || [];

//   // SAVE
//   const handleSave = async () => {
//     await updateSubTask({
//       id: subTask._id,
//       data: form,
//     });
//     setEditMode(false);
//   };

//   // FILE
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files?.[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("subTask", subTask._id);

//     await uploadAttachment(formData).unwrap();
//     setSelectedFile(null);
//   };

//   // COMMENT
//   const handleAddComment = async () => {
//     if (!commentText.trim()) return;

//     await createComment({
//       content: commentText,
//       subTask: subTask._id,
//     });

//     setCommentText("");
//   };

//   return (
//     <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
//       <div className="w-full sm:max-w-3xl">
//         <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">

//           {/* HEADER */}
//           <div className="p-6 sm:p-7">
//             <div className="flex items-start justify-between border-b border-slate-200/70 pb-4">
//               <div className="w-full">
//                 {editMode ? (
//                   <input
//                     value={form.title}
//                     onChange={(e) =>
//                       setForm({ ...form, title: e.target.value })
//                     }
//                     className="w-full text-xl font-bold bg-transparent border border-slate-200 rounded-2xl px-3 py-2"
//                   />
//                 ) : (
//                   <h2 className="text-xl font-bold text-slate-900">
//                     {subTask.title}
//                   </h2>
//                 )}

//                 <div className="mt-3 flex gap-2 text-sm">
//                   {editMode ? (
//                     <>
//                       <select
//                         value={form.status}
//                         onChange={(e) =>
//                           setForm({ ...form, status: e.target.value })
//                         }
//                         className="h-10 rounded-2xl border border-slate-200 px-3"
//                       >
//                         <option value="todo">Todo</option>
//                         <option value="in_progress">In Progress</option>
//                         <option value="done">Done</option>
//                       </select>

//                       <select
//                         value={form.priority}
//                         onChange={(e) =>
//                           setForm({ ...form, priority: e.target.value })
//                         }
//                         className="h-10 rounded-2xl border border-slate-200 px-3"
//                       >
//                         <option value="low">Low</option>
//                         <option value="medium">Medium</option>
//                         <option value="high">High</option>
//                       </select>
//                     </>
//                   ) : (
//                     <>
//                       <StatusBadge status={subTask.status} />
//                       <span className="text-slate-500">
//                         {subTask.priority}
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="h-10 w-10 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             {/* DESCRIPTION */}
//             <div className="mt-5">
//               {editMode ? (
//                 <textarea
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm({ ...form, description: e.target.value })
//                   }
//                   className="w-full rounded-2xl border border-slate-200 p-3"
//                   rows={4}
//                 />
//               ) : (
//                 <p className="text-slate-600">
//                   {subTask.description}
//                 </p>
//               )}
//             </div>

//             {/* ATTACHMENTS */}
//             <div className="mt-6">
//               <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
//                 <Paperclip className="h-4 w-4 text-blue-600" />
//                 Attachments
//               </div>

//               <div className="flex items-center gap-2">
//                 <input type="file" onChange={handleFileChange} />

//                 <button
//                   onClick={handleUpload}
//                   className="h-10 rounded-2xl bg-blue-600 px-4 text-white text-sm flex items-center gap-2"
//                 >
//                   <Upload className="h-4 w-4" />
//                   Upload
//                 </button>
//               </div>

//               <div className="mt-3 space-y-2">
//                 {attachments.map((file) => (
//                   <div
//                     key={file._id}
//                     className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2"
//                   >
//                     <a
//                       href={file.downloadUrl}
//                       target="_blank"
//                       className="text-sm text-blue-600"
//                     >
//                       {file.fileName}
//                     </a>

//                     <button onClick={() => deleteAttachment(file._id)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* COMMENTS */}
//             <div className="mt-6">
//               <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
//                 <MessageSquare className="h-4 w-4 text-blue-600" />
//                 Comments
//               </div>

//               <div className="space-y-2">
//                 {comments.map((c) => (
//                   <div
//                     key={c._id}
//                     className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2"
//                   >
//                     <span className="text-sm text-slate-700">
//                       {c.content}
//                     </span>

//                     <button onClick={() => deleteComment(c._id)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-3 flex gap-2">
//                 <input
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                   className="flex-1 h-10 rounded-2xl border border-slate-200 px-3"
//                   placeholder="Write a comment..."
//                 />

//                 <button
//                   onClick={handleAddComment}
//                   className="h-10 rounded-2xl bg-blue-600 px-4 text-white"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="mt-6 flex justify-between border-t border-slate-200 pt-4">
//               <button
//                 onClick={() => setEditMode(!editMode)}
//                 className="h-10 rounded-2xl border border-slate-200 px-4 text-sm"
//               >
//                 {editMode ? "Cancel" : "Edit"}
//               </button>

//               {editMode && (
//                 <button
//                   onClick={handleSave}
//                   className="h-10 rounded-2xl bg-blue-600 px-4 text-white text-sm"
//                 >
//                   Save
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubTaskDetailsModal;