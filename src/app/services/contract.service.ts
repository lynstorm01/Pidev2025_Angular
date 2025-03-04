import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Contract {
  id?: number;
  contractNumber: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  property: {
    address: string;
    area: number;
    propertyType: string;
    value: number;
  }
  //userid: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = 'http://localhost:8069/api/contracts'; // Fixed URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ✅ GET: Fetch all contracts
  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ POST: Create a new contract
  createContract( contract: Contract): Observable<Contract> {
    const payload = {
      ...contract,
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 } // Ensures property is defined
    };

    return this.http.post<Contract>(
      this.baseUrl, // No extra slash
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ PUT: Update an existing contract
  updateContract(contractId: number, contract: Contract): Observable<Contract> {
    if (!contractId) return throwError(() => new Error('Invalid contract ID'));

    const payload = {
      ...contract,
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 } // Ensures property is defined
    };

    return this.http.put<Contract>(
      `${this.baseUrl}/${contractId}`, // Ensuring correct URL
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ DELETE: Remove a contract
  deleteContract(contractId: number): Observable<void> {
    if (!contractId) return throwError(() => new Error('Invalid contract ID'));

    return this.http.delete<void>(
      `${this.baseUrl}/${contractId}`, // Ensuring correct URL
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Improved error handling
  private handleError(error: any) {
    console.error('Error details:', error);

    let errorMessage = 'Server error. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else if (!error.status) {
      // Network error
      errorMessage = 'Network error - check your connection.';
    } else if (error.status === 404) {
      errorMessage = 'Requested resource not found.';
    } else {
      errorMessage = `Backend error (code ${error.status}): ${error.message || 'Unknown error'}`;
    }

    return throwError(() => new Error(errorMessage));
  }


  
  signeContract(contractId: number, signatureFile: File): Observable<Contract> {
  const formData = new FormData();
  formData.append('signature', signatureFile);
  return this.http.put<Contract>(`${this.baseUrl}/${contractId}/signer`, formData);
}

getContractById(id: number): Observable<Contract> {
  return this.http.get<Contract>(`${this.baseUrl}/${id}`);
}

// ✅ Fetch contracts by user ID
getContractsByUserId(userId: number): Observable<Contract[]> {
  return this.http.get<Contract[]>(`${this.baseUrl}/user/${userId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}



}
