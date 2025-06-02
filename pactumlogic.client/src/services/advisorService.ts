import api from "./api";
import type { Advisor, CreateAdvisorRequest } from "../models/Advisor";

export const advisorService = {
  getAll: async (): Promise<Advisor[]> => {
    const response = await api.get("/advisors");
    return response.data;
  },

  getById: async (id: number): Promise<Advisor> => {
    const response = await api.get(`/advisors/${id}`);
    return response.data;
  },

  create: async (advisor: CreateAdvisorRequest): Promise<Advisor> => {
    const response = await api.post<Advisor>("/advisors", advisor);
    return response.data;
  },

  update: async (id: number, advisor: Partial<CreateAdvisorRequest>): Promise<Advisor> => {
    const response = await api.put<Advisor>(`/advisors/${id}`, advisor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/advisors/${id}`);
  },
};