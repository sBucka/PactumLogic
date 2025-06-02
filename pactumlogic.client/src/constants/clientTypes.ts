import { ClientType } from "../models/Client";


export const CLIENT_TYPE_LABELS = {
  [ClientType.Client]: "Klient",
  [ClientType.Advisor]: "Poradca", 
  [ClientType.Both]: "Klient aj Poradca"
} as const;