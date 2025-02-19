import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

  ngAfterViewInit() {
    this.initializeDataTable();

    // Ensure search binds after the table is initialized
    setTimeout(() => {
      this.setupCustomSearch();
    }, 500);
    
  }

  private initializeDataTable() {
    // Check if the DataTable is already initialized
    if ($.fn.DataTable.isDataTable(this.table.nativeElement)) {
      // If already initialized, destroy it first to reinitialize
      this.dataTable = $(this.table.nativeElement).DataTable();
      this.dataTable.destroy(); // Destroy the previous instance
    }
  
    // Initialize the DataTable
    this.dataTable = $(this.table.nativeElement).DataTable({
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', text: 'Copy', className: 'btn btn-primary' },
        { extend: 'csv', text: 'CSV', className: 'btn btn-primary' },
        { extend: 'excel', text: 'Excel', className: 'btn btn-primary' },
        { extend: 'pdf', text: 'PDF', className: 'btn btn-primary' },
        { extend: 'print', text: 'Print', className: 'btn btn-primary' }
      ],
      paging: false, // Disable pagination
      searching: true, // Enable default search box
      initComplete: function () {
        $('.dt-search').remove(); // Remove search bar by ID
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
