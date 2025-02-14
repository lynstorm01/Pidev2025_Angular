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

@Injectable({
  providedIn: 'root'
})
export class SinistersService {
  private apiUrl = 'http://localhost:8069/api/admin/sinisters'; // Base URL

  constructor(private http: HttpClient) { }

  // Existing create method
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

  // New method to fetch all sinisters
  getSinisters(): Observable<Sinister[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });

    return this.http.get<Sinister[]>(this.apiUrl, { headers });
  }
}