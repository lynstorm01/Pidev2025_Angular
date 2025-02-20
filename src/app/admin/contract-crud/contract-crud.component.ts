import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, Contract } from '../../services/contract.service';
//import jsPDF from 'jspdf';

@Component({
  selector: 'app-contract-crud',
  templateUrl: './contract-crud.component.html',
  styleUrls: ['./contract-crud.component.scss']
})
export class ContractCrudComponent implements OnInit {
  contractForm!: FormGroup;
  contracts: Contract[] = [];
  message: string = '';
  selectedContract?: Contract;
  isLoading: boolean = false;
  searchTerm: string = ''; // Search term for contract number
  filteredContracts: Contract[] = [];
  constructor(
    private fb: FormBuilder,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadContracts();
  }

  private initForm(): void {
    this.contractForm = this.fb.group({
      contractNumber: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      property: this.fb.group({
        address: ['', Validators.required],
        area: [null, [Validators.required, Validators.min(1)]],
        propertyType: ['', Validators.required],
        value: [null, [Validators.required, Validators.min(0)]]
      })
    });
  }

  loadContracts(): void {
    this.isLoading = true;
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.message = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'loading contracts');
        this.isLoading = false;
      }
    });
  }
   // Whenever the searchTerm changes, we call this method to filter the array
   onSearchChange(): void {
    if (!this.searchTerm) {
      // If empty, show all
      this.filteredContracts = this.contracts;
    } else {
      // Filter by contractNumber
      const lowerSearch = this.searchTerm.toLowerCase();
      this.filteredContracts = this.contracts.filter((contract) =>
        contract.contractNumber.toLowerCase().includes(lowerSearch)
      );
    }
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      this.message = 'Please correct the form errors.';
      // Mark all controls as touched so that errors are displayed.
      this.contractForm.markAllAsTouched();
      return;
    }
  
    const contractData: Contract = {
      ...this.contractForm.value,
      property: { ...this.contractForm.value.property }
    };
  
    const userId = 1; // Assuming static userId for now
  
    this.isLoading = true;
    const operation = this.selectedContract
      ? this.contractService.updateContract(this.selectedContract.id!, contractData)
      : this.contractService.createContract(userId, contractData);
  
    operation.subscribe({
      next: () => {
        this.message = `Contract ${this.selectedContract ? 'updated' : 'created'} successfully!`;
        this.loadContracts();
        this.resetForm();
      },
      error: (err) => {
        this.handleError(err, this.selectedContract ? 'updating contract' : 'creating contract');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onEdit(contract: Contract): void {
    this.selectedContract = contract;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.contractForm.patchValue({
      ...contract,
      startDate: this.formatDateForInput(contract.startDate),
      endDate: this.formatDateForInput(contract.endDate),
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 }
      
    });
  }

  onDelete(contract: Contract): void {
    if (!confirm('Delete this contract permanently?')) return;

    this.isLoading = true;
    this.contractService.deleteContract(contract.id!).subscribe({
      next: () => {
        this.message = 'Contract deleted successfully!';
        this.loadContracts();
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'deleting contract');
        this.isLoading = false;
      }
    });
  }

  private resetForm(): void {
    this.contractForm.reset();
    this.selectedContract = undefined;
    Object.keys(this.contractForm.controls).forEach(key => {
      this.contractForm.get(key)?.setErrors(null);
    });
  }

  private handleError(err: any, context: string): void {
    console.error(`Error ${context}:`, err);
    this.message = `Error ${context}. Please try again.`;
  }

  private formatDateForInput(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  // Helper method to check if a form control is invalid and has been touched or is dirty.
  isFieldInvalid(field: string): boolean {
    const control = this.contractForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
  cancelEdit(): void {
    this.selectedContract = undefined;  // Clear the selected contract
    this.contractForm.reset();          // Reset the form fields
    // If you want to clear validation errors, do this:
    Object.keys(this.contractForm.controls).forEach(key => {
      this.contractForm.get(key)?.setErrors(null);
    });
    // Optionally clear any message
    this.message = '';
  }
 

  // ... your remaining methods
}

