import { api } from "#lib/API";

export const viewEventById = async (id: string) => {
  try {
    const response = await api.request<any>(`/events/${id}`, {
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};