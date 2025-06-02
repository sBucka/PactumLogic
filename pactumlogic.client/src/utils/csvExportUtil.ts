import type { ClientWithContracts, Client } from "../models/Client";
import type { ContractWithDetails } from "../models/Contract";
import { ClientType } from "../models/Client";

export interface CSVColumn<T> {
  header: string;
  accessor: (item: T) => string | number;
}

export class CSVExportUtil {
  private static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("sk-SK");
  }

  // Exports contracts to a CSV format
  static exportContracts(contracts: ContractWithDetails[]): string[][] {
    const headers = [
      "Evidenčné číslo",
      "Inštitúcia",
      "Klient",
      "Email klienta",
      "Správca",
      "Email správcu",
      "Poradcovia",
      "Dátum uzavretia",
      "Dátum platnosti",
      "Dátum ukončenia",
      "Status",
    ];

    const rows = contracts.map((contract) => [
      contract.referenceNumber,
      contract.institution,
      `${contract.client.firstName} ${contract.client.lastName}`,
      contract.client.email,
      `${contract.administrator.firstName} ${contract.administrator.lastName}`,
      contract.administrator.email,
      contract.advisors
        .map((a: Client) => `${a.firstName} ${a.lastName}`)
        .join("; "),
      this.formatDate(contract.contractDate),
      this.formatDate(contract.validityDate),
      contract.terminationDate ? this.formatDate(contract.terminationDate) : "",
      contract.terminationDate ? "Ukončená" : "Aktívna",
    ]);

    return [headers, ...rows];
  }

  // Helper function to get type display text
  private static getClientTypeDisplay(type: ClientType): string {
    switch (type) {
      case ClientType.Client: return "Klient";
      case ClientType.Advisor: return "Poradca";
      case ClientType.Both: return "Klient & Poradca";
      default: return "Neznámy";
    }
  }

  // Exports clients to a CSV format - handles both Client and ClientWithContracts
  static exportClients(clients: (Client | ClientWithContracts)[]): string[][] {
    const headers = [
      "ID",
      "Meno",
      "Priezvisko",
      "Email",
      "Telefón",
      "Osobné ID",
      "Vek",
      "Typ",
      "Počet zmlúv",
      "Zmluvy",
    ];

    const rows = clients.map((client) => {
      // Safe access to contracts - check if it exists and is an array
      const contracts = 'contracts' in client && Array.isArray(client.contracts) ? client.contracts : [];
      
      return [
        String(client.id),
        client.firstName,
        client.lastName,
        client.email,
        client.phone,
        client.personalIdNumber,
        String(client.age),
        this.getClientTypeDisplay(client.type),
        String(contracts.length),
        contracts.length > 0 ? contracts.map((c) => c.referenceNumber).join("; ") : "",
      ];
    });
    
    return [headers, ...rows];
  }

  // Specific method for clients with contracts
  static exportClientsWithContracts(clients: ClientWithContracts[]): string[][] {
    return this.exportClients(clients);
  }

  // Specific method for advisors (basic Client data)
  static exportAdvisors(advisors: Client[]): string[][] {
    const headers = [
      "ID",
      "Meno",
      "Priezvisko",
      "Email",
      "Telefón",
      "Osobné ID",
      "Vek",
      "Typ",
    ];

    const rows = advisors.map((advisor) => [
      String(advisor.id),
      advisor.firstName,
      advisor.lastName,
      advisor.email,
      advisor.phone,
      advisor.personalIdNumber,
      String(advisor.age),
      this.getClientTypeDisplay(advisor.type),
    ]);
    
    return [headers, ...rows];
  }

  static generateFilename(prefix: string = "export"): string {
    const date = new Date().toISOString().split("T")[0];
    return `${prefix}-${date}.csv`;
  }

  static exportGeneric<T>(
    data: T[],
    columns: CSVColumn<T>[],
    filename?: string
  ): { data: string[][]; filename: string } {
    const headers = columns.map((col) => col.header);
    const rows = data.map((item) =>
      columns.map((col) => String(col.accessor(item)))
    );

    return {
      data: [headers, ...rows],
      filename: filename || this.generateFilename(),
    };
  }
}