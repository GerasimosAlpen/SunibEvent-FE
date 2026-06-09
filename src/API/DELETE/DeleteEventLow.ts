import { api } from "#lib/API";

export const deleteOrgEvent = async (_orgId: number, eventId: number): Promise<any> => {
  return api.request(`/events/${eventId}`, {
    method: "DELETE",
  });
};
