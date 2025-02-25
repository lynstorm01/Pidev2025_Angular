import { Component, OnInit } from '@angular/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointement: Appointement = new Appointement();
  today: string = '';

  constructor(
    private appointementService: AppointementService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Définir la date d'aujourd'hui au format 'yyyy-MM-dd'
    this.today = new Date().toISOString().split('T')[0];

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointementService.getAppointmentById(+id).subscribe(
        data => {
          this.appointement = data;
        },
        error => {
          console.error('Error fetching appointment for update', error);
        }
      );
    }
  }

  saveAppointment(): void {
    if (this.appointement.idAppointment) {
      this.appointementService.updateAppointment(this.appointement.idAppointment, this.appointement).subscribe(
        () => {
          this.router.navigate(['/appointments']);
        },
        error => {
          console.error('Error saving appointment', error);
        }
      );
    } else {
      // Pour une création, le statut reste PENDING par défaut
      this.appointement.status = 'PENDING';
      this.appointementService.createAppointment(this.appointement).subscribe(
        () => {
          this.router.navigate(['/appointments']);
        },
        error => {
          console.error('Error creating appointment', error);
        }
      );
    }
  }
}
