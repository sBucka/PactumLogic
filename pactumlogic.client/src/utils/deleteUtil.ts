import { contractService } from "../services/contractService";
import { clientService } from "../services/clientService";

const services = {
  contract: contractService,
  client: clientService,
  advisor: clientService, 
};

export type EntityType = keyof typeof services;

export const deleteEntity = async (
  type: EntityType,
  id: number,
  onSuccess?: () => void,
  onError?: (error: any) => void
): Promise<boolean> => {
  try {
    await services[type].delete(id);
    onSuccess?.();
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
};