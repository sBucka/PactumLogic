import api from "./api";
import { Client } from "../models/Client";

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get<Client[]>("/clients");
  return response.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
};

export const createClient = async (
  client: Omit<Client, "id">
): Promise<Client> => {
  const response = await api.post<Client>("/clients", client);
  return response.data;
};

export const updateClient = async (
  id: number,
  client: Client
): Promise<void> => {
  await api.put(`/clients/${id}`, client);
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}`);
};
