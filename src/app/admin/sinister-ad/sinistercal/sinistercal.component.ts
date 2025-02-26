import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sinistercal',
  templateUrl: './sinistercal.component.html',
  styleUrls: ['./sinistercal.component.css']
})
export class SinistercalComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this) // Bind the click handler
  };

  constructor(
    private sinistersService: SinistersService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit() {
    // Fetch pending sinisters and map to calendar events
    this.sinistersService.getPendingSinisters().subscribe((data: Sinister[]) => {
      const events = data
        .filter(s => s.dateofcreation) // Ensure date is present
        .map(s => {
          const date = new Date(s.dateofcreation);
          if (!isNaN(date.getTime())) { // Check for valid date
            return {
              title: `sinister waiting: ${s.id}`, // Display the Sinister ID
              start: date.toISOString().split('T')[0], // Use only the date part
              color: 'orange', // Optional: Color to indicate pending status
              id: s.id.toString() // Add id for navigation
            };
          }
          return undefined;
        })
        .filter((event): event is NonNullable<typeof event> => event !== undefined);

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
      };
    });
  }

  // Handle event click to navigate to the details page
  handleEventClick(arg: any) {
    const sinisterId = arg.event.id;
    if (sinisterId) {
      this.router.navigate([`/admin/sinister/display/${sinisterId}`]);
    }
  }
}