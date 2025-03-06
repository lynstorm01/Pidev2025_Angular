import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'http://localhost:8069/api/email';

  constructor(private http: HttpClient) {}

  sendMentionNotification(username: string, commentText: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/mention-notification`, {
      username,
      commentText
    });
  }
}
