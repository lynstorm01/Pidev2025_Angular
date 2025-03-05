import { Component, OnInit } from '@angular/core';
import type { CalendarOptions } from '@fullcalendar/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the plugin
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin], // Add the plugin here
    editable: true,
    selectable: true, // Activer la sélection
    select: this.handleDateSelect.bind(this), // Corriger ici
    eventClick: this.handleEventClick.bind(this), // Ajout de la gestion du clic sur un événement
    events: [] 
  };

    // Propriété pour stocker le rendez-vous sélectionné
    selectedAppointment: Appointement | null = null;

  constructor(private appointementService: AppointementService, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointementService.getAllAppointments().subscribe(
      (data: Appointement[]) => {
        console.log('Données reçues:', data); // Debugging
  
        this.calendarOptions.events = data.map(appointment => {
          console.log('Statut du rendez-vous:', appointment.status); // Vérifier chaque statut
  
          return {
            title: appointment.description, // Afficher uniquement le statut
            start: new Date(appointment.dateSubmitted),
            extendedProps: {
              idAppointment: appointment.idAppointment
              
            },
            color: appointment.status === 'CONFIRMED' ? '#28a745' : '#dc3545',
          };
        });
      },
      error => console.error('Erreur lors du chargement des rendez-vous', error)
    );
  }

  handleEventClick(clickInfo: any): void {
    const appointmentId = clickInfo.event.extendedProps.idAppointment;
    this.router.navigate(['/appointment-detail'], { queryParams: { id: appointmentId } });
  }
  
  

  
  
  


  // Nouvelle méthode pour gérer la sélection d'une date
  handleDateSelect(selection: any): void {
    console.log('Date sélectionnée:', selection.startStr);
    this.router.navigate(['/add-appointment'], { queryParams: { date: selection.startStr } });
  }
}
