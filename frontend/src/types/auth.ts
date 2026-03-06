export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  role: "ROLE_ADMIN" | "ROLE_SALES" | "ROLE_MANAGER";
}

export interface AuthResponse {
  token: string;
  mustChangePassword: boolean;
  enabled: boolean;
  id: string;
}
