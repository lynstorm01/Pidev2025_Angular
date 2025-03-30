import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointementService } from '../services/appointement.service';
import { Appointement } from '../models/appointement.model';



@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointement | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private appointementService: AppointementService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du rendez-vous à partir des query parameters
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadAppointment(id);
      } else {
        this.errorMessage = 'Aucun identifiant fourni.';
        this.loading = false;
      }
    });
  }

  loadAppointment(id: number): void {
    this.appointementService.getAppointmentById(id).subscribe(
      (data: Appointement) => {
        this.appointment = data;
        this.loading = false;
      },
      error => {
        console.error('Erreur lors du chargement des détails du rendez-vous', error);
        this.errorMessage = 'Erreur lors du chargement du rendez-vous.';
        this.loading = false;
      }
    );
  }
}
