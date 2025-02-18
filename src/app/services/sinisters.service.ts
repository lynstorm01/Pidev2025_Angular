import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SinistersService {
  private apiUrl = 'http://localhost:8069/api/admin/sinisters/create'; 

  constructor(private http: HttpClient) { } 

  createClaim(claim: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('description', claim.description);
    formData.append('location', claim.location);
    formData.append('typeAssurance', claim.typeAssurance);
    formData.append('document', file);

    // Add the Authorization header
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=' // Replace with the Base64-encoded credentials
    });

    return this.http.post(this.apiUrl, formData, { headers, responseType: 'text'  });
  }
}