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
}
