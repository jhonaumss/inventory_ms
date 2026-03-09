import type { Product } from "../models/Products";
import { setupInterceptors } from "./setupInterceptors";

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
});

const PRODUCTS_ENDPOINT = "/inventory/products";

export const fetchProducts = async () => {
  const res = await api.get(PRODUCTS_ENDPOINT);
  return res.data;
};

export const createProduct = async (product: Product) => {
  const res = await api.post(PRODUCTS_ENDPOINT, product);
  return res.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`${PRODUCTS_ENDPOINT}/${id}`);
  return response.data;
};

export const updateProduct = async (id: string, product: Product) => {
  const res = await api.put(`${PRODUCTS_ENDPOINT}/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
};
