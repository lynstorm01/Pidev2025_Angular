import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SinistersService } from 'src/app/services/sinisters.service';


@Component({
  selector: 'app-create-sin',
  templateUrl: './create-sin.component.html',
  styleUrls: ['./create-sin.component.css']
})
export class CreateSinComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup; // Declare the form group
  thirdFormGroup: FormGroup;
  selectedFile: File | null = null; // Store the selected file

  constructor(
    private _formBuilder: FormBuilder,
    private claimService: SinistersService
  ) {
    // Initialize the form groups
    this.firstFormGroup = this._formBuilder.group({
      typeAssurance: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      location: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      document: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]; // Store the selected file
      if (this.selectedFile) { // Add a null check
        this.thirdFormGroup.get('document')?.setValue(this.selectedFile.name); // Update the form control with the file name
      }
    }
  }

  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.selectedFile) {
      const claimData = {
        typeAssurance: this.firstFormGroup.value.typeAssurance,
        description: this.firstFormGroup.value.description,
        location: this.secondFormGroup.value.location
      };

      this.claimService.createClaim(claimData, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Claim created successfully', response);
          alert('Claim submitted successfully!');
        },
        error: (error) => {
          console.error('Error creating claim', error);
          alert('Error submitting claim. Please try again.');
        }
      });
    } else {
      alert('Please fill out all fields and select a file.');
    }
  }
}