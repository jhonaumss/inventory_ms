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
  window.location.href = "/login";
});

export const createMovement = async (payload: InventoryRequest) => {
  const res = await api.post("/movements", payload);
  return res.data;
};
