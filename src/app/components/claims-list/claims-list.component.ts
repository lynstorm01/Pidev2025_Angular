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

  // Pagination variables
  page: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  constructor(private claimsService: ClaimsService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimsService.getClaims().subscribe(
      data => {
        this.claims = data;
        this.calculateStats();
        this.setupPagination();
      },
      error => console.error('Erreur lors du chargement des réclamations', error)
    );
  }

  calculateStats(): void {
    this.stats = {
      'en attente': this.claims.filter(claim => claim.status === 'ENREGISTREE').length,
      'en traitement': this.claims.filter(claim => claim.status === 'EN_COURS').length,
      'traité': this.claims.filter(claim => claim.status === 'TRAITEE').length
    };
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.claims.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

  confirmClaim(claim: Claim): void {
    claim.status = 'EN_COURS';
    this.claimsService.updateClaim(claim.idClaim!, claim).subscribe(
      () => {
        this.loadClaims();
      },
      error => console.error('Erreur lors de la mise à jour du statut', error)
    );
  }

  markClaimAsTreated(claim: Claim): void {
    claim.status = 'TRAITEE';
    this.claimsService.updateClaim(claim.idClaim!, claim).subscribe(
      () => {
        this.loadClaims();
      },
      error => console.error('Erreur lors de la mise à jour du statut', error)
    );
  }
}