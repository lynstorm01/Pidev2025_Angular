import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sinisterupdate',
 
  templateUrl: './sinisterupdate.component.html',
  styleUrls: ['./sinisterupdate.component.css'],
// ✅ Use ReactiveFormsModule instead
})
export class SinisterupdateComponent implements OnInit {
  sinisterForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    location: new FormControl(''),
    typeInsurance: new FormControl(''),
    status: new FormControl('PENDING'),
  });

  sinister: Sinister = {} as Sinister;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sinistersService: SinistersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sinistersService.getSinisterById(+id).subscribe({
        next: (data) => {
          this.sinister = data;
  
          // Ensure we have a valid date before patching the form
          if (!data.dateOfIncident) {
            data.dateOfIncident = new Date(); // Default to current date if missing
          }
  
          this.sinisterForm.patchValue(data);
        },
        error: (error) => {
          console.error('Error fetching sinister:', error);
          this.goBack();
        }
      });
    }
  }
  
  onSubmit() {
    if (this.sinisterForm.valid) {
      const updatedSinister: Sinister = {
        ...this.sinister,
        ...this.sinisterForm.value,
        dateOfIncident: this.sinister.dateOfIncident ?? new Date(), // Ensure date exists
      };
  
      console.log("Sending update request:", updatedSinister); // ✅ Debugging log
  
      this.sinistersService.updateSinister(this.sinister.id, updatedSinister).subscribe({
        next: () => {
          this.router.navigate(['/admin/sinister']);
        },
        error: (error) => {
          console.error("Error updating sinister:", error);
          alert("Failed to update sinister. Please check your inputs.");
        }
      });
    }
  }
  
  
  

  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}
