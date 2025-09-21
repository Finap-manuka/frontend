import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  filteredPosts: any[] = [];

  // User data from localStorage
  currentUser: { userId: number; name: string } | null = null;

  // Filter and Sort
  authorFilter = '';
  sortBy: 'newest' | 'most-liked' = 'most-liked';

  newComments: { [key: number]: string } = {};
  editingPost: { [key: number]: boolean } = {};
  editingComment: { [key: number]: boolean } = {};

  // new post form
  newPost = { title: '', content: '' };
  showCreateForm = false;

  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private feedService: FeedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if we're in browser environment first
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('SSR environment detected, skipping localStorage check');
      return;
    }

    // Get user data from localStorage via FeedService
    this.currentUser = this.feedService.getCurrentUser();
    
    if (!this.currentUser) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Current user loaded:', this.currentUser);
    this.loadPosts();
  }

  // Load all posts
  loadPosts(): void {
    this.loading = true;
    this.feedService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
        this.applyFiltersAndSort();
        this.loading = false;
        console.log('Posts loaded:', res);
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.errorMessage = 'Failed to load posts. Please try again.';
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  // Apply filters and sorting to posts
  applyFiltersAndSort(): void {
    let filtered = [...this.posts];

    // Filter by author name if specified
    if (this.authorFilter.trim()) {
      filtered = filtered.filter(post => 
        post.author?.name?.toLowerCase().includes(this.authorFilter.toLowerCase())
      );
    }

    // Sort posts
    if (this.sortBy === 'most-liked') {
      filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else {
      // Sort by newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    this.filteredPosts = filtered;
  }

  // Check if a post is trending (more than 5 likes)
  isTrendingPost(post: any): boolean {
    return (post.likeCount || 0) > 5;
  }

  // Handle filter/sort changes
  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  // Clear filters
  clearFilters(): void {
    this.authorFilter = '';
    this.sortBy = 'most-liked';
    this.applyFiltersAndSort();
  }

  // Create new post
  createPost(): void {
    const userId = this.feedService.getUserId();
    if (!userId || !this.newPost.title.trim() || !this.newPost.content.trim()) {
      this.errorMessage = 'Please fill in all fields.';
      this.clearMessages();
      return;
    }

    const postDto = {
      title: this.newPost.title.trim(),
      content: this.newPost.content.trim()
    };

    this.feedService.createPost(postDto, userId).subscribe({
      next: () => {
        console.log('Post created successfully');
        this.newPost = { title: '', content: '' };
        this.showCreateForm = false;
        this.successMessage = 'Post created successfully!';
        this.loadPosts();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error creating post:', err);
        this.errorMessage = 'Failed to create post. Please try again.';
        this.clearMessages();
      }
    });
  }

  // Enable edit mode
  startEdit(postId: number): void {
    this.editingPost[postId] = true;
  }

  // Cancel edit mode
  cancelEdit(postId: number): void {
    this.editingPost[postId] = false;
    this.loadPosts();
  }

  // Save updated post
  updatePost(post: any): void {
    if (!post.title?.trim() || !post.content?.trim()) {
      this.errorMessage = 'Please fill in all fields.';
      this.clearMessages();
      return;
    }

    const updateDto = {
      title: post.title.trim(),
      content: post.content.trim()
    };

    this.feedService.updatePost(post.postId, updateDto).subscribe({
      next: () => {
        console.log('Post updated successfully');
        this.editingPost[post.postId] = false;
        this.successMessage = 'Post updated successfully!';
        this.loadPosts();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error updating post:', err);
        this.errorMessage = 'Failed to update post. Please try again.';
        this.clearMessages();
      }
    });
  }

  // Delete post
  deletePost(postId: number): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.feedService.deletePost(postId).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        this.successMessage = 'Post deleted successfully!';
        this.loadPosts();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.errorMessage = 'Failed to delete post. Please try again.';
        this.clearMessages();
      }
    });
  }

  // Toggle create form visibility
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.newPost = { title: '', content: '' };
    }
  }
  
  // Cancel post creation
  cancelPost(): void {
    this.showCreateForm = false;
    this.newPost = { title: '', content: '' };
  }

  // Add a comment
  addComment(postId: number): void {
    const userId = this.feedService.getUserId();
    const content = this.newComments[postId];
    
    if (!userId || !content?.trim()) {
      return;
    }

    this.feedService.addComment(postId, content.trim(), userId).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.newComments[postId] = '';
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.errorMessage = 'Failed to add comment.';
        this.clearMessages();
      }
    });
  }

  // Edit comment
  editComment(comment: any): void {
    const newContent = prompt('Edit your comment:', comment.content);
    
    if (newContent && newContent.trim() && newContent.trim() !== comment.content) {
      this.updateComment(comment.commentId, newContent.trim());
    }
  }

  // Update comment
  updateComment(commentId: number, newContent: string): void {
    if (!newContent.trim()) {
      return;
    }

    this.feedService.updateComment(commentId, newContent.trim()).subscribe({
      next: () => {
        console.log('Comment updated successfully');
        this.successMessage = 'Comment updated successfully!';
        this.loadPosts();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.errorMessage = 'Failed to update comment.';
        this.clearMessages();
      }
    });
  }

  // Delete comment
  deleteComment(commentId: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.feedService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully');
        this.successMessage = 'Comment deleted successfully!';
        this.loadPosts();
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this.errorMessage = 'Failed to delete comment.';
        this.clearMessages();
      }
    });
  }

  // Like a post
  like(postId: number): void {
    const userId = this.feedService.getUserId();
    if (!userId) return;

    this.feedService.likePost(postId, userId).subscribe({
      next: () => {
        console.log('Post liked successfully');
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error liking post:', err);
        this.errorMessage = 'Failed to like post.';
        this.clearMessages();
      }
    });
  }

  // Dislike a post
  dislike(postId: number): void {
    const userId = this.feedService.getUserId();
    if (!userId) return;

    this.feedService.dislikePost(postId, userId).subscribe({
      next: () => {
        console.log('Post disliked successfully');
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error disliking post:', err);
        this.errorMessage = 'Failed to dislike post.';
        this.clearMessages();
      }
    });
  }

  // Check if current user owns the post
  canEditPost(post: any): boolean {
    const currentUserId = this.feedService.getUserId();
    return currentUserId === post.author?.userId || currentUserId === post.userId;
  }

  // Check if current user owns the comment
  canEditComment(comment: any): boolean {
    const currentUserId = this.feedService.getUserId();
    return currentUserId === comment.author?.userId || currentUserId === comment.userId;
  }

  // Logout function
  logout(): void {
    this.feedService.logout();
    this.router.navigate(['/']);
  }

  // Clear messages after a delay
  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}