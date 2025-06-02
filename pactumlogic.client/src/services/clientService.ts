import api from "./api";
import type {
  ClientWithContracts,
  ClientWithAllContracts,
  CreateClientRequest,
  Client,
  AdvisorWithContracts,
} from "../models/Client";
import { ClientType } from "../models/Client";

export const clientService = {
  getAll: async (): Promise<ClientWithContracts[]> => {
    const response = await api.get("/clients");
    return response.data;
  },

  getAllAdvisors: async (): Promise<Client[]> => {
    const response = await api.get("/clients/advisors");
    return response.data;
  },

  getAllAdvisorsWithContracts: async (): Promise<AdvisorWithContracts[]> => {
    const response = await api.get("/clients/advisors-with-contracts");
    return response.data;
  },

  getById: async (id: number): Promise<ClientWithAllContracts> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (client: CreateClientRequest): Promise<Client> => {
    const response = await api.post<Client>("/clients", client);
    return response.data;
  },

  update: async (id: number, client: CreateClientRequest): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, client);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
