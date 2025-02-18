import { Component, OnInit } from '@angular/core';
import { OffreService } from '../offre.service';

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.css']
})
export class OffresComponent implements OnInit {

  offres: any[] = []; // Liste des offres partenaires
  newOffre: any = {}; // Stocke les données du formulaire d'ajout
  editMode = false; // Indique si on est en mode modification
  selectedOffre: any = {}; // Stocke l'offre en cours d'édition

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadOffres(); // Charger les offres dès l'initialisation
  }

  // Récupérer toutes les offres
  loadOffres() {
    this.offreService.getAllOffres().subscribe(data => {
      this.offres = data;
    });
  }

  // Ajouter une nouvelle offre
  addOffre() {
    this.offreService.createOffre(this.newOffre).subscribe(() => {
      this.loadOffres(); // Recharger la liste
      this.newOffre = {}; // Réinitialiser le formulaire
    });
  }

  // Passer en mode modification d'une offre
  editOffre(offre: any) {
    this.selectedOffre = { ...offre }; // Cloner l'offre sélectionnée
    this.editMode = true;
  }

  // Mettre à jour une offre
  updateOffre() {
    this.offreService.updateOffre(this.selectedOffre.id, this.selectedOffre).subscribe(() => {
      this.loadOffres(); // Recharger la liste
      this.editMode = false;
      this.selectedOffre = {}; // Réinitialiser le formulaire
    });
  }

  // Annuler l'édition
  cancelEdit() {
    this.editMode = false;
    this.selectedOffre = {};
  }

  // Supprimer une offre
  deleteOffre(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette offre ?')) {
      this.offreService.deleteOffre(id).subscribe(() => {
        this.loadOffres(); // Recharger la liste après suppression
      });
    }
  }
}
