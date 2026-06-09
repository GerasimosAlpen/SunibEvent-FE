import { api } from "#lib/API";

export type OrgEvent = {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registered: number;
  capacity: number;
};

export type OrgEventsResponse = {
  success: boolean;
  message: string;
  data: {
    events: any[];
    total: number;
    page: number;
    limit: number;
  };
};

export const getOrgEvents = async (_orgId: number, page: number): Promise<OrgEventsResponse> => {
  return api.request<OrgEventsResponse>(`/org/events?page=${page}`, {
    method: "GET",
  });
};
