import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserDto, CreateUserDto } from '../../services/admin-services/admin-service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagement implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  loading = false;
  
  // Search and filter
  searchTerm = '';
  roleFilter = 'all'; // 'all', 'employee', 'admin'
  sortBy: 'name' | 'email' | 'role' | 'startDate' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Add user modal
  showAddUserModal = false;
  newUser: CreateUserDto = {
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    startDate: new Date().toISOString().split('T')[0]
  };
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // User stats
  userStats = {
    totalUsers: 0,
    totalEmployees: 0,
    totalAdmins: 0,
    recentUsers: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users
  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.updateStats();
        this.loading = false;
        console.log('Users loaded:', users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  // Apply search and filter
  applyFilters(): void {
    let filtered = [...this.users];
    
    // Apply search
    if (this.searchTerm.trim()) {
      filtered = this.adminService.searchUsers(filtered, this.searchTerm);
    }
    
    // Apply role filter
    if (this.roleFilter !== 'all') {
      filtered = this.adminService.filterUsersByRole(filtered, this.roleFilter);
    }
    
    // Apply sorting
    filtered = this.adminService.sortUsers(filtered, this.sortBy, this.sortOrder);
    
    this.filteredUsers = filtered;
  }

  // Handle search change
  onSearchChange(): void {
    this.applyFilters();
  }

  // Handle filter change
  onFilterChange(): void {
    this.applyFilters();
  }

  // Handle sort change
  onSortChange(): void {
    this.applyFilters();
  }

  // Toggle sort order
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  // Clear all filters
  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  // Update user statistics
  updateStats(): void {
    this.userStats = this.adminService.getUserStats(this.users);
  }

  // Show add user modal
  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.resetNewUserForm();
  }

  // Close add user modal
  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.resetNewUserForm();
  }

  // Reset new user form
  resetNewUserForm(): void {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'Employee',
      startDate: new Date().toISOString().split('T')[0]
    };
  }

  // Add new user
  addUser(): void {
    // Validate form
    if (!this.validateNewUser()) {
      return;
    }

    this.loading = true;
    this.adminService.createNewEmployee(this.newUser).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        this.successMessage = `User ${user.name} created successfully!`;
        this.closeAddUserModal();
        this.loadUsers(); // Reload users list
        this.clearMessages();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.errorMessage = 'Failed to create user. Please try again.';
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  // Validate new user form
  validateNewUser(): boolean {
    // Check required fields
    if (!this.newUser.name.trim()) {
      this.errorMessage = 'Name is required.';
      this.clearMessages();
      return false;
    }

    if (!this.newUser.email.trim()) {
      this.errorMessage = 'Email is required.';
      this.clearMessages();
      return false;
    }

    if (!this.newUser.password.trim()) {
      this.errorMessage = 'Password is required.';
      this.clearMessages();
      return false;
    }

    // Validate email format
    if (!this.adminService.isValidEmail(this.newUser.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.clearMessages();
      return false;
    }

    // Check if email already exists
    if (this.adminService.isEmailExists(this.users, this.newUser.email)) {
      this.errorMessage = 'Email already exists. Please use a different email.';
      this.clearMessages();
      return false;
    }

    // Validate password
    const passwordValidation = this.adminService.isValidPassword(this.newUser.password);
    if (!passwordValidation.valid) {
      this.errorMessage = passwordValidation.message;
      this.clearMessages();
      return false;
    }

    return true;
  }

  // Format date for display
  formatDate(dateString: string): string {
    return this.adminService.formatDate(dateString);
  }

  // Format role for display
  formatRole(role: string): string {
    return this.adminService.formatRole(role);
  }

  // Clear messages after delay
  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}