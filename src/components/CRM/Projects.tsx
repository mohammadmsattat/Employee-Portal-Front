import { useTranslation } from "react-i18next";
import { Loader2, FolderKanban, AlertCircle, RefreshCw } from "lucide-react";
import { useProjects } from "@/hooks/CRM/useProjects";
import ProjectCard from "./ProjectCard";
import AppHeader from "../layout/header/AppHeader";

const Projects = () => {
  const { t } = useTranslation();
  const { projects, loading, error, refetch } = useProjects();

  // ===== Loading =====
  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-100 blur-xl opacity-60" />
            <Loader2
              className="relative animate-spin text-blue-700"
              size={40}
            />
          </div>
          <p className="text-sm text-slate-500">
            {t("projects.loading", "Loading projects...")}
          </p>
        </div>
      </>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <>
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t("projects.errorTitle", "Failed to load projects")}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
          {refetch && (
            <button
              onClick={refetch}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
            >
              <RefreshCw size={14} />
              {t("common.retry", "Retry")}
            </button>
          )}
        </div>
      </>
    );
  }

  // ===== Empty =====
  if (!projects.length) {
    return (
      <>
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
            <FolderKanban className="text-blue-700" size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t("projects.noProjects", "No projects yet")}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              {t(
                "projects.noProjectsDesc",
                "Projects where you're the manager will appear here.",
              )}
            </p>
          </div>
        </div>
      </>
    );
  }

  // ===== List =====
  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("projects.title", "My Projects")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t(
                "projects.subtitle",
                "Manage and track your project portfolio",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 ring-1 ring-blue-100">
              <FolderKanban size={14} />
              {projects.length}{" "}
              {projects.length === 1
                ? t("projects.project", "project")
                : t("projects.projects", "projects")}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
