export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  nationality?: string;
  maritalStatus?: string;
  hireDate?: string;
  salary?: number;
  employmentStatus?: boolean;
  profileImage?: string;
  attendanceType?: string;
  groupId?: {
    offDays?: string[];
    fixedAttendance?: {
      startTime: string;
      endTime: string;
    };
  };
}
