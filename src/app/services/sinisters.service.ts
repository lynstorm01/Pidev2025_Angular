import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Sinister {
  id: number;
  dateOfIncident: Date;
  description: string;
  status: string;
  location: string;
  evidenceFiles: string;
  typeInsurance: string;
  
  
}
export interface SinisterDetail {
  id: number;
  location: string;
  agentID: string;
  clientID: string;
  description: string;
  reportedDate: Date;
  status: string;
  evidenceFiles: string;
  estimatedDamageCost: number;
}
@Injectable({
  providedIn: 'root'
})
export class SinistersService {
  private apiUrl = 'http://localhost:8069/api/admin/sinisters'; // Base URL

  constructor(private http: HttpClient) { }

  // Existing methods
  getSinisters(): Observable<Sinister[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<Sinister[]>(this.apiUrl, { headers });
  }

  createClaim(claim: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('description', claim.description);
    formData.append('location', claim.location);
    formData.append('typeAssurance', claim.typeAssurance);
    formData.append('document', file);

    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });

    return this.http.post(`${this.apiUrl}/create`, formData, { headers, responseType: 'text' });
  }

  // New methods
  getSinisterById(id: number): Observable<Sinister> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<Sinister>(`${this.apiUrl}/${id}`, { headers });
  }

  updateSinister(id: number, sinister: Sinister): Observable<Sinister> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
      'Content-Type': 'application/json' // Ensure JSON is sent
    });
  
    return this.http.put<Sinister>(`${this.apiUrl}/${id}`, sinister, { headers });
  }
  

  deleteSinister(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
  getSinisterDetailsBySinisterId(id: number): Observable<SinisterDetail[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<SinisterDetail[]>(`${this.apiUrl}/${id}/details`, { headers });
  }
}