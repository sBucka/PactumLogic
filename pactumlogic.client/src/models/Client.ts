export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
}