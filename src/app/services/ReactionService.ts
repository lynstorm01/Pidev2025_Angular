// reaction.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { MockAuthService } from "./MockAuthService";

@Injectable({
  providedIn: "root",
})
export class ReactionService {
  private apiUrl = "http://localhost:8069/api/reactions";

  constructor(private http: HttpClient,
    private authService: MockAuthService

  ) {}

  reactToPost(postId: number, reactionType: string): Observable<any> {
    const userId = this.authService.getCurrentUser()?.id; // fallback

    const headers = new HttpHeaders({
      'X-User-ID': userId.toString()
    });

    const params = new HttpParams().set('type', reactionType);

    console.log('📤 Sending reaction request:', {
      url: `${this.apiUrl}/${postId}`,
      headers: { 'X-User-ID': userId },
      params: { type: reactionType }
    });

    return this.http.post(`${this.apiUrl}/${postId}`, null, { headers, params });
  }
  
  getReactionCounts(postId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${postId}/counts`
    );
  }

  getUserReaction(postId: number, userId: number): Observable<string | null> {
    return this.http.get<string | null>(`${this.apiUrl}/${postId}/user`, {
      headers: { 'X-User-ID': userId.toString() }
    });
  }

  removeReaction(postId: number) {
    const userId = this.authService.getCurrentUser()?.id ; // fallback
  
    const headers = new HttpHeaders({
      'X-User-ID': userId.toString()
    });
  
    console.log('📤 Sending remove reaction request:', {
      url: `${this.apiUrl}/${postId}/remove-reaction`,
      headers: { 'X-User-ID': userId }
    });
  
    return this.http.post(`${this.apiUrl}/${postId}/remove-reaction`, null, { headers });
  }
  
}
