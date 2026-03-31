export type FingerprintType = "Check-in" | "Check-out";

export interface AttendanceFingerprint {
  _id: string;
  name: string;
  userID: string;
  email: string;
  Time: string;
  date: string;
  type: FingerprintType;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
