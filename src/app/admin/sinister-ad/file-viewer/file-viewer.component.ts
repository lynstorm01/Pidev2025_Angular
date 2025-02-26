import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {
  fileUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const filePath = params['file'];
      console.log('File Path:', filePath); // Debugging
      if (filePath) {
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
      }
    });
  }
}
