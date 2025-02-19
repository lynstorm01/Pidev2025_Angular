import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service'; // Adjust path as needed
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-sinister-ad',
  templateUrl: './sinister-ad.component.html',
  styleUrls: ['./sinister-ad.component.css']
})
export class SinisterADComponent implements AfterViewInit {
  @ViewChild('example23', { static: false }) table!: ElementRef;
  dataTable: any;
  sinisters: Sinister[] = [];

  constructor(private sinistersService: SinistersService, private router: Router) {}

  ngAfterViewInit() {
    this.loadSinisters();
  }

  private loadSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
        this.initializeDataTable();
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
      }
    });
  }

  private initializeDataTable() {
    if ($.fn.DataTable.isDataTable(this.table.nativeElement)) {
      $(this.table.nativeElement).DataTable().destroy();
    }
  
    this.dataTable = $(this.table.nativeElement).DataTable({
      data: this.sinisters,
      columns: [
        { 
          title: 'Date of Incident', 
          data: 'dateOfIncident', 
          render: (data: any) => new Date(data).toLocaleDateString() 
        },
        { title: 'Description', data: 'description' },
        { title: 'Status', data: 'status' },
        { title: 'Location', data: 'location' },
        { title: 'Type Insurance', data: 'typeInsurance' },
        { 
          title: 'Actions',
          data: 'id',
          render: (data: any) => `
            <button class="btn btn-sm btn-primary btn-display" data-id="${data}">Display</button>
            <button class="btn btn-sm btn-warning btn-update" data-id="${data}">Update</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${data}">Delete</button>
          `
        }
      ],
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', text: 'Copy', className: 'btn btn-primary' },
        { extend: 'csv', text: 'CSV', className: 'btn btn-primary' },
        { extend: 'excel', text: 'Excel', className: 'btn btn-primary' },
        { extend: 'pdf', text: 'PDF', className: 'btn btn-primary' },
        { extend: 'print', text: 'Print', className: 'btn btn-primary' }
      ],
      paging: false,
      searching: true,
      initComplete: () => {
        $('.dt-search').remove();
        this.setupCustomSearch();
      }
    });
  
    this.setupButtonClickHandlers();
    
  }
  private setupButtonClickHandlers() {
    const self = this;
  
    $(document).on('click', '.btn-display', function () {
      const id = $(this).data('id');
      self.router.navigate([`/admin/sinister/display`, id]);  // ✅ Fix here
    });
  
    $(document).on('click', '.btn-update', function () {
      const id = $(this).data('id');
      self.router.navigate([`/admin/sinister/update`, id]);  // ✅ Fix here
    });
  
    $(document).on('click', '.btn-delete', function () {
      const id = $(this).data('id');
      self.deleteSinister(id);
    });
  }
  
  
  private setupCustomSearch() {
    $('#search').off('keyup').on('keyup', (event) => {
      const searchValue = (event.target as HTMLInputElement).value;
      this.dataTable.search(searchValue).draw();
    });
  
    // Ensure input is not disabled
    $('#search').prop('disabled', false);
  }
  

  // Navigation methods
  navigateToCreate() {
    this.router.navigate(['/sinister/create']);
  }

  navigateToDisplay(id: number) {
    this.router.navigate(['/sinister/display', id]);
  }

  navigateToUpdate(id: number) {
    this.router.navigate(['/sinister/update', id]);
  }

  deleteSinister(id: number) {
    if (confirm('Are you sure you want to delete this sinister?')) {
      this.sinistersService.deleteSinister(id).subscribe({
        next: () => {
          this.loadSinisters(); // Reload data after deletion
        },
        error: (error) => {
          console.error('Error deleting sinister:', error);
        }
      });
    }
  }
}