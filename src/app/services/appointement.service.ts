import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointement } from '../models/appointement.model'; // Assurez-vous de créer ce modèle

@Injectable({
  providedIn: 'root'
})
export class AppointementService {

  private baseUrl = 'http://localhost:8069/api/appointments'; // Remplacez l'URL par celle de votre API

  constructor(private http: HttpClient) { }

  // Créer un rendez-vous
  createAppointment(appointement: Appointement): Observable<Appointement> {
    return this.http.post<Appointement>(this.baseUrl, appointement);
  }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointement[]> {
    return this.http.get<Appointement[]>(this.baseUrl);
  }

  // Récupérer un rendez-vous par ID
  getAppointmentById(id: number): Observable<Appointement> {
    return this.http.get<Appointement>(`${this.baseUrl}/${id}`);
  }

  // Mettre à jour un rendez-vous
  updateAppointment(id: number, appointement: Appointement): Observable<Appointement> {
    return this.http.put<Appointement>(`${this.baseUrl}/${id}`, appointement);
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
