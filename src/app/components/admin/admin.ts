import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeedService } from '../../services/feed-services/feed-service';
import { UserManagement } from '../user-management/user-management';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, UserManagement],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  // Admin user info from localStorage
  currentUser: { userId: number; name: string } | null = null;
  adminName = '';
  adminRole = 'Administrator'; // Default role, you can get this from backend later
  
  // Active section for sidebar navigation
  activeSection = 'users';
  
  // Sidebar state
  sidebarCollapsed = false;

  constructor(
    private router: Router,
    private feedService: FeedService
  ) {}

  ngOnInit(): void {
    // Check if we're in browser environment first
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('SSR environment detected, skipping localStorage check');
      return;
    }

    // Get user data from localStorage
    this.currentUser = this.feedService.getCurrentUser();
    
    if (!this.currentUser) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // Set admin name from localStorage
    this.adminName = this.currentUser.name;
    
    console.log('Admin dashboard loaded for user:', this.currentUser);
  }

  // Set active sidebar section
  setActiveSection(section: string): void {
    this.activeSection = section;
    console.log('Active section changed to:', section);
  }

  // Toggle sidebar collapse
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Logout function
  logout(): void {
    // Clear user data from localStorage
    this.feedService.logout();
    this.router.navigate(['/']);
  }
}