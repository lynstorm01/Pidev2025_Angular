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

  constructor(private claimsService: ClaimsService) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimsService.getClaims().subscribe(
      data => this.claims = data,
      error => console.error('Erreur lors du chargement des réclamations', error)
    );
  }

  deleteClaim(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette réclamation ?")) {
      this.claimsService.deleteClaim(id).subscribe(
        () => this.claims = this.claims.filter(claim => claim.idClaim !== id),
        error => console.error('Erreur lors de la suppression', error)
      );
    }
  }
}
