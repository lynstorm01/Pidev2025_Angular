import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devis } from '../models/Devis.model';


@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://localhost:8069/api/devis';

  constructor(private http: HttpClient) {}

  getAllDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(this.apiUrl+"/getAllDevis");
  }

  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.apiUrl}/${id}`);
  }

  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/ajouter-voyage", devis);
  }
  createDevisHabitation(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/ajouter-habitation", devis);
  }


  updateDevis(id: number, devis: Devis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/modifier/${id}`, devis);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  signerDevis(devisId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${devisId}/signer`, formData);
}
  
}
