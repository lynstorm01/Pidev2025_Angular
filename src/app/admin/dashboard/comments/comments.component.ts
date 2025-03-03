import { Component } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';

declare var bootstrap: any; // Required for Bootstrap modal handling


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  searchText: string = '';
  selectedCommentUpdate: Comment = {} as Comment;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.getAllComments();
  }

  // Fetch all comments from the service
  getAllComments(): void {
    this.commentService.getComments().subscribe((data) => {
      this.comments = data;
      this.applySearchFilter();
    });
  }

  // Search & Filter Comments
  applySearchFilter(): void {
    this.filteredComments = this.comments.filter(comment => 
      comment.content.toLowerCase().includes(this.searchText.toLowerCase()) ||
      comment.userId.toString().includes(this.searchText) ||
      comment.postId.toString().includes(this.searchText)
    );
    this.updatePagination();
  }

  // Confirm before deleting a comment
  confirmDelete(commentId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this comment?');
    if (confirmation) {
      this.deleteComment(commentId);
    }
  }

  // Delete a comment
  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== commentId);
      this.applySearchFilter();
    });
  }

  // Open the update modal
  openUpdateModal(comment: Comment): void {
    this.selectedCommentUpdate = { ...comment };
    const updateModal = new bootstrap.Modal(document.getElementById('updateCommentModal')!);
    updateModal.show();
  }

  // Update the comment
  updateComment(): void {
    this.commentService.updateComment(this.selectedCommentUpdate.id!, this.selectedCommentUpdate)
      .subscribe(() => {
        this.getAllComments();
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateCommentModal')!);
        updateModal?.hide();
      });
  }

  // Pagination functions
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredComments.length / this.itemsPerPage);
    this.filteredComments = this.filteredComments.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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
}

