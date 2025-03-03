import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'http://localhost:8069/api/Blog'; // Your backend URL for Blog

  constructor(private http: HttpClient) {}

  // Get all posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // Get a post by ID
  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`); // Path for getting a post by ID
  }

  // Create a new post
  createPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, post); // Path for adding a new post
  }

  // Update an existing post
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, post);
  }

  // Delete a post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updatePostStatus(postId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status/${postId}`, { status });
  }
}

