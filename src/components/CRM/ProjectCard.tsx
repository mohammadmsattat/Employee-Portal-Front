import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FolderKanban,
  Calendar,
  User,
  TrendingUp,
  ArrowRight,
  CircleDot,
} from "lucide-react";

interface ProjectCardProps {
  project: any;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; ring: string; label: string }
> = {
  new: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
    label: "New",
  },
  planning: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-100",
    label: "Planning",
  },
  in_progress: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-100",
    label: "In Progress",
  },
  waiting_client: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-100",
    label: "Waiting Client",
  },
  waiting_external: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-100",
    label: "Waiting External",
  },
  final_review: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-100",
    label: "Final Review",
  },
  delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
    label: "Delivered",
  },
  closed: {
    bg: "bg-slate-200",
    text: "text-slate-700",
    ring: "ring-slate-300",
    label: "Closed",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-100",
    label: "Cancelled",
  },
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation();

  const progress = Math.min(100, Math.max(0, Number(project.progress) || 0));
  const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES["new"];

  return (
    <Link
      to={`/portal/projects/${project._id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
              <FolderKanban className="text-blue-700" size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-blue-700">
                {project.title || "—"}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {project.number || "—"}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
          >
            <CircleDot size={9} />
            {statusStyle.label}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {project.description}
          </p>
        )}

        {/* Meta */}
        <div className="mb-4 space-y-2.5 text-xs">
          {project.managerId?.fullName && (
            <div className="flex items-center gap-2 text-slate-600">
              <User size={13} className="text-slate-400" />
              <span className="truncate">{project.managerId.fullName}</span>
            </div>
          )}
          {project.dueDate && (
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={13} className="text-slate-400" />
              <span>
                {new Date(project.dueDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <TrendingUp size={12} />
              {t("projects.progress", "Progress")}
            </span>
            <span className="font-semibold text-slate-900">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress >= 100
                  ? "bg-emerald-500"
                  : progress >= 50
                    ? "bg-blue-600"
                    : "bg-blue-400"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-medium text-slate-400">
            {t("projects.openProject", "Open project")}
          </span>
          <ArrowRight
            size={16}
            className="text-blue-600 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
