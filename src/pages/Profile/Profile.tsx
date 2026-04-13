import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Calendar,
  Building,
  MapPin,
  Landmark,
  ShieldAlert,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard";

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    navigate("/login");
    return null;
  }

  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy") : "-";

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      ?.map((n: string) => n[0])
      ?.join("")
      ?.toUpperCase() || "U";

  const avatarUrl = user.profileImage || null;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-5">
        {/* top back area */}
        <div className="hidden sm:flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View your personal and job information
            </p>
          </div>
        </div>

        {/* summary card */}
        <PortalCard className="overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-sm ring-1 ring-blue-100">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={user.fullName} />
                ) : (
                  <AvatarFallback className="bg-blue-50 text-2xl font-bold text-blue-700">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700">
                  Employee Profile
                </div>

                <h2 className="truncate text-2xl font-bold tracking-[-0.02em] text-slate-900 sm:text-3xl">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-base text-slate-500 sm:text-lg">
                  {user.position?.name || "-"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    <Building className="h-3.5 w-3.5 text-blue-600" />
                    {user.department?.name || "-"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    {user.branch?.name || "-"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                      user.employmentStatus
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {user.employmentStatus
                      ? "Active Employee"
                      : "Inactive Employee"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PortalCard>

        {/* sections */}
        <div className="space-y-4">
          <ProfileSectionCard
            title="Personal Information"
            subtitle="Basic personal and contact details"
            icon={<User className="h-5 w-5" />}
            defaultOpen
          >
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={user.fullName}
            />
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email || "-"}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone Number"
              value={user.phoneNumber || "-"}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Secondary Phone"
              value={user.secondaryPhoneNumber || "-"}
            />
            <InfoRow
              icon={<Globe className="h-4 w-4" />}
              label="Nationality"
              value={user.nationality || "-"}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Date of Birth"
              value={formatDate(user.dateOfBirth)}
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Marital Status"
              value={user.maritalStatus || "-"}
            />
          </ProfileSectionCard>

          <ProfileSectionCard
            title="Job Information"
            subtitle="Employment and organizational details"
            icon={<Briefcase className="h-5 w-5" />}
          >
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Branch"
              value={user.branch?.name || "-"}
            />
            <InfoRow
              icon={<Building className="h-4 w-4" />}
              label="Department"
              value={user.department?.name || "-"}
            />
            <InfoRow
              icon={<Briefcase className="h-4 w-4" />}
              label="Position"
              value={user.position?.name || "-"}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Hire Date"
              value={formatDate(user.hireDate)}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Contract Period"
              value={`${formatDate(user.contractStartDate)} — ${formatDate(
                user.contractEndDate
              )}`}
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Group"
              value={user.groupId?.groupName || "-"}
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Role"
              value={user.roleId?.name || "-"}
            />
            <InfoRow
              icon={<Briefcase className="h-4 w-4" />}
              label="Salary"
              value={user.salary ? `$${user.salary}` : "-"}
            />
          </ProfileSectionCard>

          <ProfileSectionCard
            title="Bank Details"
            subtitle="Salary and payment account information"
            icon={<Landmark className="h-5 w-5" />}
          >
            <InfoRow
              label="Bank Name"
              value={user.bankDetails?.bankName || "-"}
            />
            <InfoRow
              label="Account Name"
              value={user.bankDetails?.accountName || "-"}
            />
            <InfoRow
              label="Account Number"
              value={user.bankDetails?.accountNumber || "-"}
            />
            <InfoRow label="IBAN" value={user.bankDetails?.iban || "-"} />
            <InfoRow
              label="SWIFT / BIC"
              value={user.bankDetails?.swiftBicCode || "-"}
            />
          </ProfileSectionCard>

          <ProfileSectionCard
            title="Emergency Contact"
            subtitle="Emergency contact person details"
            icon={<ShieldAlert className="h-5 w-5" />}
          >
            <InfoRow
              label="Contact Name"
              value={user.emergencyContact?.name || "-"}
            />
            <InfoRow
              label="Contact Phone"
              value={user.emergencyContact?.phone || "-"}
            />
          </ProfileSectionCard>

          <ProfileSectionCard
            title="Education"
            subtitle="Academic and qualification details"
            icon={<GraduationCap className="h-5 w-5" />}
          >
            <InfoRow
              label="Highest Level"
              value={user.education?.highestLevel || "-"}
            />
            <InfoRow
              label="Degree / Major"
              value={user.education?.degreeMajor || "-"}
            />
            <InfoRow
              label="Institution"
              value={user.education?.institution || "-"}
            />
            <InfoRow
              label="Graduation Year"
              value={user.education?.graduationYear?.toString() || "-"}
            />
            <InfoRow
              label="License Numbers"
              value={user.education?.licenseNumbers?.join(", ") || "-"}
            />
          </ProfileSectionCard>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon?: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
    {icon ? <div className="mt-0.5 text-slate-400">{icon}</div> : null}

    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800 sm:text-[15px]">
        {value || "-"}
      </p>
    </div>
  </div>
);
