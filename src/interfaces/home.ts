export interface IUser {
  _id: string;
  profileImage :string;
  fullName: string;
  email: string;
department?: string;
position?: string;
  groupId?: {
    _id?: string;
    groupName?: string;

    leavePolicy?: {
      _id?: string;
      policyName?: string;
    };

    policiesSnapshot?: {
      leavePolicy?: {
        _id?: string;
        policyName?: string;
      };
    };
  };

  payrollGroupId?: {
    policiesSnapshot?: {
      leavePolicy?: {
        _id?: string;
        policyName?: string;
      };
    };
  };
}