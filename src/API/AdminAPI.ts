import { api } from "#lib/API";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ORGANIZATION' | 'ADMIN';
  lastLogin: string | null;
  createdAt: string;
};

export type AdminUsersResponse = {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
  };
};

export type AdminOrg = {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type AdminOrgsResponse = {
  success: boolean;
  message: string;
  data: {
    orgs: AdminOrg[];
    total: number;
    page: number;
    limit: number;
  };
};

export type AdminEvent = {
  id: number;
  title: string;
  description: string;
  datetime: string;
  endtime: string;
  location: string;
  quota: number;
  status: 'ONLINE' | 'CLOSED' | 'ARCHIVE';
  registrationLink: string | null;
  imageUrl: string | null;
  category: {
    id: number;
    name: string;
  };
  organization: {
    id: number;
    name: string;
  };
};

export type AdminEventsResponse = {
  success: boolean;
  message: string;
  data: {
    events: AdminEvent[];
    total: number;
    page: number;
    limit: number;
  };
};

export const getAdminUsers = async (page: number, search?: string): Promise<AdminUsersResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: '10',
    ...(search && { search }),
  });
  return api.request<AdminUsersResponse>(`/admin/users?${query.toString()}`, {
    method: "GET",
  });
};

export const deleteAdminUser = async (id: number): Promise<any> => {
  return api.request(`/admin/users/${id}`, {
    method: "DELETE",
  });
};

export const getAdminOrgs = async (page: number, search?: string): Promise<AdminOrgsResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: '10',
    ...(search && { search }),
  });
  return api.request<AdminOrgsResponse>(`/admin/orgs?${query.toString()}`, {
    method: "GET",
  });
};

export const verifyAdminOrg = async (id: number, isVerified: boolean): Promise<any> => {
  return api.request(`/admin/orgs/${id}/verify`, {
    method: "PATCH",
    body: { isVerified },
  });
};

export const deleteAdminOrg = async (id: number): Promise<any> => {
  return api.request(`/admin/orgs/${id}`, {
    method: "DELETE",
  });
};

export const createAdminOrg = async (payload: any): Promise<any> => {
  return api.request(`/admin/orgs`, {
    method: "POST",
    body: payload,
  });
};

export const getAdminEvents = async (page: number, search?: string): Promise<AdminEventsResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: '10',
    ...(search && { search }),
  });
  return api.request<AdminEventsResponse>(`/admin/events?${query.toString()}`, {
    method: "GET",
  });
};

export const deleteAdminEvent = async (id: number): Promise<any> => {
  return api.request(`/admin/events/${id}`, {
    method: "DELETE",
  });
};
