import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, Contract } from 'src/app/services/contract.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss']
})
export class CreateContractComponent implements OnInit {
  contractForm!: FormGroup;
  message: string = '';
  isLoading: boolean = false;

  // For two-step process:
  createdContract?: Contract;
  signatureFile?: File;

  constructor(private fb: FormBuilder, private contractService: ContractService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // Set default values: contract number begins with "CNT-" and status is "PENDING"
    this.contractForm = this.fb.group({
      contractNumber: ['CNT-', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      status: ['PENDING', Validators.required],
      property: this.fb.group({
        address: ['', Validators.required],
        area: [null, [Validators.required, Validators.min(1)]],
        propertyType: ['', Validators.required],
        value: [null, [Validators.required, Validators.min(0)]]
      })
    });
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      this.message = 'Please correct the form errors.';
      this.contractForm.markAllAsTouched();
      return;
    }

    // Ensure contractNumber has the proper prefix
    const formValue = this.contractForm.value;
    if (!formValue.contractNumber.startsWith('CNT-')) {
      formValue.contractNumber = 'CNT-' + formValue.contractNumber;
    }
    // Force status to "PENDING" (if needed)
    formValue.status = 'PENDING';

    const contractData: Contract = {
      ...formValue,
      property: { ...formValue.property }
    };

    const userId = 1; // Static userId for now
    this.isLoading = true;
    this.contractService.createContract(userId, contractData).subscribe({
      next: (created) => {
        this.message = 'Contract created successfully! Please sign the contract below.';
        // Store the created contract so we can sign it in the next step
        this.createdContract = created;
        // Optionally, clear the form so the user cannot create again.
        this.resetForm();
      },
      error: (err) => {
        this.handleError(err, 'creating contract');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.signatureFile = event.target.files[0];
    }
  }

  signContract(): void {
    if (!this.createdContract || !this.signatureFile) {
      this.message = 'Please select a signature file.';
      return;
    }
    this.isLoading = true;
    this.contractService.signeContract(this.createdContract.id!, this.signatureFile).subscribe({
      next: (signedContract) => {
        this.message = 'Contract signed successfully!';
        // Optionally update createdContract with the new data:
        this.createdContract = signedContract;
      },
      error: (err) => {
        this.handleError(err, 'signing contract');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  isFieldInvalid(field: string): boolean {
    const control = this.contractForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
  
  resetForm(): void {
    this.contractForm.reset();
    this.contractForm.patchValue({ contractNumber: 'CNT-', status: 'PENDING' });
  }

  private handleError(err: any, context: string): void {
    console.error(`Error ${context}:`, err);
    this.message = `Error ${context}. Please try again.`;
  }
}
