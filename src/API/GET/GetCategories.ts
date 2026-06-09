import { api } from "#lib/API";

export type Category = {
  id: number;
  name: string;
  createdAt: string;
};

type CategoriesResponse = {
  success: boolean;
  message: string;
  data: Category[];
};

// GET /categories — ambil semua kategori event
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.request<CategoriesResponse>("/categories", {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};
