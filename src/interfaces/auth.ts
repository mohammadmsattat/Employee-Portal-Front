export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  data: {
    _id: string;
    name: string;
    email: string;
    companyId: string;
    groupId: any;
    [key: string]: any;
  };
}
