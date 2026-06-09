import { api } from "#lib/API";

export type Reminder = {
  id: number;
  userId: number;
  eventId: number;
  isH7DaysSent: boolean;
  isH3DaysSent: boolean;
  isH1DaySent: boolean;
  createdAt: string;
  event: {
    id: number;
    title: string;
    description: string;
    datetime: string;
    endtime: string;
    location: string;
    quota: number;
    status: string;
    registrationLink: string | null;
    imageUrl: string | null;
    organization: {
      name: string;
      logoUrl: string | null;
    };
    category?: {
      id: number;
      name: string;
    } | null;
  };
};

export type ListRemindersResponse = {
  success: boolean;
  message: string;
  data: Reminder[];
};

export type SetReminderResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    userId: number;
    eventId: number;
  };
};

export const getReminders = async (): Promise<ListRemindersResponse> => {
  return api.request<ListRemindersResponse>("/reminders", {
    method: "GET",
  });
};

export const setReminder = async (eventId: number): Promise<SetReminderResponse> => {
  return api.request<SetReminderResponse>(`/reminders/${eventId}`, {
    method: "POST",
  });
};

export const removeReminder = async (eventId: number): Promise<any> => {
  return api.request<any>(`/reminders/${eventId}`, {
    method: "DELETE",
  });
};
