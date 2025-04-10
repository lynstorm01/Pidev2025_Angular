import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private emailApiUrl = 'http://localhost:8069/api/claims/sendEmail';  // Replace with your email API URL

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const emailData = {
      to: to,
      subject: subject,
      body: body
    };

    return this.http.post<any>(this.emailApiUrl, emailData);
  }
}
