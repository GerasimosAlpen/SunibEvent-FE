import { api } from "#lib/API";

export type CreateEventPayload = {
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  capacity: number;
  image_url: string;
  registrationLink?: string;
  status?: string;
};

export const createOrgEvent = async (_orgId: number, payload: any): Promise<any> => {
  return api.request("/events", {
    method: "POST",
    body: payload,
  });
};
