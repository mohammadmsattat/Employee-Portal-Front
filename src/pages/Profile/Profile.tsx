import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Mail, Phone, Globe, Calendar, Building, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import PortalCard from '@/components/portal/PortalCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    navigate('/login');
    return null;
  }

  const formatDate = (dateString: string) => dateString ? format(new Date(dateString), 'MMM dd, yyyy') : '-';
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarUrl = user.profileImage || null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-portal-header">My Profile</h1>
            <p className="text-muted-foreground mt-1">View your personal and job information</p>
          </div>
        </div>

        {/* Profile Header */}
        <PortalCard>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={user.fullName} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">{getInitials(user.fullName)}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-portal-header">{user.fullName}</h2>
              <p className="text-lg text-muted-foreground">{user.position?.name || '-'}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {user.department?.name || '-'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {user.branch?.name || '-'}
                </span>
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-status-approved/10 text-status-approved">
                {user.employmentStatus ? 'Active Employee' : 'Inactive Employee'}
              </span>
            </div>
          </div>
        </PortalCard>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortalCard title="Personal Information" icon={<User className="h-5 w-5" />}>
            <InfoRow icon={<User />} label="Full Name" value={user.fullName} />
            <InfoRow icon={<Mail />} label="Email" value={user.email || '-'} />
            <InfoRow icon={<Phone />} label="Phone Number" value={user.phoneNumber || '-'} />
            <InfoRow icon={<Phone />} label="Secondary Phone" value={user.secondaryPhoneNumber || '-'} />
            <InfoRow icon={<Globe />} label="Nationality" value={user.nationality || '-'} />
            <InfoRow icon={<Calendar />} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
            <InfoRow icon={<User />} label="Marital Status" value={user.maritalStatus || '-'} />
          </PortalCard>

          {/* Job Information */}
          <PortalCard title="Job Information" icon={<Briefcase className="h-5 w-5" />}>
            <InfoRow icon={<MapPin />} label="Branch" value={user.branch?.name || '-'} />
            <InfoRow icon={<Building />} label="Department" value={user.department?.name || '-'} />
            <InfoRow icon={<Briefcase />} label="Position" value={user.position?.name || '-'} />
            <InfoRow icon={<Calendar />} label="Hire Date" value={formatDate(user.hireDate)} />
            <InfoRow icon={<Calendar />} label="Contract Period" value={`${formatDate(user.contractStartDate)} — ${formatDate(user.contractEndDate)}`} />
            <InfoRow icon={<User />} label="Group" value={user.groupId?.groupName || '-'} />
            <InfoRow icon={<User />} label="Role" value={user.roleId?.name || '-'} />
            <InfoRow icon={<User />} label="Salary" value={user.salary ? `$${user.salary}` : '-'} />
          </PortalCard>
        </div>

        {/* Bank & Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortalCard title="Bank Details" icon={<Briefcase className="h-5 w-5" />}>
            <InfoRow label="Bank Name" value={user.bankDetails?.bankName || '-'} />
            <InfoRow label="Account Name" value={user.bankDetails?.accountName || '-'} />
            <InfoRow label="Account Number" value={user.bankDetails?.accountNumber || '-'} />
            <InfoRow label="IBAN" value={user.bankDetails?.iban || '-'} />
            <InfoRow label="SWIFT/BIC" value={user.bankDetails?.swiftBicCode || '-'} />
          </PortalCard>

          <PortalCard title="Emergency Contact" icon={<Phone className="h-5 w-5" />}>
            <InfoRow label="Contact Name" value={user.emergencyContact?.name || '-'} />
            <InfoRow label="Contact Phone" value={user.emergencyContact?.phone || '-'} />
          </PortalCard>
        </div>

        {/* Education */}
        <PortalCard title="Education" icon={<User className="h-5 w-5" />}>
          <InfoRow label="Highest Level" value={user.education?.highestLevel || '-'} />
          <InfoRow label="Degree / Major" value={user.education?.degreeMajor || '-'} />
          <InfoRow label="Institution" value={user.education?.institution || '-'} />
          <InfoRow label="Graduation Year" value={user.education?.graduationYear?.toString() || '-'} />
          <InfoRow label="License Numbers" value={user.education?.licenseNumbers?.join(', ') || '-'} />
        </PortalCard>

      </div>
    </Layout>
  );
};

export default Profile;

/* Reusable InfoRow component */
const InfoRow = ({ icon, label, value }: { icon?: JSX.Element; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-3 border-b border-border">
    {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);
