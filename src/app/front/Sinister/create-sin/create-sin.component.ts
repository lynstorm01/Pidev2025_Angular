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
  minDate: Date;
  maxDate: Date;
  fourthFormGroup: FormGroup;
  isDatePickerOpen = false;
fifthFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private claimService: SinistersService
  ) {
    const currentDate = new Date();
    this.maxDate = currentDate;
    this.minDate = this.subtractMonths(currentDate, 3);

    // Initialize the form groups
    this.firstFormGroup = this._formBuilder.group({
      typeAssurance: ['', Validators.required]
    });
  
    this.secondFormGroup = this._formBuilder.group({
      description: ['', Validators.required]
    });
  
    this.thirdFormGroup = this._formBuilder.group({
      incidentDate: ['', Validators.required]
    });
  
    this.fourthFormGroup = this._formBuilder.group({
      location: ['', Validators.required]
    });
  
    this.fifthFormGroup = this._formBuilder.group({
      document: ['', Validators.required]
    });
  }
  private subtractMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const originalDay = d.getDate();
    d.setMonth(d.getMonth() - months);
    
    // Handle cases where the target month has fewer days
    if (d.getDate() !== originalDay) {
      d.setDate(0); // Set to last day of previous month
    }
    return d;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]; // Store the selected file
      if (this.selectedFile) { // Add a null check
        this.fifthFormGroup.get('document')?.setValue(this.selectedFile.name); // Update the form control with the file name
      }
    }
  }
  private allFormsValid(): boolean {
    return this.firstFormGroup.valid &&
           this.secondFormGroup.valid &&
           this.thirdFormGroup.valid &&
           this.fourthFormGroup.valid &&
           this.fifthFormGroup.valid &&
           !!this.selectedFile;
  }
    // Add this method to open the datepicker when the step is activated
    onStepChange(event: any) {
      if (event.selectedIndex === 2) { // Index of the "Date of the incident" step
        this.isDatePickerOpen = true; // Open the datepicker
      } else {
        this.isDatePickerOpen = false; // Close the datepicker for other steps
      }
    }

  onSubmit() {
    if (this.allFormsValid()) {
      const claimData = {
        typeAssurance: this.firstFormGroup.value.typeAssurance,
        description: this.secondFormGroup.value.description, // Changed from firstFormGroup
        incidentDate: this.thirdFormGroup.value.incidentDate,
        location: this.fourthFormGroup.value.location // Changed from secondFormGroup
      };
  
      this.claimService.createClaim(claimData, this.selectedFile!).subscribe({
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