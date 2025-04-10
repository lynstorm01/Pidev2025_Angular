import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.css']
})
export class ArchivedComponent {
  archivedSinisters: Sinister[] = [];
  username: string = ''
  constructor(private sinistersService: SinistersService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadArchivedSinisters();
  }

  private loadArchivedSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.archivedSinisters = data.filter(s => s.status.toUpperCase() === 'ARCHIVED');
        this.archivedSinisters.forEach(sinister => {
          this.userService.getUser(sinister.user).subscribe({
            next: (userData) => {
              // Replace the numeric user with the actual user's username
              this.username = userData.firstName+' '+userData.lastName;
            },
            error: (error) => {
              console.error('Error fetching user:', error);
            }
          });
        });
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