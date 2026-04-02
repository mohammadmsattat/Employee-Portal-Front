// pages/ManagerAdvanceRequests.tsx
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Search, X, Eye } from "lucide-react";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import ManagerAdvanceRequestModal from "./ManagerAdvanceRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import { useManagerAdvances } from "@/hooks/Advance/useManagerAdvances";
import { format } from "date-fns";

const ManagerAdvanceRequests = () => {
  const {
    data,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    mobileLimit,
    statusFilter,
    setStatusFilter,
    searchInput,
    setSearchInput,
    selectedRequest,
    setSelectedRequest,
    updating,
    handleApprove,
    handleReject,
    totalPages,
    isMobile,
    t,
  } = useManagerAdvances();

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "PPP");
  };

  if (isLoading)
    return (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-portal-header">
            {t("managerAdvanceRequestsPage.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("managerAdvanceRequestsPage.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <PortalCard
          title={t("managerAdvanceRequestsPage.filters")}
          icon={<Search className="h-5 w-5" />}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("managerAdvanceRequestsPage.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("managerAdvanceRequestsPage.status")}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">
                  {t("managerAdvanceRequestsPage.allStatus")}
                </option>
                <option value="pending">
                  {t("managerAdvanceRequestsPage.pending")}
                </option>
                <option value="approved">
                  {t("managerAdvanceRequestsPage.approved")}
                </option>
                <option value="rejected">
                  {t("managerAdvanceRequestsPage.rejected")}
                </option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("");
                  setSearchInput("");
                }}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />{" "}
                {t("managerAdvanceRequestsPage.reset")}
              </Button>
            </div>
          </div>
        </PortalCard>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <PortalCard
            title={t("managerAdvanceRequestsPage.history")}
            icon={<FileText className="h-5 w-5" />}
          >
            {data?.data?.length ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.employee")}
                      </TableHead>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.date")}
                      </TableHead>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.amount")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("managerAdvanceRequestsPage.status")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("managerAdvanceRequestsPage.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((req: any) => (
                      <TableRow key={req._id} className="hover:bg-gray-50">
                        <TableCell>{req.userId?.fullName || "-"}</TableCell>
                        <TableCell>{formatDate(req.createdAt)}</TableCell>
                        <TableCell>{req.amount || "-"}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center h-full">
                            <Eye
                              className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer"
                              onClick={() => setSelectedRequest(req)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                {t("managerAdvanceRequestsPage.noRequests")}
              </div>
            )}
          </PortalCard>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 mt-4">
          {data?.data?.length ? (
            data.data.map((req: any) => (
              <MobileCard key={req._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>
                      {t("managerAdvanceRequestsPage.employee")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {req.userId?.fullName || "-"}
                    </MobileCardValue>
                  </div>
                  <StatusBadge status={req.status} />
                </MobileCardHeader>

                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("managerAdvanceRequestsPage.date")}
                      </MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(req.createdAt)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("managerAdvanceRequestsPage.amount")}
                      </MobileCardLabel>
                      <MobileCardValue>{req.amount || "-"}</MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setSelectedRequest(req)}>
                        {t("managerAdvanceRequestsPage.view")}
                      </Button>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {t("managerAdvanceRequestsPage.noRequests")}
            </div>
          )}
        </div>

        {/* Pagination */}
        <UnifiedPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
          perPage={isMobile ? mobileLimit : limit}
          setPerPage={isMobile ? undefined : setLimit}
          className="mt-4"
        />

        {/* Modal */}
        {selectedRequest && (
          <ManagerAdvanceRequestModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            submitting={updating}
          />
        )}
      </div>
    </Layout>
  );
};

export default ManagerAdvanceRequests;
