import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// User DTOs based on your backend
export interface UserDto {
  userId: number;
  name: string;
  email: string;
  role: string;
  startDate: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  startDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl; // e.g. http://localhost:5001/

  constructor(private http: HttpClient) {}

  // ==================================================
  // USER MANAGEMENT METHODS
  // ==================================================

  // Get all users
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}api/users`);
  }

  // Create new employee/user
  createNewEmployee(userData: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}new-user`, userData);
  }

  // Create new employee with default role
  addEmployee(name: string, email: string, password: string, startDate?: string): Observable<UserDto> {
    const userData: CreateUserDto = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: 'Employee', // Default role
      startDate: startDate || new Date().toISOString()
    };

    return this.createNewEmployee(userData);
  }

  // Create new admin user
  addAdmin(name: string, email: string, password: string, startDate?: string): Observable<UserDto> {
    const userData: CreateUserDto = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: 'Admin',
      startDate: startDate || new Date().toISOString()
    };

    return this.createNewEmployee(userData);
  }

  // ==================================================
  // UTILITY METHODS
  // ==================================================

  // Filter users by role
  filterUsersByRole(users: UserDto[], role: string): UserDto[] {
    return users.filter(user => user.role.toLowerCase() === role.toLowerCase());
  }

  // Get only employees
  getEmployees(): Observable<UserDto[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe({
        next: (users) => {
          const employees = this.filterUsersByRole(users, 'Employee');
          observer.next(employees);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Get only admins
  getAdmins(): Observable<UserDto[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe({
        next: (users) => {
          const admins = this.filterUsersByRole(users, 'Admin');
          observer.next(admins);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Search users by name or email
  searchUsers(users: UserDto[], searchTerm: string): UserDto[] {
    if (!searchTerm.trim()) {
      return users;
    }

    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }

  // Sort users by different criteria
  sortUsers(users: UserDto[], sortBy: 'name' | 'email' | 'role' | 'startDate', order: 'asc' | 'desc' = 'asc'): UserDto[] {
    return users.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'role':
          valueA = a.role.toLowerCase();
          valueB = b.role.toLowerCase();
          break;
        case 'startDate':
          valueA = new Date(a.startDate);
          valueB = new Date(b.startDate);
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  isValidPassword(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: 'Password is valid' };
  }

  // Check if email already exists
  isEmailExists(users: UserDto[], email: string): boolean {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // ==================================================
  // FORMATTING HELPERS
  // ==================================================

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format role for display
  formatRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  // Get user statistics
  getUserStats(users: UserDto[]): {
    totalUsers: number;
    totalEmployees: number;
    totalAdmins: number;
    recentUsers: number; // Users added in last 30 days
  } {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const employees = this.filterUsersByRole(users, 'Employee');
    const admins = this.filterUsersByRole(users, 'Admin');
    const recentUsers = users.filter(user => 
      new Date(user.startDate) >= thirtyDaysAgo
    );

    return {
      totalUsers: users.length,
      totalEmployees: employees.length,
      totalAdmins: admins.length,
      recentUsers: recentUsers.length
    };
  }
}