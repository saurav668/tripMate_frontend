import { api } from "../../services/api";

export const getProfileApi = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getMyTripsApi = async () => {
  const response = await api.get("/trips/my-trips");
  return response.data;
};

export const getUnreadNotificationCountApi = async () => {
  const response = await api.get("/notifications/unread/count");
  return response.data;
};