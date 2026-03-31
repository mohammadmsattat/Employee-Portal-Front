// Mock data for Employee Portal

export const employeeData = {
  id: 'EMP001',
  name: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  nationality: 'American',
  dateOfBirth: '1990-05-15',
  avatar: '',
  department: 'Engineering',
  position: 'Senior Software Engineer',
  group: 'Development Team A',
  branch: 'New York Office',
  hireDate: '2020-03-01',
  contractStart: '2020-03-01',
  contractEnd: '2025-03-01',
};

export const scheduleData = {
  workingHours: '09:00 AM - 06:00 PM',
  isWorkingDay: true,
  today: new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
};

export const leaveBalanceData = {
  total: 21,
  used: 8,
  remaining: 13,
};

export const pendingRequestsData = {
  count: 2,
};

export const leaveTypes = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export const leaveRequestsData = [
  {
    id: 'LR001',
    type: 'Annual Leave',
    from: '2024-02-01',
    to: '2024-02-05',
    days: 5,
    status: 'approved' as const,
    reason: 'Family vacation',
    createdAt: '2024-01-15',
  },
  {
    id: 'LR002',
    type: 'Sick Leave',
    from: '2024-01-20',
    to: '2024-01-21',
    days: 2,
    status: 'approved' as const,
    reason: 'Medical appointment',
    createdAt: '2024-01-19',
  },
  {
    id: 'LR003',
    type: 'Personal Leave',
    from: '2024-03-10',
    to: '2024-03-10',
    days: 1,
    status: 'pending' as const,
    reason: 'Personal matters',
    createdAt: '2024-02-28',
  },
  {
    id: 'LR004',
    type: 'Annual Leave',
    from: '2024-04-15',
    to: '2024-04-19',
    days: 5,
    status: 'pending' as const,
    reason: 'Spring vacation',
    createdAt: '2024-03-01',
  },
  {
    id: 'LR005',
    type: 'Sick Leave',
    from: '2024-01-05',
    to: '2024-01-05',
    days: 1,
    status: 'rejected' as const,
    reason: 'Feeling unwell',
    createdAt: '2024-01-04',
  },
];

export const todayAttendanceData = {
  checkIn: '08:55 AM',
  checkOut: '06:10 PM',
  totalHours: '9h 15m',
  status: 'completed' as const,
};

export const attendanceHistoryData = [
  { date: '2024-01-22', checkIn: '08:55 AM', checkOut: '06:10 PM', totalHours: '9h 15m' },
  { date: '2024-01-21', checkIn: '09:02 AM', checkOut: '06:05 PM', totalHours: '9h 03m' },
  { date: '2024-01-20', checkIn: '08:48 AM', checkOut: '06:00 PM', totalHours: '9h 12m' },
  { date: '2024-01-19', checkIn: '08:30 AM', checkOut: '05:45 PM', totalHours: '9h 15m' },
  { date: '2024-01-18', checkIn: '09:10 AM', checkOut: '06:30 PM', totalHours: '9h 20m' },
  { date: '2024-01-17', checkIn: '08:45 AM', checkOut: '06:15 PM', totalHours: '9h 30m' },
  { date: '2024-01-16', checkIn: '08:58 AM', checkOut: '06:02 PM', totalHours: '9h 04m' },
  { date: '2024-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 00m' },
];
