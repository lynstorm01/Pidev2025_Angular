import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ContractService, Contract } from '../../../services/contract.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html',
  styleUrls: ['./list-contract.component.scss']
})
export class ListContractComponent implements OnInit {
  contracts: Contract[] = [];
  filteredContracts: Contract[] = [];
  pagedContracts: Contract[] = [];
  isLoading = false;
  message = '';
  userIdFilter: number | null = null;

  // Pagination variables
  pageSize = 5;
  currentPage = 0;
  totalContracts = 0;

  // Totals by status
  totalActive = 0;
  totalPending = 0;
  totalExpired = 0;
  totalArchived = 0;

  searchTerm = '';

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    this.contractService.getAllContracts().subscribe({
      next: (data: Contract[]) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.totalContracts = data.length;

        // Update pagination
        this.setPagedContracts();

        // Calculate totals by status (with optional chaining to avoid errors)
        this.totalActive = data.filter(
          c => c.status?.toUpperCase() === 'ACTIVE'
        ).length;
        this.totalPending = data.filter(
          c => c.status?.toUpperCase() === 'PENDING'
        ).length;
        this.totalExpired = data.filter(
          c => c.status?.toUpperCase() === 'EXPIRED'
        ).length;
        this.totalArchived = data.filter(
          c => c.status?.toUpperCase() === 'ARCHIVED'
        ).length;

        this.isLoading = false;
      },
      error: (err: any) => {
        this.message = 'Error loading contracts.';
        this.isLoading = false;
      }
    });
  }

  // If you ever want to load contracts for a specific user:
  loadUserContractsByUserId(userId: number): void {
    this.isLoading = true;
    this.contractService.getContractsByUserId(userId).subscribe({
      next: (data: Contract[]) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.totalContracts = data.length;
        this.setPagedContracts();
        this.isLoading = false;
      },
      error: (err) => {
        this.message = 'Error loading contracts for the user.';
        this.isLoading = false;
      }
    });
  }

  setPagedContracts(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedContracts = this.filteredContracts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPagedContracts();
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredContracts = this.contracts;
    } else {
      const lowerSearch = this.searchTerm.toLowerCase();
      this.filteredContracts = this.contracts.filter(contract =>
        contract.contractNumber.toLowerCase().includes(lowerSearch)
      );
    }
    this.totalContracts = this.filteredContracts.length;
    this.currentPage = 0;
    this.setPagedContracts();
  }

  onEdit(contract: Contract): void {
    // Navigate to the update route (ensure your route config matches)
    this.router.navigate(['/admin', 'contract-crud', 'Update', contract.id]);
  }

  onDelete(contract: Contract): void {
    if (!confirm('Delete this contract permanently?')) return;
    this.isLoading = true;
    this.contractService.deleteContract(contract.id!).subscribe({
      next: () => {
        this.message = 'Contract deleted successfully!';
        this.loadContracts();
      },
      error: (err: any) => {
        this.message = 'Error deleting contract.';
        this.isLoading = false;
      }
    });
  }

  onToggleArchive(contract: Contract): void {
    const currentStatus = contract.status?.toUpperCase();
    const newStatus = currentStatus === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    const updatePayload = { ...contract, status: newStatus };

    this.contractService.updateContract(contract.id!, updatePayload).subscribe({
      next: () => {
        // Update the local array so the UI changes
        contract.status = newStatus;
        this.message = `Contract ${
          newStatus === 'ARCHIVED' ? 'archived' : 'unarchived'
        } successfully!`;
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error updating contract status.';
      }
    });
  }

  downloadPDF(contract: Contract): void {
    const docDefinition: any = {
      content: [
        { text: 'Contract Details', style: 'header' },
        {
          columns: [
            {
              width: '50%',
              text: `Contract Number: ${contract.contractNumber}`
            },
            {
              width: '50%',
              text: `Status: ${contract.status}`,
              alignment: 'right'
            }
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Dates', style: 'subheader' },
        {
          columns: [
            { width: '50%', text: `Start Date: ${contract.startDate}` },
            {
              width: '50%',
              text: `End Date: ${contract.endDate}`,
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 10]
        },
        { text: 'Property Details', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{ text: 'Field', bold: true }, { text: 'Value', bold: true }],
              ['Address', contract.property?.address || ''],
              ['Area', contract.property?.area?.toString() || ''],
              ['Property Type', contract.property?.propertyType || ''],
              ['Value', contract.property?.value?.toString() || '']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      })
    };

    pdfMake.createPdf(docDefinition).download(
      `Contract_${contract.contractNumber}.pdf`
    );
  }

  // Inside your ListContractComponent class

// Helper to safely retrieve nested values using dot notation (e.g., "property.address")
private getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Exports the provided data (contracts) into a CSV file with the specified filename.
 * The CSV columns are defined in the desired order.
 */
exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    console.error("No data available to export.");
    return;
  }

  // Define the CSV columns (key paths and their headers)
  const columns = [
    { key: 'contractNumber', header: 'Contract Number' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'property.address', header: 'Address' },
    { key: 'property.area', header: 'Area' },
    { key: 'property.propertyType', header: 'Property Type' },
    { key: 'property.value', header: 'Property Value' }
  ];

  // Build CSV header row
  let csvContent = columns.map(col => `"${col.header}"`).join(",") + "\n";

  // Build each CSV row
  data.forEach(row => {
    const rowContent = columns.map(col => {
      let value = this.getNestedValue(row, col.key);
      if (value === undefined || value === null) {
        value = "";
      }
      // Escape any double quotes in the value
      value = String(value).replace(/"/g, '""');
      return `"${value}"`;
    }).join(",");
    csvContent += rowContent + "\n";
  });

  // Create a Blob from the CSV content and trigger a download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
exportAllContracts(): void {
  // Assuming you have already loaded your contracts into this.contracts
  this.exportToCSV(this.contracts, 'all_contracts.csv');
}
exportContract(contract: Contract): void {
  this.exportToCSV([contract], `contract_${contract.contractNumber}.csv`);
}

 // NEW: Filter by user ID when the button is clicked
 onFilterByUserId(): void {
  if (!this.userIdFilter) {
    // If no user id is entered, reload all contracts
    this.loadContracts();
    return;
  }
  this.isLoading = true;
  this.contractService.getContractsByUserId(this.userIdFilter).subscribe({
    next: (data: Contract[]) => {
      this.contracts = data;
      this.filteredContracts = data;
      this.totalContracts = data.length;
      this.setPagedContracts();
      this.isLoading = false;
    },
    error: (err: any) => {
      this.message = `Error loading contracts for user ${this.userIdFilter}.`;
      this.isLoading = false;
    }
  });
}

  
}
