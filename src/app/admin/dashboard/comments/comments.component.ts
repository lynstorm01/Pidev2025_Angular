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
  itemsPerPage: number = 15;
  totalPages: number = 1;

  selectedComment!: any;

  filterByEdited?: boolean;
filterByReplies?: boolean;

// New filter variables
selectedYear?: number;
selectedMonth?: number;
yearsList: number[] = [];
// Array of month names
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.getAllComments();
    this.generateYearsList();

  }

  // Fetch all comments from the service
  getAllComments(): void {
    this.commentService.getComments().subscribe((data) => {
      this.comments = data;
      this.applySearchFilter();
    });
  }

  

  // Generate the last 5 years for the dropdown
  generateYearsList(): void {
    const currentYear = new Date().getFullYear();
    this.yearsList = [];
    for (let i = 0; i < 5; i++) {
      this.yearsList.push(currentYear - i);
    }
  }

// Apply the search and filter conditions
applySearchFilter(): void {
  let filtered = [...this.comments];

  // Apply search text filter
  if (this.searchText) {
    const search = this.searchText.toLowerCase();
    filtered = filtered.filter(comment =>
      comment.content?.toLowerCase().includes(search) ||
      (comment.username && comment.username.toLowerCase().includes(search)) ||
      (comment.postTitle && comment.postTitle.toLowerCase().includes(search))
    );
  }

  // Apply Edited filter
  if (this.filterByEdited !== undefined) {
    filtered = filtered.filter(comment => comment.isEdited === this.filterByEdited);
  }

  // Apply Replies filter
  if (this.filterByReplies !== undefined) {
    filtered = filtered.filter(comment =>
      this.filterByReplies ? (comment.repliesId?.length ?? 0) > 0 : (comment.repliesId?.length ?? 0) === 0
    );
  }

  // Apply Year filter
  if (this.selectedYear !== undefined) {
    filtered = filtered.filter(comment => {
      const commentYear = new Date(comment.createdAt).getFullYear();
      return commentYear === this.selectedYear;
    });
  }

  // Apply Month filter
  if (this.selectedMonth !== undefined) {
    filtered = filtered.filter(comment => {
      const commentDate = new Date(comment.createdAt);
      return commentDate.getMonth() === this.selectedMonth;
    });
  }

  this.filteredComments = filtered;
  this.updatePagination();
}

// New method to update filters
setFilter(type: string, value: boolean | undefined): void {
    if (type === 'edited') {
        this.filterByEdited = value;
    } else if (type === 'replies') {
        this.filterByReplies = value;
    }
    this.applySearchFilter();
}

// Set Year filter
setYearFilter(year: number | undefined): void {
  this.selectedYear = year;
  this.applySearchFilter();
}

// Set Month filter
setMonthFilter(month: number | undefined): void {
  this.selectedMonth = month;
  this.applySearchFilter();
}

// Reset all filters to "All"
resetFilters(): void {
  this.selectedYear = undefined;
  this.selectedMonth = undefined;
  this.filterByEdited = undefined;
  this.filterByReplies = undefined;
  this.applySearchFilter(); // Reset all filters
}


  // This method checks if all filters are in their default state (undefined)
  isFiltersReset(): boolean {
    return this.filterByEdited === undefined &&
           this.filterByReplies === undefined &&
           this.selectedYear === undefined &&
           this.selectedMonth === undefined;
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
    console.log(this.selectedCommentUpdate);
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

  openReadModal(commentId: number): void {
    // Find the comment by ID
    const foundComment = this.comments.find(comment => comment.id === commentId);

    if (foundComment) {
        this.selectedComment = foundComment;
        const modal = new bootstrap.Modal(document.getElementById('readCommentModal'));
        modal.show();
    } else {
        console.error('Comment not found');
    }
}


  
}

