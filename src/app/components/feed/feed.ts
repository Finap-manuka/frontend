import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../services/feed-services/feed-service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class Feed implements OnInit {
  loading = true;
  posts: any[] = [];

  newComments: { [key: number]: string } = {}; 
  editingPost: { [key: number]: boolean } = {}; // track which posts are in edit mode

  // 👤 Replace with actual logged-in user
  userId = 1; 

  // new post form
  newPost = { title: '', content: '' };

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // 🔹 Load all posts
  loadPosts(): void {
    this.loading = true;
    this.feedService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Create new post
  createPost(): void {
    if (!this.newPost.title || !this.newPost.content) return;

    this.feedService.createPost(this.newPost, this.userId).subscribe({
      next: () => {
        this.newPost = { title: '', content: '' };
        this.loadPosts();
      },
      error: (err) => console.error('Error creating post:', err)
    });
  }

  // 🔹 Enable edit mode
  startEdit(postId: number): void {
    this.editingPost[postId] = true;
  }

  // 🔹 Save updated post
  updatePost(post: any): void {
    this.feedService.updatePost(post.postId, { title: post.title, content: post.content }).subscribe({
      next: () => {
        this.editingPost[post.postId] = false;
        this.loadPosts();
      },
      error: (err) => console.error('Error updating post:', err)
    });
  }

  // 🔹 Add a comment
  addComment(postId: number): void {
    const content = this.newComments[postId];
    if (!content) return;

    this.feedService.addComment(postId, content, this.userId).subscribe({
      next: () => {
        this.newComments[postId] = '';
        this.loadPosts();
      },
      error: (err) => console.error('Error adding comment:', err)
    });
  }

  // 🔹 Like a post
  like(postId: number): void {
    this.feedService.likePost(postId, this.userId).subscribe({
      next: () => this.loadPosts(),
      error: (err) => console.error('Error liking post:', err)
    });
  }

  // 🔹 Dislike a post
  dislike(postId: number): void {
    this.feedService.dislikePost(postId, this.userId).subscribe({
      next: () => this.loadPosts(),
      error: (err) => console.error('Error disliking post:', err)
    });
  }
}
