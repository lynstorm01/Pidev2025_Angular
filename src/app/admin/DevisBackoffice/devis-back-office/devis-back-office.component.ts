import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModifierDevisComponent } from 'src/app/front/Devis/modifier-devis/modifier-devis.component';
import { Devis } from 'src/app/model/Devis.model';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-devis-back-office',
  templateUrl: './devis-back-office.component.html',
  styleUrls: ['./devis-back-office.component.css']
})
export class DevisBackOfficeComponent {


  countPending: number = 0;
  countAccepted: number = 0;
  countRejected: number = 0;
  devisList: Devis[] = [];
  searchText: string = '';
  page: number = 1;


  constructor(private devisService: DevisService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.getDevisList();
  }

  getDevisList(): void {
    this.devisService.getAllDevis().subscribe(
      (data) => {
        this.devisList = data;
        this.updateStatistics();
    
      },
      (error) => {
        console.error("Erreur lors de la récupération des devis :", error);
      }
    );
  }
  updateStatistics(): void {
    this.countPending = this.devisList.filter(devis => devis.statut === 'EN_ATTENTE').length;
    this.countAccepted = this.devisList.filter(devis => devis.statut === 'ACCEPTÉ').length;
    this.countRejected = this.devisList.filter(devis => devis.statut === 'REJETÉ').length;
  }

  deleteDevis(id: any): void {
  
      this.devisService.deleteDevis(id).subscribe(() => {
        this.devisList = this.devisList.filter(devis => devis.id !== id);
      });
    
  }

  openModifierDialog(devis: any) {
    const dialogRef = this.dialog.open(ModifierDevisComponent, {
      width: '500px',
      data: devis 
    });

    dialogRef.afterClosed().subscribe(updatedDevis => {
      if (updatedDevis) {
        // Find and update the devis in the list
        const index = this.devisList.findIndex(d => d.nomClient === devis.nomClient);
        if (index !== -1) {
          this.devisList[index] = updatedDevis;
        }
      }
    });
  }

  accepterDevis(devis: Devis): void {
    console.log(devis)
    if (!devis.signature) { // Vérifie si la signature est absente
      this.snackBar.open("Vous devez signer le devis avant de l'accepter.", "Fermer", {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }
  
    devis.statut = "ACCEPTÉ"; // Met à jour le statut dans l'UI
  
    this.devisService.updateDevis(devis.id, devis).subscribe(
      (updatedDevis) => {
        console.log("Devis accepté avec succès :", updatedDevis);
      },
      (error) => {
        console.error("Erreur lors de l'acceptation du devis :", error);
      }
    );
  }
  

}
