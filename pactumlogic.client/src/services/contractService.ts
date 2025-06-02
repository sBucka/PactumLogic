import api from "./api";
import type { ContractWithDetails, CreateContractRequest } from "../models/Contract";

export const contractService = {
  getAll: async (): Promise<ContractWithDetails[]> => {
    const response = await api.get("/contracts");
    return response.data;
  },

  getById: async (id: number): Promise<ContractWithDetails> => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  getRecentContracts: async (
    limit: number = 10
  ): Promise<ContractWithDetails[]> => {
    const response = await api.get(`/contracts/recent?limit=${limit}`);
    return response.data;
  },

  create: async (contract: CreateContractRequest): Promise<ContractWithDetails> => {
    const response = await api.post<ContractWithDetails>("/contracts", contract);
    return response.data;
  },

  update: async (id: number, contract: CreateContractRequest): Promise<ContractWithDetails> => {
    const response = await api.put<ContractWithDetails>(`/contracts/${id}`, contract);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/contracts/${id}`);
  },

  getStats: async () => {
    const response = await api.get("/contracts/stats");
    return response.data;
  },
};