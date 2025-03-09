// src/app/components/claim-form/claim-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../models/claim.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  // Initialisation de la réclamation avec des valeurs par défaut et userId fixé à 5
  claim: Claim = { 
    reclamationType: 'SERVICE', 
    reclamationDate: '', 
    description: '', 
    status: 'ENREGISTREE',
    userId: 5
  };
  today: string = '';
  userPhoneNumber: string = '+21693323188'; // Numéro de téléphone fixe (à adapter si besoin)

  constructor(
    private claimsService: ClaimsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Définit la date d'aujourd'hui au format "YYYY-MM-DD"
    this.today = new Date().toISOString().split('T')[0];

    // Affectation manuelle de l'ID utilisateur 
    this.claim.userId = 5;

    // Si un ID est présent dans l'URL, charger la réclamation pour édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.claimsService.getClaimById(+id).subscribe(
        (data: Claim) => {
          this.claim = data;
        },
        (error: any) => {
          console.error('Erreur lors du chargement de la réclamation', error);
        }
      );
    }
  }

  createClaim(): void {
    // Avant de créer la réclamation, affecter l'objet User partiel basé sur userId
    if (this.claim.userId) {
      this.claim.user = new User(this.claim.userId);
    }
    // Assurez-vous que le statut est correctement défini
    this.claim.status = 'ENREGISTREE';
    this.claimsService.createClaim(this.claim, this.userPhoneNumber).subscribe(
      () => this.router.navigate(['/calendar']),
      (error: any) => {
        console.error('Error during claim creation', error);
        alert('Une erreur est survenue lors de la création de la réclamation.');
      }
    );
  }

  updateClaim(): void {
    if (this.claim.idClaim != null) {
      // Affecter l'objet User partiel si nécessaire
      if (this.claim.userId) {
        this.claim.user = new User(this.claim.userId);
      }
      this.claimsService.updateClaim(this.claim.idClaim, this.claim).subscribe(
        () => this.router.navigate(['/admin/claims']),
        (error: any) => {
          console.error('Error during claim update', error);
          alert('Une erreur est survenue lors de la mise à jour de la réclamation.');
        }
      );
    }
  }
}
