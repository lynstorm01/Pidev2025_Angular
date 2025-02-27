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
  archivedAppointments: Appointement[] = [];
  searchText: string = '';
  
  // Pagination variables
  page: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  constructor(private appointementService: AppointementService) {}

  ngOnInit(): void {
    this.getAppointments();
    this.getArchivedAppointments();
  }

  getAppointments(): void {
    this.appointementService.getAllAppointments().subscribe(
      data => {
        this.appointments = data;
        this.calculatePages();
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  getArchivedAppointments(): void {
    this.appointementService.getArchivedAppointments().subscribe(
      data => {
        this.archivedAppointments = data;
      },
      error => {
        console.error('Erreur lors de la récupération des rendez-vous archivés', error);
      }
    );
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.appointments.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
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
        appointment.status = updated.status;
      },
      error => {
        console.error("Erreur lors de la mise à jour du statut", error);
      }
    );
  }

  archiveAppointment(appointment: Appointement): void {
    appointment.archiver = false;
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      () => {
        this.appointments = this.appointments.filter(app => app.idAppointment !== appointment.idAppointment);
        this.archivedAppointments.push(appointment);
      },
      error => {
        console.error("Erreur lors de l'archivage du rendez-vous", error);
      }
    );
  }

  unarchiveAppointment(appointment: Appointement): void {
    appointment.archiver = true;
    this.appointementService.updateAppointment(appointment.idAppointment, appointment).subscribe(
      () => {
        this.archivedAppointments = this.archivedAppointments.filter(app => app.idAppointment !== appointment.idAppointment);
        this.appointments.push(appointment);
      },
      error => {
        console.error("Erreur lors du désarchivage du rendez-vous", error);
      }
    );
  }

  get filteredAppointments(): Appointement[] {
    if (!this.searchText) {
      return this.appointments;
    }
    const search = this.searchText.toLowerCase();
    return this.appointments.filter(app => {
      const description = app.description ? app.description.toLowerCase() : '';
      const status = app.status ? app.status.toLowerCase() : '';
      const submittedDate = app.dateSubmitted ? new Date(app.dateSubmitted).toLocaleDateString().toLowerCase() : '';
      return description.includes(search) || status.includes(search) || submittedDate.includes(search);
    });
  }
}
