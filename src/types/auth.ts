export type LoginRequestBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type MeResponse = {
  user: string;
};
