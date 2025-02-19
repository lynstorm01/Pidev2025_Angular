import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
@Component({
  selector: 'app-sinisterdisplay',
  templateUrl: './sinisterdisplay.component.html',
  styleUrls: ['./sinisterdisplay.component.css']
})
export class SinisterdisplayComponent {
  sinister: Sinister = {} as Sinister;

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
        },
        error: (error) => {
          console.error('Error fetching sinister:', error);
          this.goBack();
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}

