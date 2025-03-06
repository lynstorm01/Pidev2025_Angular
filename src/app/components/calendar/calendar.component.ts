import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  userId: number = 6;  // ID utilisateur par défaut

  // Options du calendrier
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    editable: true,
    selectable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [] // Initialement vide
  };

  selectedAppointment: Appointement | null = null;
  allAppointments: Appointement[] = []; // Stocke tous les rendez-vous

  constructor(private appointementService: AppointementService, private router: Router) {}

  ngOnInit(): void {
    // Charge tous les rendez-vous de l'utilisateur avec l'ID 6 par défaut
    this.loadAppointments();
  }

  // Chargement des rendez-vous pour l'utilisateur avec l'ID par défaut (6)
  loadAppointments(): void {
    this.appointementService.getAppointmentsByUser(this.userId).subscribe(
      (data: Appointement[]) => {
        console.log('Données reçues:', data);
        this.allAppointments = data;
        // Affiche les rendez-vous dans le calendrier
        this.calendarOptions.events = this.mapAppointmentsToEvents(data);
      },
      error => console.error('Erreur lors du chargement des rendez-vous', error)
    );
  }

  // Transformation des rendez-vous en format événement pour FullCalendar
  mapAppointmentsToEvents(appointments: Appointement[]): any[] {
    return appointments.map(appointment => ({
      title: appointment.description,
      start: new Date(appointment.dateSubmitted),
      extendedProps: {
        idAppointment: appointment.idAppointment,
        userId: appointment.user?.id
      },
      color: appointment.status === 'CONFIRMED' ? '#28a745' : '#dc3545'
    }));
  }

  // Filtrer les rendez-vous pour l'utilisateur avec l'ID par défaut
  filterByUser(): void {
    const filteredAppointments = this.allAppointments.filter(app => app.user?.id === this.userId);
    this.calendarOptions.events = this.mapAppointmentsToEvents(filteredAppointments);
  }

    // Afficher tous les rendez-vous sans filtre
    showAllAppointments(): void {
      this.calendarOptions.events = this.mapAppointmentsToEvents(this.allAppointments);
    }

  // Gestion du clic sur un événement
  handleEventClick(clickInfo: any): void {
    const appointmentId = clickInfo.event.extendedProps.idAppointment;
    this.router.navigate(['/appointment-detail'], { queryParams: { id: appointmentId } });
  }

  // Gestion de la sélection d'une date
  handleDateSelect(selection: any): void {
    console.log('Date sélectionnée:', selection.startStr);
    this.router.navigate(['/add-appointment'], { queryParams: { date: selection.startStr } });
  }
}
