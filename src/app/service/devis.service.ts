import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devis } from '../model/Devis.model';


@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://localhost:8080/api/devis'; // Change the URL according to your backend

  constructor(private http: HttpClient) {}

  // Get all devis
  getAllDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(this.apiUrl);
  }

  // Get devis by ID
  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.apiUrl}/${id}`);
  }

  // Create a new devis
  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/ajouter", devis);
  }

  // Update an existing devis
  updateDevis(id: number, devis: Devis): Observable<Devis> {
    return this.http.put<Devis>(`http://localhost:8080/api/devis/modifier/${id}`, devis);
  }

  // Delete a devis
  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
