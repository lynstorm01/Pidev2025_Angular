import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:8086/api/offres'; // Remplace avec l'URL de ton backend



  constructor(private http: HttpClient) {}

  // 🔹 Récupérer toutes les offres partenaires
  getAllOffres(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔹 Ajouter une nouvelle offre
  createOffre(offre: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, offre);
  }

  // 🔹 Mettre à jour une offre existante
  updateOffre(id: number, offre: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, offre);
  }

  // 🔹 Supprimer une offre
  deleteOffre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
