import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

  constructor(private sinistersService: SinistersService) {}

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
          render: (data: any) => {
            return new Date(data).toLocaleDateString();
          }
        },
        { title: 'Description', data: 'description' },
        { title: 'Status', data: 'status' },
        { title: 'Location', data: 'location' },
        { title: 'Type Insurance', data: 'typeInsurance' }
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
        $('.dt-search').remove(); // Remove default search box
        this.setupCustomSearch();
      }
    });
  }

  private setupCustomSearch() {
    $('#search').on('keyup', () => {
      const searchValue = $('#search').val() as string;
      this.dataTable.search(searchValue).draw();
    });
  }
}