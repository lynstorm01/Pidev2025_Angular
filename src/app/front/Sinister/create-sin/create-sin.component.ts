import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { SinistersService } from 'src/app/services/sinisters.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-create-sin',
  templateUrl: './create-sin.component.html',
  styleUrls: ['./create-sin.component.css']
})
export class CreateSinComponent implements AfterViewInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  selectedFile: File | null = null;
  minDate: Date;
  maxDate: Date;
  map: any;
  marker: any;
  selectedLocation: string = '';
  mapInitialized: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private claimService: SinistersService
  ) {
    const currentDate = new Date();
    this.maxDate = currentDate;
    this.minDate = this.subtractMonths(currentDate, 3);

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

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([30.3753, 69.3451], 5);  // Default location (Pakistan)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      const locationString = `${latitude}, ${longitude}`;
      this.fourthFormGroup.get('location')?.setValue(locationString);

      // Remove existing marker before adding a new one
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([latitude, longitude]).addTo(this.map);
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.fifthFormGroup.get('document')?.setValue(this.selectedFile.name);
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

  onSubmit() {
    if (this.allFormsValid()) {
      const claimData = {
        typeAssurance: this.firstFormGroup.value.typeAssurance,
        description: this.secondFormGroup.value.description,
        incidentDate: this.thirdFormGroup.value.incidentDate,
        location: this.selectedLocation
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

  private subtractMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const originalDay = d.getDate();
    d.setMonth(d.getMonth() - months);

    if (d.getDate() !== originalDay) {
      d.setDate(0);
    }
    return d;
  }
}
