import axios from "axios";
import { bookings, providers, serviceRequests, services } from "./mockData";

const api = axios.create({
  baseURL: "/mock-api",
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.defaults.adapter = async (config) => {
  await delay(450);
  let data = null;

  if (config.url === "/services") data = services;
  if (config.url?.startsWith("/providers?serviceId=")) {
    const serviceId = config.url.split("=")[1];
    data = providers.filter((provider) => provider.serviceId === serviceId);
  }
  if (config.url?.startsWith("/provider/")) {
    const providerId = config.url.replace("/provider/", "");
    data = providers.find((provider) => provider.id === providerId);
  }
  if (config.url === "/bookings") data = bookings;
  if (config.url === "/requests") data = serviceRequests;

  return {
    data,
    status: data ? 200 : 404,
    statusText: data ? "OK" : "Not Found",
    headers: {},
    config,
  };
};

export const fetchServices = () => api.get("/services");
export const fetchProvidersByService = (serviceId) => api.get(`/providers?serviceId=${serviceId}`);
export const fetchProviderById = (providerId) => api.get(`/provider/${providerId}`);
export const fetchBookings = () => api.get("/bookings");
export const fetchProviderRequests = () => api.get("/requests");
