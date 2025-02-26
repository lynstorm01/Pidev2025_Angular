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

  updateSinisterStatus(newStatus: string) {
    const id = this.sinister.id;
    if (id) {
      this.sinister.status = newStatus;
      this.sinistersService.updateSinister(id, this.sinister).subscribe({
        next: (updatedSinister) => {
          this.sinister = updatedSinister;
          this.loadSinisterDetails(id); // Reload details after update
        },
        error: (error) => {
          console.error('Error updating sinister:', error);
        }
      });
    }
  }
  openFile(filePath: string) {
    this.router.navigate(['/view-file'], { queryParams: { file: filePath } });
  }
  downloadFile(sinisterDetailId: number) {
    // Construct the URL to the Spring endpoint
    const downloadUrl = `http://localhost:8069/api/admin/sinisters/details/files/${sinisterDetailId}`;
  
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'file.pdf'; // Set a default file name for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
  }
  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}