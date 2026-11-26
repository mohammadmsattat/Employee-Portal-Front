import { useGetMyProjectsQuery } from "@/rtk/CRM/projectApi";

export const useProjects = () => {
  const { data, isLoading, isError, error, refetch } = useGetMyProjectsQuery();

  return {
    projects: data?.data || [],
    count: data?.count || 0,
    loading: isLoading,
    error: isError ? (error as any)?.data?.message || "Failed to load" : null,
    refetch,
  };
};
