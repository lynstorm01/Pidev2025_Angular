import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8069/api/Comment'; // Your backend URL for Comments

  constructor(private http: HttpClient) {}

  // Get all comments
  getComments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // Get a comment by ID
  getCommentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`); // Path for getting a comment by ID
  }

  // Create a new comment
  createComment(comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, comment); // Path for adding a new comment
  }

  // Update an existing comment
  updateComment(id: number, comment: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, comment);
  }

  // Delete a comment
  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
