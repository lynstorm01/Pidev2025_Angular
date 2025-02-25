import { Component, OnInit } from '@angular/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointement[] = [];

  constructor(private appointementService: AppointementService) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.appointementService.getAllAppointments().subscribe(
      data => {
        this.appointments = data;
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  deleteAppointment(id: number): void {
    this.appointementService.deleteAppointment(id).subscribe(
      () => {
        this.appointments = this.appointments.filter(app => app.idAppointment !== id);
      },
      error => {
        console.error('Error deleting appointment', error);
      }
    );
  }

  archiveAppointment(appointment: Appointement): void {
    appointment.archiver = false;
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      () => {
        this.appointments = this.appointments.filter(app => app.idAppointment !== appointment.idAppointment);
      },
      error => {
        console.error('Erreur lors de l\'archivage du rendez-vous', error);
      }
    );
  }

  changeStatus(appointment: Appointement): void {
    let newStatus: string;
    switch (appointment.status) {
      case 'PENDING':
        newStatus = 'CONFIRMED';
        break;
      case 'CONFIRMED':
        newStatus = 'CANCELED';
        break;
      case 'CANCELED':
        newStatus = 'PENDING';
        break;
      default:
        newStatus = 'PENDING';
    }
    appointment.status = newStatus;
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      updated => {
        // Mise à jour locale du statut si nécessaire
        appointment.status = updated.status;
      },
      error => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    );
  }
}
