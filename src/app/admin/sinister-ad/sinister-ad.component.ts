import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
Chart.register(...registerables);

@Component({
  selector: 'app-sinister-ad',
  templateUrl: './sinister-ad.component.html',
  styleUrls: ['./sinister-ad.component.css']
})
export class SinisterADComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sinisterTable', { static: false }) table!: ElementRef;
  timeSpentData: { [key: number]: { [status: string]: string } } = {};
  sinisters: Sinister[] = [];
  filteredSinisters: Sinister[] = [];
  totalSinisters: number = 0;
  totalAccepted: number = 0;
  totalDeclined: number = 0;
  totalPending: number = 0;
  searchTerm: string = '';
  pageSize: number = 10;
  pageIndex: number = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  dataTable: any;
  hideAcceptedDeclined: boolean = false; // Toggle state

  constructor(private sinistersService: SinistersService, private router: Router) {}

  ngAfterViewInit() {
    this.loadSinisters();
  }
// Add this method to fetch time spent data
private loadTimeSpentData(sinisterId: number): void {
  this.sinistersService.getTimeSpentInEachStatus(sinisterId).subscribe({
    next: (data: { [status: string]: string }) => { // Change to expect string values
      this.timeSpentData[sinisterId] = data; // Directly use the formatted strings
    },
    error: (error) => {
      console.error('Error fetching time spent data:', error);
    }
  });
}

  private loadSinisters() {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
        this.applyFilters(); // Apply filters after loading data
        this.totalSinisters = this.sinisters.length;
        this.totalAccepted = this.sinisters.filter(s => s.status.toUpperCase() === 'ACCEPTED').length;
        this.totalDeclined = this.sinisters.filter(s => s.status.toUpperCase() === 'DECLINED').length;
        this.totalPending = this.sinisters.filter(s => s.status.toUpperCase() === 'PENDING').length;
  // Load time spent data for each sinister
  this.sinisters.forEach(sinister => {
    this.loadTimeSpentData(sinister.id);
  });
        this.initializePieChart();
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
      }
    });
  }

  private applyFilters() {
    let filteredData = this.sinisters;

    // Filter out archived sinisters
    filteredData = filteredData.filter(s => s.status.toUpperCase() !== 'ARCHIVED');

    // Filter out ACCEPTED and DECLINED sinisters if hideAcceptedDeclined is true
    if (this.hideAcceptedDeclined) {
      filteredData = filteredData.filter(s =>
        s.status.toUpperCase() !== 'ACCEPTED' && s.status.toUpperCase() !== 'DECLINED'
      );
    }

    // Apply search filter
    if (this.searchTerm) {
      const lowerSearch = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter((sinister) =>
        sinister.user?.username?.toLowerCase().includes(lowerSearch)
      );
    }

    this.filteredSinisters = filteredData;
    this.pageIndex = 0;
    this.paginator.firstPage();
  }

  toggleHideAcceptedDeclined() {
    this.hideAcceptedDeclined = !this.hideAcceptedDeclined;
    this.applyFilters();
  }

  private initializePieChart() {
    const pieChartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Accepted', 'Declined', 'Pending'],
        datasets: [{
          label: 'Status Counts',
          data: [
            this.hideAcceptedDeclined ? 0 : this.totalAccepted,
            this.hideAcceptedDeclined ? 0 : this.totalDeclined,
            this.totalPending
          ],
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

  onSearchChange(): void {
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredSinisters.sort((a, b) => {
      const valueA = this.getPropertyValue(a, column);
      const valueB = this.getPropertyValue(b, column);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  displaySinister(id: number) {
    this.router.navigate([`/admin/sinister/display`, id]);
  }

  updateSinister(id: number) {
    this.router.navigate([`/admin/sinister/update`, id]);
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

  navigateToArchivedSinisters() {
    this.router.navigate(['/admin/sinister/archived']);
  }

  archiveSinister(id: number) {
    this.sinistersService.toggleArchiveSinister(id).subscribe({
      next: (updatedSinister) => {
        const index = this.sinisters.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sinisters[index].status = updatedSinister.status;
        }
        this.loadSinisters();
      },
      error: (error) => {
        console.error('Toggle archive error:', error);
      }
    });
  }

  exportToCSV() {
    const data = this.filteredSinisters.map(sinister => [
      new Date(sinister.dateOfIncident).toLocaleDateString(),
      sinister.description,
      sinister.status,
      sinister.location,
      sinister.typeInsurance,
      new Date(sinister.dateofcreation).toLocaleDateString(),
      sinister.user?.username || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + data.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sinisters.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    // Create a new table without the "Actions" column
    const newTable = document.createElement('table');
    newTable.className = 'table table-striped';

    // Copy the header row (excluding the "Actions" column)
    const headerRow = table.getElementsByTagName('thead')[0].rows[0];
    const newHeaderRow = document.createElement('tr');
    for (let i = 0; i < headerRow.cells.length - 1; i++) { // Exclude the last column
      const th = document.createElement('th');
      th.textContent = headerRow.cells[i].textContent;
      newHeaderRow.appendChild(th);
    }
    newTable.appendChild(newHeaderRow);

    // Copy the data rows (excluding the "Actions" column)
    const tbody = table.getElementsByTagName('tbody')[0];
    const newTbody = document.createElement('tbody');
    for (let i = 0; i < tbody.rows.length; i++) {
      const row = tbody.rows[i];
      const newRow = document.createElement('tr');
      for (let j = 0; j < row.cells.length - 1; j++) { // Exclude the last column
        const td = document.createElement('td');
        td.textContent = row.cells[j].textContent;
        newRow.appendChild(td);
      }
      newTbody.appendChild(newRow);
    }
    newTable.appendChild(newTbody);

    // Temporarily add the new table to the DOM (required for html2canvas to render it)
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px'; // Move it off-screen
    tempDiv.appendChild(newTable);
    document.body.appendChild(tempDiv);

    // Use html2canvas to generate the PDF
    html2canvas(newTable).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('sinisters.pdf');

      // Clean up: Remove the temporary table from the DOM
      document.body.removeChild(tempDiv);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      // Clean up: Remove the temporary table from the DOM
      document.body.removeChild(tempDiv);
    });
  }

  exportToPrint() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    // Clone the table to avoid modifying the original
    const clonedTable = table.cloneNode(true) as HTMLTableElement;

    // Remove the "Actions" column header (last <th> in the header row)
    const headerRow = clonedTable.getElementsByTagName('thead')[0].rows[0];
    if (headerRow.cells.length > 0) {
      headerRow.deleteCell(headerRow.cells.length - 1); // Remove the last <th> (Actions column header)
    }

    // Remove the "Actions" column data (last <td> in each row)
    const rows = clonedTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      if (cells.length > 0) {
        rows[i].deleteCell(cells.length - 1); // Remove the last <td> (Actions column data)
      }
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=500,width=800');
    if (!printWindow) {
      console.error('Failed to open print window!');
      return;
    }

    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #000; padding: 8px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(clonedTable.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Print the table
    printWindow.print();
  }

  exportToExcel() {
    const data = this.filteredSinisters.map(sinister => [
      new Date(sinister.dateOfIncident).toLocaleDateString(),
      sinister.description,
      sinister.status,
      sinister.location,
      sinister.typeInsurance,
      new Date(sinister.dateofcreation).toLocaleDateString(),
      sinister.user?.username || 'N/A'
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[
      'Date of Incident', 'Description', 'Status', 'Location', 'Type Insurance', 'Date of Creation', 'Client Name'
    ], ...data]);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sinisters');

    XLSX.writeFile(wb, 'sinisters.xlsx');
  }

  exportToCopy() {
    const table = document.getElementById('sinisterTable');
    if (!table) {
      console.error('Table not found!');
      return;
    }

    const range = document.createRange();
    range.selectNode(table);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    navigator.clipboard.writeText(table.innerText)
      .then(() => {
        alert('Table copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy table:', err);
        alert('Failed to copy table to clipboard.');
      });

    window.getSelection()?.removeAllRanges();
  }
}