import type { Client } from "./Client";

export interface Contract {
  id: number;
  referenceNumber: string;
  institution: string;
  clientId: number;
  administratorId: number;
  contractDate: string; // ISO date string
  validityDate: string; // ISO date string
  terminationDate?: string; // ISO date string or null

  // Optional expanded objects for detail views
  client?: Client;
  administrator?: Client; 
  advisors?: Client[]; 
}

export interface ContractWithDetails extends Contract {
  client: Client;
  administrator: Client; 
  advisors: Client[]; 
}

export interface CreateContractRequest {
  referenceNumber: string;
  institution: string;
  clientEmail: string;
  administratorEmail: string;
  advisorEmails: string[];
  contractDate: string;
  validityDate: string;
  terminationDate?: string;
}

export interface ContractSummary {
  id: number;
  referenceNumber: string;
  institution: string;
  contractDate: string;
  validityDate: string;
  terminationDate?: string;
}