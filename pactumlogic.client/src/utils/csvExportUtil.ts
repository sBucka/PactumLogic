import type { ContractWithDetails } from "../models/Contract";

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
      "Účastníci",
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
      contract.advisors.map((a) => `${a.firstName} ${a.lastName}`).join("; "),
      this.formatDate(contract.contractDate),
      this.formatDate(contract.validityDate),
      contract.terminationDate ? this.formatDate(contract.terminationDate) : "",
      contract.terminationDate ? "Ukončená" : "Aktívna",
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
