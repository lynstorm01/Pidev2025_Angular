export interface Paiement {
    id: number;
    montant: number;
    datePaiement: string;
    method: string;
    statut: string; // "Payé", "En attente", "Non payé"
  }