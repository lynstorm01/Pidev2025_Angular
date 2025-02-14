import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Devis } from 'src/app/model/Devis.model';

import { PaiementDialogComponent } from '../paiement-dialog/paiement-dialog.component';
import { PaiementService } from 'src/app/services/paiement.service';
import { DevisService } from 'src/app/services/devis.service';
import { ModifierDevisComponent } from '../modifier-devis/modifier-devis.component';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';


@Component({
  selector: 'app-devis-list',
  templateUrl: './devis-list.component.html',
  styleUrls: ['./devis-list.component.css']
})
export class DevisListComponent implements OnInit,AfterViewInit{

  devisList: Devis[] = [];
  searchText: string = '';
  page: number = 1;


  signature: string = '';
  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent;

  signaturePadOptions = {

    canvasWidth: 192,
    canvasHeight: 96
  };
  ngAfterViewInit(): void {
    this.signaturePad.clear(); // Initialiser le pad de signature
  }

  constructor(private devisService: DevisService,
    public dialog: MatDialog,
    private paiementService : PaiementService
  ) {}

  ngOnInit(): void {
    this.getDevisList();
  }
  drawStart(event: MouseEvent | Touch): void {
    console.log('Début du dessin', event);
  }

  drawComplete(event: MouseEvent | Touch): void {
    console.log('Fin du dessin', event);
  }

  clearSignature(): void {
    this.signaturePad.clear();
    setTimeout(() => {

      
      this.signaturePad.set('minWidth', 1);
      this.signaturePad.set('min', 1);
    
      this.signaturePad.set('canvasHeight', 96);
    }, 0);
    
    
  }

  saveSignature(devisId: number): void {
    if (this.signaturePad.isEmpty()) {
      alert("Veuillez signer avant d'enregistrer.");
      return;
    }
  
    // Convertir la signature en Base64
    const signatureImage = this.signaturePad.toDataURL("image/png");
  
    // Convertir Base64 en Blob
    const byteCharacters = atob(signatureImage.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: "image/png" });
  
    // Ajouter la signature en tant que fichier dans FormData
    const formData = new FormData();
    formData.append("signature", file, "signature.png");
  
    this.devisService.signerDevis(devisId, formData).subscribe(
      (response) => {
        console.log("Devis signé avec succès!", response);
        this.getDevisList();
      },
      (error) => {
        console.error("Erreur lors de la signature du devis:", error);
        alert("Erreur lors de la signature du devis.");
      }
    );
  }
  
  





  getDevisList(): void {
    this.devisService.getAllDevis().subscribe(
      (data) => {
        this.devisList = data;
    
      },
      (error) => {
        console.error("Erreur lors de la récupération des devis :", error);
      }
    );
  }



  editDevis(devis: Devis): void {
    console.log("Modification du devis :", devis);
    // Redirection ou affichage du formulaire de modification
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

  openPaiementDialog(devis: Devis) {
    if (!devis.id) {
      console.error("L'ID du devis est indéfini !");
      return;
    }
  
    this.devisService.getDevisById(devis.id).subscribe(devisComplet => {
      console.log("Ouverture du popup de paiement pour le devis ID:", devis.id);
      this.paiementService.getPaiementsByDevis(devisComplet.id).subscribe(paiements => {
        const dialogRef = this.dialog.open(PaiementDialogComponent, {
          data: { devis: devisComplet, paiements },
          width: '600px',
          height: 'auto',
          panelClass: 'custom-dialog-container'
        });
  
        dialogRef.afterClosed().subscribe(() => this.getDevisList());
      });
    });
  }




}
