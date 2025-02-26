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
  isLoading: boolean = false;
  message: string = '';
  
  // Pagination variables
  pageSize: number = 5;
  currentPage: number = 0;
  totalContracts: number = 0;
  
  searchTerm: string = '';

  constructor(private contractService: ContractService, private router: Router) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.totalContracts = data.length;
        this.setPagedContracts();
        this.isLoading = false;
      },
      error: (err) => {
        this.message = 'Error loading contracts.';
        this.isLoading = false;
      }
    });
  }

  setPagedContracts(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedContracts = this.filteredContracts.slice(startIndex, startIndex + this.pageSize);
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
    // Navigate to update route; adjust path as needed
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
      error: (err) => {
        this.message = 'Error deleting contract.';
        this.isLoading = false;
      }
    });
  }

  onToggleArchive(contract: Contract): void {
    // Determine the new status: if currently ARCHIVED, set to ACTIVE (or your default); otherwise, ARCHIVED
    const newStatus = contract.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    const updatePayload = { ...contract, status: newStatus };
  
    this.contractService.updateContract(contract.id!, updatePayload).subscribe({
      next: () => {
        contract.status = newStatus;
        this.message = `Contract ${newStatus === 'ARCHIVED' ? 'archived' : 'unarchived'} successfully!`;
      },
      error: (err: any) => {
        console.error(err);
        this.message = `Error updating contract status.`;
      }
    });
  }
  

  downloadPDF(contract: Contract): void {
    const docDefinition: any = {
      content: [
        { text: 'Contract Details', style: 'header' },
        {
          columns: [
            { width: '50%', text: `Contract Number: ${contract.contractNumber}` },
            { width: '50%', text: `Status: ${contract.status}`, alignment: 'right' }
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Dates', style: 'subheader' },
        {
          columns: [
            { width: '50%', text: `Start Date: ${contract.startDate}` },
            { width: '50%', text: `End Date: ${contract.endDate}`, alignment: 'right' }
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
              ['Address', contract.property?.address],
              ['Area', contract.property?.area?.toString()],
              ['Property Type', contract.property?.propertyType],
              ['Value', contract.property?.value?.toString()]
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

    pdfMake.createPdf(docDefinition).download(`Contract_${contract.contractNumber}.pdf`);
  }
}
