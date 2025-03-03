import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  private baseUrl = 'http://localhost:8069/api/reply'; // Your backend URL for Replies

  constructor(private http: HttpClient) {}

  // Get all replies for a specific comment
  getReplies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // Get a reply by ID
  getReplyById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`); // Path for getting a reply by ID
  }

  // Create a new reply
  createReply(reply: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, reply); // Path for adding a new reply
  }

  // Update an existing reply
  updateReply(id: number, reply: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, reply);
  }

  // Delete a reply
  deleteReply(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
