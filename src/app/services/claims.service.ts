import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';

import { tap } from 'rxjs/operators';
import { TwilioService } from './TwilioService';


// Si vous avez créé un environnement, vous pouvez l'utiliser sinon définissez directement l'URL
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  // Vous pouvez définir votre API URL ici directement si vous n'utilisez pas d'environnement :
  private apiUrl = 'http://localhost:8069/api/claims';
  // Si vous utilisez un fichier d'environnement, décommentez la ligne suivante :
  // private apiUrl = `${environment.apiUrl}/api/claims`;

  constructor(private http: HttpClient, private twilioService: TwilioService) { }


  // Récupérer toutes les réclamations
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  // Récupérer une réclamation par son ID
  getClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle réclamation
  createClaim(claim: Claim, userPhoneNumber: string): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim).pipe(
      tap(() => {
        const message = `We’ve received your claim. Processing in progress ${claim.status}`;
        this.twilioService.sendSms(userPhoneNumber, message).subscribe();
      })
    );
  }

  // Mettre à jour une réclamation
  updateClaim(id: number, claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}`, claim);
  }

  // Supprimer une réclamation
  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
