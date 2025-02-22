import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SinistersService, SinisterDetail } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-sinistercal',
  templateUrl: './sinistercal.component.html',
  styleUrls: ['./sinistercal.component.css']
})
export class SinistercalComponent implements OnInit {
  sinisterDetails: SinisterDetail[] = [];

  constructor(private sinistersService: SinistersService) { }

  ngOnInit(): void {
    this.sinistersService.getMostRecentPendingSinisterDetails().subscribe(
      (data: SinisterDetail[]) => {
        this.sinisterDetails = data;
      },
      (error) => {
        console.error('Error fetching sinister details:', error);
      }
    );
  }
}