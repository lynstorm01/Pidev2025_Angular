export interface Claim {
  idClaim?: number;
  reclamationType: 'SERVICE' | 'QUALITY' | 'DELAY' | 'OTHER';
  reclamationDate: string;
  description: string;
  status?: 'ENREGISTREE' | 'EN_COURS' | 'TRAITEE';
}
