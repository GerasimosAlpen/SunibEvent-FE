import { api } from "#lib/API";

// Tipe data satu post (sesuaikan dengan response backend lo)
export type OrgPost = {
  id: number | string;
  title: string;
  category: string;
  date: string;
  status: "Live" | "Draft" | "Completed";
  views: number;
  registrations: number;
};

// Tipe response keseluruhan (sesuaikan dengan format response backend lo)
type OrgPostsResponse = {
  data: OrgPost[];
  total: number;
  page: number;
};

// GET /organizer/posts — ambil semua post milik organizer
export const getOrganizerPosts = async (page = 1) => {
  try {
    const response = await api.request<OrgPostsResponse>(`/org/1/events?page=${page}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch organizer posts:", error);
    throw error;
  }
};
