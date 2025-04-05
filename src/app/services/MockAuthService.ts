// src/app/services/mock-auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.createMockUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private createMockUser() {
    return {
      id: 1,
      username: 'dev_user',
      firstName: 'John',
      lastName: 'Doe',
      password: 'mockPassword123', // Note: In real app, never expose passwords
      dateOfRegistration: new Date('2023-01-01'),
      email: 'dev.user@example.com',
      phoneNumber: '+1234567890',
      role: Role.ADMIN
    };
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  login() {
    this.currentUserSubject.next(this.createMockUser());
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  // Optional: Simulate different users
  loginAsAdmin() {
    this.currentUserSubject.next({
      ...this.createMockUser(),
      role: Role.ADMIN
    });
  }

  loginAsRegularUser() {
    this.currentUserSubject.next({
      ...this.createMockUser(),
      id: 2,
      username: 'regular_user',
      role: Role.USER
    });
  }
}