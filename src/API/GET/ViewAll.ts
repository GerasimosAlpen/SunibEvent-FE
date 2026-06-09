import { api } from "#lib/API";

export type EventFilterParams = {
  search?: string;
  categoryId?: number;
  status?: "ONLINE" | "CLOSED" | "ARCHIVE";
  page?: number;
  limit?: number;
};

export const viewAllEvents = async (params: EventFilterParams = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.categoryId) query.append("categoryId", String(params.categoryId));
    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const url = `/events${queryString ? `?${queryString}` : ""}`;

    const response = await api.request<any>(url, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};