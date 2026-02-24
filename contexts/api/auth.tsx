import api from "./api";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  status: "success" | "invalid_password" | "user_not_found" | "error" | string;
  token?: string;
  message?: string;
  staff_id?: number;
  SiteDepartmentProfileID?: string;
  user_name?: string;
};

export const loginApi = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth.php", credentials);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Unexpected error";
    return { status: "error", message };
  }
};
