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
  totalSinisters: number = 0;
  totalAccepted: number = 0;
  totalDeclined: number = 0;
  totalPending: number = 0;
  constructor(private sinistersService: SinistersService, private router: Router) {}

  ngAfterViewInit() {
    this.loadSinisters();
  }

  private loadSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
        this.totalSinisters = data.length;
        this.totalAccepted = data.filter(s => s.status.toUpperCase() === 'ACCEPTED').length;
        this.totalDeclined = data.filter(s => s.status.toUpperCase() === 'DECLINED').length;
        this.totalPending = data.filter(s => s.status.toUpperCase() === 'PENDING').length;
        
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
        { title: 'Type Insurance', data: 'typeInsurance' },
        { title: 'Location', data: 'location' },
        {
          title: 'Status',
          data: 'status',
          render: (data: any) => {
            if (data === 'ARCHIVED') {
              return `<span class="text-muted">${data}</span>`;
            }
            return data;
          }
        },
        {
          title: 'Date of Creation',
          data: 'dateofcreation',
          render: (data: any) => new Date(data).toLocaleDateString()
        },
        { title: 'Client Name', data: 'clientid' },
        {
          title: 'Actions',
          data: 'id',
          render: (data: any, type: any, row: any) => {
            const isArchived = row.status === 'ARCHIVED';
            const archiveText = isArchived ? 'Unarchive' : 'Archive';
            return `
              <button class="btn btn-sm btn-primary btn-display" data-id="${data}">Display</button>
              <button class="btn btn-sm btn-warning btn-update" data-id="${data}">Update</button>
              <button class="btn btn-sm btn-danger btn-delete" data-id="${data}">Delete</button>
              <button class="btn btn-sm btn-secondary btn-archive" data-id="${data}">${archiveText}</button>
            `;
          }
        }
      ],
      createdRow: (row: Node, data: any) => {
        if (data.status === 'ARCHIVED') {
          $(row).addClass('archived-row');
          // Apply inline CSS to override any other styles
          $(row).css({
            'background-color': '#e9ecef',
            'color': '#6c757d',
            'text-decoration': 'line-through'
          });
          // Apply the same style to all cells in the row
          $('td', row).css({
            'background-color': '#e9ecef',
            'color': '#6c757d',
            'text-decoration': 'line-through'
          });
          // Keep the buttons faded but functional
          $('td .btn', row).css({
            'opacity': '0.4'
          });
        }
      },
      
      
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
    $(document).on('click', '.btn-archive', function () {
      const id = $(this).data('id');
      self.archiveSinister(id);
    });
  }
  archiveSinister(id: number) {
    this.sinistersService.toggleArchiveSinister(id).subscribe({
      next: (updatedSinister) => {
        // Find the updated sinister and change its status
        const index = this.sinisters.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sinisters[index].status = updatedSinister.status;
        }
        // Refresh the DataTable without reloading the whole list
        this.dataTable.clear().rows.add(this.sinisters).draw();
      },
      error: (error) => {
        console.error('Toggle archive error:', error);
      }
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
    this.sinistersService.deleteSinister(id).subscribe({
      next: () => {
        this.loadSinisters(); // Refresh the table data
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }
}