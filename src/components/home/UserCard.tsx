import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PortalCard from "@/components/portal/PortalCard";
import InfoRow from "./InfoRow";
import { IUser } from "@/interfaces/home";
import { getInitials } from "@/lib/utils";

interface Props {
  user: IUser;
}

const UserCard = ({ user }: Props) => (
  <PortalCard
    title={user?.fullName}
    icon={
      user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.fullName}
          className="h-8 w-8 rounded-full object-cover border border-border shadow-sm"
        />
      ) : (
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/15 text-primary/70 text-sm font-medium border border-primary/20 shadow-sm">
          {getInitials(user?.fullName)}
        </div>
      )
    }
    headerAction={
      <Link
        to="/profile"
        className="text-sm text-primary hover:underline flex items-center"
      >
        View Profile
        <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    }
  >
    <div className="space-y-4 mt-2">
      <InfoRow label="Email" value={user?.email} />
      <InfoRow label="Phone" value={user?.phoneNumber} />
      <InfoRow label="Nationality" value={user?.nationality} />
      <InfoRow label="Marital Status" value={user?.maritalStatus} />
      <InfoRow label="Hire Date" value={user?.hireDate} />
      <InfoRow label="Salary" value={user?.salary ? `$${user.salary}` : "-"} />
      <InfoRow
        label="Employment Status"
        value={user?.employmentStatus ? "Active" : "Inactive"}
      />
    </div>
  </PortalCard>
);

export default UserCard;
