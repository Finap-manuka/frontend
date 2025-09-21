import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private baseUrl = environment.apiUrl; // e.g. http://localhost:5001/

  constructor(private http: HttpClient) {}

  // 🔹 Get all posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/post`);
  }

  // 🔹 Create new post
  createPost(dto: any, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/post?userId=${userId}`, dto);
  }

  // 🔹 Update post
  updatePost(postId: number, dto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}api/post/${postId}`, dto);
  }

  // 🔹 Delete post
  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/post/${postId}`);
  }

  // 🔹 Add comment to a post
  addComment(postId: number, content: string, userId: number): Observable<any> {
    const payload = { content };
    return this.http.post(`${this.baseUrl}api/comments/${postId}?userId=${userId}`, payload);
  }

  // 🔹 Update comment
  updateComment(commentId: number, content: string): Observable<any> {
    return this.http.put(`${this.baseUrl}api/comments/${commentId}`, { content });
  }

  // 🔹 Delete comment
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/comments/${commentId}`);
  }

  // 🔹 Like a post
  likePost(postId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/interactions/${postId}?userId=${userId}`, { isLike: true });
  }

  // 🔹 Dislike a post
  dislikePost(postId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/interactions/${postId}?userId=${userId}`, { isLike: false });
  }

  storeUserData(userId: number, name: string): void {
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userName', name);
    localStorage.setItem('isLoggedIn', 'true');
    console.log('✅ User data stored:', { userId, name });
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getCurrentUser(): { userId: number; name: string } | null {
    const userId = this.getUserId();
    const userName = this.getUserName();
    
    if (userId && userName) {
      return { userId, name: userName };
    }
    return null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    console.log('🚪 User logged out, localStorage cleared');
  }

  hasStoredUserData(): boolean {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    return !!(userId && userName && isLoggedIn === 'true');
  }
  
}
