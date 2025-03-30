import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root'
  
})

export class AuthService {
  private loggedInUser: any;
  private baseUrl = 'http://localhost:8081/user';

  constructor(private http: HttpClient,@Inject(CookieService) private cookieService: CookieService) { }

  login(email: string, password: string): Observable<any> {
    this.loggedInUser = this.http.post<any>(this.baseUrl + '/auth', { email, password });
    return this.http.post<any>(this.baseUrl + '/auth', { email, password });
  }
  getLoggedInUser(): any {
    return this.loggedInUser;
  }

  signUp(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Register', userData);
  }



  isLoggedIn(): boolean {
    // Check if authentication token exists in cookies
    return !!this.cookieService.get('token');
  }

  getUserRole(): string | null {
    const token = this.cookieService.get('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.role || null;
    }
    return null;
  }

  private decodeToken(token: string): any {
    try {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
