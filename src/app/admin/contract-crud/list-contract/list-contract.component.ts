import { Component, OnInit } from '@angular/core';
import { ContractService, Contract } from '../../../services/contract.service';
import { PageEvent } from '@angular/material/paginator';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import 'pdfmake';
@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html',
  styleUrls: ['./list-contract.component.scss']
})
export class ListContractComponent implements OnInit {
  contracts: Contract[] = [];
  pagedContracts: Contract[] = [];
  isLoading: boolean = false;
  message: string = '';

  // Pagination variables
  pageSize: number = 5;
  currentPage: number = 0;
  totalContracts: number = 0;

  searchTerm: string = '';
  filteredContracts: Contract[] = [];

  constructor(private contractService: ContractService) {}

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
    // You might navigate to the create page for editing:
    // e.g., using a router: this.router.navigate(['/admin/contract-crud/create'], { state: { contract } })
    console.log('Edit contract', contract);
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

  downloadPDF(contract: Contract): void {
    // (The same pdfMake code as before)
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
