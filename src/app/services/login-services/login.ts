import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}api/auth/login`, data);
  }

  storeUserData(userId: number, name: string): void {
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userName', name);
    localStorage.setItem('isLoggedIn', 'true');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Clear user data on logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
  }
}
