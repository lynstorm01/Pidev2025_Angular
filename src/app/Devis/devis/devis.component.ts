import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Devis } from 'src/app/model/Devis.model';
import { DevisService } from 'src/app/service/devis.service';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent {

  devisForm!: FormGroup;
  devisList: Devis[] = [];
  selectedDevis: Devis | null = null;

  constructor(
     private formBuilder: FormBuilder,
     private devisService: DevisService
  ) { 
      this.devisForm = this.formBuilder.group({
    nomClient: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    typeAssurance: ['', Validators.required],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    statut: ['', Validators.required],
  });}

  ngOnInit(): void {
     this.getDevisList();
    
 
  }

  // Get all devis
  getDevisList(): void {
    this.devisService.getAllDevis().subscribe(data => {
      this.devisList = data;
    });
  }

  // Select a devis to update
  editDevis(devis: Devis): void {
    this.selectedDevis = devis;
    this.devisForm.patchValue(devis);
  }

  // Create a new devis
  createDevis(): void {
    if (this.devisForm.valid) {
      this.devisService.createDevis(this.devisForm.value).subscribe(
        (response) => {
           this.getDevisList();  // Refresh the list
          this.devisForm.reset();  // Clear the form
        },
        (error) => {
          console.error('Error creating devis:', error);
        }
      );
    }
  }

  // Update an existing devis
  updateDevis(): void {
    if (this.selectedDevis && this.devisForm.valid) {
      this.devisService.updateDevis(this.selectedDevis.id!, this.devisForm.value).subscribe(
        (response) => {
          this.getDevisList();  // Refresh the list
          this.selectedDevis = null;  // Reset selected devis
          this.devisForm.reset();  // Clear the form
        },
        (error) => {
          console.error('Error updating devis:', error);
        }
      );
    }
  }


  deleteDevis(id: any): void {
    if (confirm('Are you sure you want to delete this devis?')) {
      this.devisService.deleteDevis(id).subscribe(
        () => {
          this.getDevisList();  // Refresh the list
        },
        (error) => {
          console.error('Error deleting devis:', error);
        }
      );
    }
  }

  // Submit the form (either create or update)
   onSubmit(): void {
    if (this.selectedDevis) {
      this.updateDevis();
    } else {
       this.createDevis();
    }
  }
}
