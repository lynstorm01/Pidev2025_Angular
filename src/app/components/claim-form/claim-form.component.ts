import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  // Définir idClaim comme optionnel dans l'interface (ou l'omettre pour une création)
  claim: Claim = { reclamationType: 'SERVICE', reclamationDate: '', description: '' };

  constructor(
    private claimsService: ClaimsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.claimsService.getClaimById(+id).subscribe(
        data => this.claim = data,
        error => console.error('Erreur lors du chargement de la réclamation', error)
      );
    }
  }

  // Méthode de création
  createClaim(): void {
    this.claimsService.createClaim(this.claim).subscribe(
      () => this.router.navigate(['/admin/claims']),
      error => console.error('Erreur lors de la création', error)
    );
  }

  // Méthode de mise à jour
  updateClaim(): void {
    if (this.claim.idClaim != null) {
      this.claimsService.updateClaim(this.claim.idClaim, this.claim).subscribe(
        () => this.router.navigate(['/admin/claims']),
        error => console.error('Erreur lors de la mise à jour', error)
      );
    }
  }
}
