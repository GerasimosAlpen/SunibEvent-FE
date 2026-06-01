import { api} from "#lib/API";

export const viewAllEvents = async () => {
  try {
    const response = await api.request<any>("/events", {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};