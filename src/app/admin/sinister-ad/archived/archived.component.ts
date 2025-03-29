import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.css']
})
export class ArchivedComponent {
  archivedSinisters: Sinister[] = [];

  constructor(private sinistersService: SinistersService, private router: Router) {}

  ngOnInit(): void {
    this.loadArchivedSinisters();
  }

  private loadArchivedSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.archivedSinisters = data.filter(s => s.status.toUpperCase() === 'ARCHIVED');
      },
      error: (error) => {
        console.error('Error fetching archived sinisters:', error);
      }
    });
  }

  unarchiveSinister(id: number) {
    this.sinistersService.toggleArchiveSinister(id).subscribe({
      next: () => {
        this.loadArchivedSinisters(); // Reload the list after unarchiving
      },
      error: (error) => {
        console.error('Error unarchiving sinister:', error);
      }
    });
  }
}