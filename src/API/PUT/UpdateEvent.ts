import { api } from "#lib/API";
import type { CreateEventPayload } from "../POST/OrgCreateEvent";

export const updateOrgEvent = async (eventId: number | string, payload: CreateEventPayload): Promise<any> => {
  return api.request(`/events/${eventId}`, {
    method: "PUT",
    body: payload,
  });
};
