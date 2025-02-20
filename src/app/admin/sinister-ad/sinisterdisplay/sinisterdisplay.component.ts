import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister, SinisterDetail } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-sinisterdisplay',
  templateUrl: './sinisterdisplay.component.html',
  styleUrls: ['./sinisterdisplay.component.css']
})
export class SinisterdisplayComponent {
  sinister: Sinister = {} as Sinister;
  sinisterDetails: SinisterDetail[] = []; // New array to store details

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sinistersService: SinistersService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sinistersService.getSinisterById(+id).subscribe({
        next: (data) => {
          this.sinister = data;
          this.loadSinisterDetails(+id); // Load details after fetching the sinister
        },
        error: (error) => {
          console.error('Error fetching sinister:', error);
          this.goBack();
        }
      });
    }
  }

  loadSinisterDetails(id: number) {
    this.sinistersService.getSinisterDetailsBySinisterId(id).subscribe({
      next: (details) => {
        this.sinisterDetails = details;
      },
      error: (error) => {
        console.error('Error fetching sinister details:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}