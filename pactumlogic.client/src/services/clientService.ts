import api from "./api";
import type { Client, CreateClientRequest } from "../models/Client";

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get("/clients");
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (client: CreateClientRequest): Promise<Client> => {
    const response = await api.post<Client>("/clients", client);
    return response.data;
  },

  update: async (id: number, client: Partial<CreateClientRequest>): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, client);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};