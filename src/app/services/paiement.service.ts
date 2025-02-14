import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paiement } from '../model/Paiement.model';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:8080/api/paiements'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}



  payerEnUneFois(devisId: number, method: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payer-en-une-fois/${devisId}?method=${method}`, {});
  }

  

  payerEnPlusieursFois(devisId: number, nombreEcheances: number, method: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payer-en-plusieurs-fois/${devisId}?nombreEcheances=${nombreEcheances}&method=${method}`, {});
  }



  getPaiementsByDevis(devisId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`http://localhost:8080/api/paiements/devis/${devisId}`);
  }

}
