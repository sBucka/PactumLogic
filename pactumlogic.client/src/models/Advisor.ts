export interface Advisor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
}

export interface CreateAdvisorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalIdNumber: string;
  age: number;
}