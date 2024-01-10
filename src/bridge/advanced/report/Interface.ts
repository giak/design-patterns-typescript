// Interface pour les formatteurs de rapport
export interface ReportFormatterInterface {
  formatReport(data: ReportDataInterface, options?: FormatOptionsInterface): string;
}

// Interface pour les livreurs de rapport
export interface ReportDelivererInterface {
  deliverReport(reportContent: string, metaData: DeliveryMetaDataInterface): void;
}

// Type de base pour les données de rapport
export interface ReportDataInterface {
  title: string;
  content?: unknown; // Contenu générique, peut être spécifié plus précisément dans les sous-types
  financialDetails?: object;
  salesDetails?: object;
}

// Sous-type pour les données de rapport financier
export interface FinancialReportDataInterface extends ReportDataInterface {
  financialDetails: FinancialDetailsInterface;
}

// Sous-type pour les données de rapport de vente
export interface SalesReportDataInterface extends ReportDataInterface {
  salesDetails: SalesDetailsInterface;
}

// ... Autres sous-types de ReportData pour différents types de rapports

// Structure pour les détails financiers (exemple)
export interface FinancialDetailsInterface {
  revenue: number;
  expenses: number;
  // ... Autres champs pertinents pour les données financières
}

// Structure pour les détails de vente (exemple)
export interface SalesDetailsInterface {
  totalSales: number;
  topPerformingProducts: ProductInterface[];
  // ... Autres champs pertinents pour les données de vente
}

// Structure pour un produit (exemple dans le contexte des rapports de vente)
export interface ProductInterface {
  id: string;
  name: string;
  salesFigures: number;
}

// Options de formatage pour les rapports
export interface FormatOptionsInterface {
  header: boolean; // Inclure un en-tête ou non
  footer: boolean; // Inclure un pied de page ou non
  // ... Autres options de formatage spécifiques
}

// Métadonnées pour la livraison de rapport
export interface DeliveryMetaDataInterface {
  recipient: string; // Destinataire du rapport
  deliveryMethod: string; // Méthode de livraison (email, FTP, cloud, etc.)
  // ... Autres métadonnées pertinentes pour la livraison
}
