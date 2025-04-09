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

  constructor(private appointementService: AppointementService) { }

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
}
