import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Devis } from 'src/app/model/Devis.model';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-modifier-devis',
  templateUrl: './modifier-devis.component.html',
  styleUrls: ['./modifier-devis.component.css']
})
export class ModifierDevisComponent {

  devis: Devis;

  constructor(
    private dialogRef: MatDialogRef<ModifierDevisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Devis,
    private devisService: DevisService,
      private snackBar: MatSnackBar,

  ) {
    // Clone the received data to avoid modifying the original before saving
    this.devis = { ...data };
  }

  ngOnInit(): void {}

  onSave() {
    this.devisService.updateDevis(this.devis.id!,this.devis).subscribe(
      (response) => {
        this.snackBar.open('update success ! 🎉', 'close', {
          duration: 3000,
          panelClass: ['snackbar-succes']
        });
      },
      (error) => {
        this.snackBar.open('update failed ! 🎉', 'close', {
          duration: 3000,
          panelClass: ['snackbar-succes']
        });
        console.error('Error updating devis:', error);
      }
    );

    this.dialogRef.close(this.devis); // Return updated devis
  }

  onCancel() {
    this.dialogRef.close();
  }
}

