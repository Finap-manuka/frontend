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
}
