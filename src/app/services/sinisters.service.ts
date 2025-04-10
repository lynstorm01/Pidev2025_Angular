import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  dateofregistration: Date;
  email: string;
  type: string;
  firstname: string;
  lastname: string;
  password: string;
  phonenumber: string;
  username: string;
}

export interface Sinister {
  id: number;
  dateOfIncident: Date;
  description: string;
  status: string;
  location: string;
  evidenceFiles: string;
  typeInsurance: string;
  user: number;
  reportedDate: Date;
  dateofcreation: Date;
  
  
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
  sinister: Sinister; 
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
    formData.append('userId', claim.userId);
    formData.append('description', claim.description);
    formData.append('location', claim.location);
    formData.append('typeAssurance', claim.typeAssurance);
    formData.append('incidentDate', claim.incidentDate.toISOString());
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

  updateSinister(id: number, userId: number, userEmail: string, sinister: Sinister): Observable<Sinister> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/${id}?userId=${userId}&userEmail=${userEmail}`;
    return this.http.put<Sinister>(url, sinister, { headers });
  }
  

  deleteSinister(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  getSinisterDetailsBySinisterId(id: number): Observable<SinisterDetail[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<SinisterDetail[]>(`${this.apiUrl}/${id}/details`, { headers });
  }
  getPendingSinisters(): Observable<Sinister[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<Sinister[]>(`${this.apiUrl}/pending`, { headers });
  }
  

  getMostRecentPendingSinisterDetails(): Observable<SinisterDetail[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get<SinisterDetail[]>(`${this.apiUrl}/most-recent-pending`, { headers });
  }

  getStatusCountByDate(): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
  });
  return this.http.get(`${this.apiUrl}/status-count-by-date`, { headers });
}
//archive
  archiveSinister(id: number): Observable<Sinister> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.put<Sinister>(`${this.apiUrl}/${id}/archive`, {}, { headers });
  }
  toggleArchiveSinister(id: number): Observable<Sinister> {
     const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.put<Sinister>(`http://localhost:8069/api/admin/sinisters/${id}/toggle-archive`, {}, { headers });
  }
  getEstimatedProcessingTime(typeInsurance: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
  
    return this.http.get<string>(
      `http://localhost:8069/api/admin/sinisters/estimated-time?typeInsurance=${typeInsurance}`,
      { headers, responseType: 'text' as 'json' }
    );
  }

  


  extractTextFromDocument(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('document', file);
  
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
  
    return this.http.post(`${this.apiUrl}/extract-text`, formData, { headers, responseType: 'text' });
  }
  
  sendNotification(userId: number, message: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
      'Content-Type': 'application/x-www-form-urlencoded' // Ensures form data format
    });
  
    const body = new URLSearchParams();
    body.set('userId', userId.toString());
    body.set('message', message);
  
    return this.http.post(`${this.apiUrl}/send-notification`, body.toString(), { headers, responseType: 'text' });
  }
  getTimeSpentInEachStatus(sinisterId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM='
    });
    return this.http.get(`${this.apiUrl}/${sinisterId}/time-spent`,{ headers});
  }
  
}