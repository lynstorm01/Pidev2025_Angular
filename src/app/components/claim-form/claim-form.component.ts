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
  claim: Claim = { reclamationType: 'SERVICE', reclamationDate: '', description: '', status: 'ENREGISTREE' };
  today: string = '';
  userPhoneNumber: string = '+21693323188'; // Remplacez par le numéro de l'utilisateur

  constructor(
    private claimsService: ClaimsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Format de la date : YYYY-MM-DD
    this.today = new Date().toISOString().split('T')[0];
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.claimsService.getClaimById(+id).subscribe(
        data => this.claim = data,
        error => console.error('Erreur lors du chargement de la réclamation', error)
      );
    }
  }

  createClaim(): void {
    this.claim.status = 'ENREGISTREE'; // Update with enum value
    this.claimsService.createClaim(this.claim, this.userPhoneNumber).subscribe(
      () => this.router.navigate(['/home']),
      (error) => console.error('Error during claim creation', error)
    );
  }
  
  updateClaim(): void {
    if (this.claim.idClaim != null) {
      this.claimsService.updateClaim(this.claim.idClaim, this.claim).subscribe(
        () => this.router.navigate(['/admin/claims']),
        error => console.error('Error during claim update', error)
      );
    }
  }
}
