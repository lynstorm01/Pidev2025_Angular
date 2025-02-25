// ClaimsListComponent.ts
import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claims-list',
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.css']
})
export class ClaimsListComponent implements OnInit {
  claims: Claim[] = [];
  stats: { [key: string]: number } = {};

  constructor(private claimsService: ClaimsService) { }

  ngOnInit(): void {
    this.loadClaims();
    this.loadStats();  // Appeler la méthode pour récupérer les statistiques
  }

  loadClaims(): void {
    this.claimsService.getClaims().subscribe(
      data => this.claims = data,
      error => console.error('Erreur lors du chargement des réclamations', error)
    );
  }
    // Charger les statistiques des réclamations
    loadStats(): void {
      this.claimsService.getClaims().subscribe(
        data => {
          this.claims = data;
          this.calculateStats();
        },
        error => console.error('Erreur lors du chargement des réclamations', error)
      );
    }
  
    // Calculer les statistiques par statut
    calculateStats(): void {
      this.stats = {
        'en attente': this.claims.filter(claim => claim.status === 'reclamation bien enregistre').length,
        'en traitement': this.claims.filter(claim => claim.status === 'en traint de traitement').length,
        'traité': this.claims.filter(claim => claim.status === 'traité').length
      };
    }

  deleteClaim(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette réclamation ?")) {
      this.claimsService.deleteClaim(id).subscribe(
        () => this.claims = this.claims.filter(claim => claim.idClaim !== id),
        error => console.error('Erreur lors de la suppression', error)
      );
    }
  }

  // Méthode pour confirmer la réclamation (passage à "en traint de traitement")
  confirmClaim(claim: Claim): void {
    claim.status = 'en traint de traitement';
    this.claimsService.updateClaim(claim.idClaim!, claim).subscribe(
      () => this.loadClaims(),
      error => console.error('Erreur lors de la mise à jour du statut', error)
    );
  }

  // Méthode pour marquer la réclamation comme traitée (passage à "traité")
  markClaimAsTreated(claim: Claim): void {
    claim.status = 'traité';
    this.claimsService.updateClaim(claim.idClaim!, claim).subscribe(
      () => this.loadClaims(),
      error => console.error('Erreur lors de la mise à jour du statut', error)
    );
  }
}
