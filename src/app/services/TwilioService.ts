import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private twilioApiUrl = 'http://localhost:8069/api/twilio/sendSms'; // Mettez l'URL correcte de votre backend

  constructor(private http: HttpClient) {}

  sendSms(to: string, message: string): Observable<any> {
    return this.http.post(this.twilioApiUrl, { to, message });
  }
}
