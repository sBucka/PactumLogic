import { contractService } from "../services/contractService";
import { clientService } from "../services/clientService";
import { advisorService } from "../services/advisorService";

const services = {
  contract: contractService,
  client: clientService,
  advisor: advisorService,
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
