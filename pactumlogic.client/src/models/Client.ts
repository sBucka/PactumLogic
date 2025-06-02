import type { ContractSummary } from "./Contract";

export type ClientType = 1 | 2 | 3;

export const ClientType = {
  Client: 1 as ClientType,
  Advisor: 2 as ClientType,
  Both: 3 as ClientType
};

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
  type: ClientType;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
  type: ClientType;
}

export interface ClientWithContracts extends Client {
  contracts: ContractSummary[]; // Contracts as client
}

// Enhanced interface for detailed client view
export interface ClientWithAllContracts extends Client {
  clientContracts: ContractSummary[];      // Contracts where they are the client
  administratorContracts: ContractSummary[]; // Contracts where they are the administrator
  advisorContracts: ContractSummary[];     // Contracts where they are an advisor
}

export interface AdvisorWithContracts extends Client {
  contracts: ContractSummary[]; 
}

// Type aliases for backward compatibility
export type Advisor = Client;
export type CreateAdvisorRequest = CreateClientRequest;