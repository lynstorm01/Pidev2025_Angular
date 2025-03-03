import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';


declare var bootstrap: any; // Required for Bootstrap modal handling

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  posts: any[] = [];
  paginatedPosts: any[] = [];
  currentPage: number = 1;
  postsPerPage: number = 15;
  totalPages: number = 1;
  searchQuery: string = ''; // For holding the search input
  selectedPost: any; // Post data
  modalInstanceDetails!: any; // Instance for the post details modal  
  modalInstanceUpdate!: any;  // Instance for the update post modal

  selectedPostUpdate: any = {
    title: '',
    content: '',
    category: '',
    userId: null
  };



  @ViewChild('postDetailsModal') postDetailsModal!: ElementRef;
  @ViewChild('updatePostModal') updatePostModal!: ElementRef; // Reference to the modal element


  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngAfterViewInit() {
    const modalElement = this.postDetailsModal.nativeElement;
    this.modalInstanceDetails = new bootstrap.Modal(modalElement);    

    const updateModalElement = this.updatePostModal.nativeElement;
    this.modalInstanceUpdate = new bootstrap.Modal(updateModalElement);
  }

  

  loadPosts(): void {
    this.postService.getPosts().subscribe((data: any[]) => {
      // Assuming 'comments' is an array of comment objects and 'replyIds' is an array of replies
      this.posts = data.map(post => ({
        ...post,
        commentCount: post.comments ? post.comments.length : 0,
      }));
      this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
      this.updatePagination();
    });
  }

  // Update post status
  updateStatus(postId: number, newStatus: string): void {
    this.postService.updatePostStatus(postId, newStatus).subscribe(response => {
      console.log(`Post ${postId} updated to ${newStatus}`);
    }, error => {
      console.error('Error updating status', error);
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Filter posts based on the search query
filterPosts(): void {
  if (this.searchQuery) {
    this.paginatedPosts = this.posts.filter(post => 
      post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      post.status.toLowerCase().includes(this.searchQuery.toLowerCase()) // Add search by status
    );
  } else {
    this.updatePagination(); // Reset to paginated posts if search is cleared
  }
}

  
  // Method to confirm and delete a post
  confirmDelete(postId: number, event: Event): void {
    event.stopPropagation(); // Prevent click from bubbling up
    const confirmation = window.confirm('Are You Sure You Want to Delete This Post!');
    if (confirmation) {
      this.deletePost(postId);
    }
  }
  

  // Method to delete a post
  deletePost(postId: number): void {
    // Call the service to delete the post from the backend
    this.postService.deletePost(postId).subscribe(() => {
      // Remove the post from the local posts array after deletion
      this.posts = this.posts.filter(post => post.id !== postId);
      this.updatePagination(); // Recalculate the pagination after deletion
    });
  }

  // Fetch post by ID before showing details
  openDetails(postId: number) {
    this.postService.getPostById(postId).subscribe(
      (post) => {
        this.selectedPost = {
          ...post,
          createdAt: post.createdAt || 'N/A', // Fallback for createdAt
          lastUpdatedAt: post.lastUpdatedAt , // Fallback for lastUpdatedAt
          comments: post.comments || [], // Fallback for commentCount
          replyIds: post.replyIds || [], // Fallback for replyIds
          nbr_like: post.nbr_like || 0, // Fallback for nbr_like
          nbr_dislike: post.nbr_dislike || 0 // Fallback for nbr_dislike
        };
        this.modalInstanceDetails?.show(); // Show the modal
      },
      (error) => {
        console.error('Error fetching post details:', error);
      }
    );
  }

  openUpdateModal(post: any) {
    this.selectedPostUpdate = { ...post }; // Copy the selected post data
    const updateModal = new bootstrap.Modal(document.getElementById('updatePostModal')!);
    updateModal.show();
  }
  

  updatePost() {
    if (!this.selectedPostUpdate) {
      console.error("No post selected for update!");
      return;
    }
  
    const updatedPost = {
      title: this.selectedPostUpdate.title,
      content: this.selectedPostUpdate.content,
      category: this.selectedPostUpdate.category,
      userId: this.selectedPostUpdate.userId
    };
  
    console.log(updatedPost);
  
    this.postService.updatePost(this.selectedPostUpdate.id, updatedPost).subscribe(
      (response) => {
        console.log('Post updated successfully!', response);
  
        // Ensure modalInstanceUpdate is properly initialized before hiding
        if (this.modalInstanceUpdate) {
          this.modalInstanceUpdate.hide();
        } else {
          const modalElement = document.getElementById('updatePostModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();
          }
        }
        this.loadPosts();
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }
  
  




}

















