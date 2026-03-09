import { setupInterceptors } from "./setupInterceptors";

export type InventoryManagementRequest = {
  productId: string;
  quantity: number;
};

export type InventoryRequest = {
  items: InventoryManagementRequest[];
};

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
});

export const createMovement = async (payload: InventoryRequest) => {
  const res = await api.post("/inventory/movements", payload);
  return res.data;
};
