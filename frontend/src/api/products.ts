import type { Product } from "../models/Products";
import { setupInterceptors } from "./setupInterceptors";

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});


export const fetchProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (product: Product) => {
  const res = await api.post("/products", product);
  return res.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id: string, product: Product) => {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
};
