

import type { ChangePassword } from "../models/ChangePassword";
import type { User } from "../models/User";
import { setupInterceptors } from "./setupInterceptors";

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

export const getUsers = async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
};

export const createUser = async (data: User): Promise<User> => {
    const res = await api.post("/users", data);
    return res.data;
};

export const updateUser = async (id: string, data: User): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};

export const updateUserPassword = async (id: string, data:ChangePassword): Promise<void> => {
    await api.put(`/users/${id}/change-password`, data);
};
