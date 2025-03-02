import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

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
        this.initializePieChart(); // Initialize the pie chart
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
      }
    });
  }

  private initializePieChart() {
    const pieChartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Accepted', 'Declined', 'Pending'],
        datasets: [{
          label: 'Status Counts',
          data: [this.totalAccepted, this.totalDeclined, this.totalPending],
          backgroundColor: ['green', 'red', 'orange'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sinister Status Distribution'
          }
        }
      }
    };

    new Chart('sinisterPieChart', pieChartConfig);
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
        {
          title: 'Client UserName',
          data: 'user',
          render: (data: any) => data ? data.username : 'N/A'
        },
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
          $(row).css({
            'background-color': '#e9ecef',
            'color': '#6c757d',
            'text-decoration': 'line-through'
          });
          $('td', row).css({
            'background-color': '#e9ecef',
            'color': '#6c757d',
            'text-decoration': 'line-through'
          });
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
      self.router.navigate([`/admin/sinister/display`, id]);
    });

    $(document).on('click', '.btn-update', function () {
      const id = $(this).data('id');
      self.router.navigate([`/admin/sinister/update`, id]);
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
        const index = this.sinisters.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sinisters[index].status = updatedSinister.status;
        }
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

    $('#search').prop('disabled', false);
  }

  deleteSinister(id: number) {
    this.sinistersService.deleteSinister(id).subscribe({
      next: () => {
        this.loadSinisters();
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }
}