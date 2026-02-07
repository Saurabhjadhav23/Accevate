import apiClient from './apiClient';

export interface LoginResponse {
  userid: string;
}

export interface OtpResponse {
  token: string;
}

export interface DashboardResponse {
  status: boolean;
  msg: string;
  color: {
    dynamic_color: string;
  };
  user: {
    id: number;
    userid: string;
    name: string;
    mobile: string;
  };
  dashboard: {
    amount: {
      Total: number;
      Paid: number;
      due: number;
    };
  };
  student: {
    Boy: number;
    Girl: number;
  };
  carousel: string[];
}

export const loginApi = (userid: string, password: string) => {
  return apiClient.post<LoginResponse>('login.php', {
    userid,
    password,
  });
};

export const otpVerifyApi = (userid: string, otp: string) => {
  return apiClient.post<OtpResponse>('verify_otp.php', {
    userid,
    otp,
  });
};

export const dashboardApi = async (token: string) => {
  const res = await apiClient.get<DashboardResponse>('dashboard.php', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; 
};
