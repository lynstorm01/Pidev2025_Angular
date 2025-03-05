import { Component } from '@angular/core';
import { Reply } from 'src/app/models/reply.model';
import { ReplyService } from 'src/app/services/reply.service';

declare var bootstrap: any;


@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent {

  replies: Reply[] = [];
  filteredReplies: Reply[] = [];
  searchText: string = '';
  selectedReplyUpdate: Reply = {} as Reply;
  pagedReplies: any[] = []; // Holds current page data

  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 1;

  selectedReply!: any;

  filterByEdited?: boolean;

  // New filter variables
  selectedYear?: number;
  selectedMonth?: number;
  yearsList: number[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  filterByReplies?: boolean ;

  constructor(private replyService: ReplyService) {}

  ngOnInit(): void {
    this.getAllReplies();
    this.generateYearsList();
  }

  // Fetch all replies from the service
  getAllReplies(): void {
    this.replyService.getReplies().subscribe((data) => {
      this.replies = data;
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
    let filtered = [...this.replies];

    // Apply search text filter
  if (this.searchText) {
    const search = this.searchText.toLowerCase();
    filtered = filtered.filter(reply =>
      reply.content?.toLowerCase().includes(search) ||  // Search in reply content
      (reply.username && reply.username.toLowerCase().includes(search)) ||  // Search in username
      (reply.commentContent && reply.commentContent.toLowerCase().includes(search))  // Search in comment content
    );
  }

    // Apply Edited filter
    if (this.filterByEdited !== undefined) {
      filtered = filtered.filter(reply => reply.isEdited === this.filterByEdited);
    }

    // Apply Year filter
    if (this.selectedYear !== undefined) {
      filtered = filtered.filter(reply => {
        const replyYear = new Date(reply.createdAt).getFullYear();
        return replyYear === this.selectedYear;
      });
    }

    // Apply Month filter
    if (this.selectedMonth !== undefined) {
      filtered = filtered.filter(reply => {
        const replyDate = new Date(reply.createdAt);
        return replyDate.getMonth() === this.selectedMonth;
      });
    }

    this.filteredReplies = filtered;
    this.updatePagination();
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

  // New method to update filters
setFilter(type: string, value: boolean | undefined): void {
  if (type === 'edited') {
      this.filterByEdited = value;
  } else if (type === 'replies') {
      this.filterByReplies = value;
  }
  this.applySearchFilter();
}

  // Reset all filters to "All"
  resetFilters(): void {
    this.selectedYear = undefined;
    this.selectedMonth = undefined;
    this.filterByEdited = undefined;
    this.applySearchFilter();
  }

  isFiltersReset(): boolean {
    return this.filterByEdited === undefined &&
           this.selectedYear === undefined &&
           this.selectedMonth === undefined;
  }

  // Confirm before deleting a reply
  confirmDelete(replyId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this reply?');
    if (confirmation) {
      this.deleteReply(replyId);
    }
  }

  // Delete a reply
  deleteReply(replyId: number): void {
    this.replyService.deleteReply(replyId).subscribe(() => {
      this.replies = this.replies.filter(reply => reply.id !== replyId);
      this.applySearchFilter();
    });
  }

  // Open the update modal
  openUpdateModal(reply: Reply): void {
    this.selectedReplyUpdate = { ...reply };
    const updateModal = new bootstrap.Modal(document.getElementById('updateReplyModal')!);
    updateModal.show();
  }

  updateReply(): void {
    const replyRequest = {
      postId: this.selectedReplyUpdate.postId,
      userId: this.selectedReplyUpdate.userId,
      commentId: this.selectedReplyUpdate.commentId,
      content: this.selectedReplyUpdate.content
    };
  
    console.log("Sending update request:", replyRequest);
  
    this.replyService.updateReply(this.selectedReplyUpdate.id!, replyRequest)
      .subscribe({
        next: (response) => {
          console.log("Reply Updated Successfully:", response);
          this.getAllReplies();
          const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateReplyModal')!);
          updateModal?.hide();
        },
        error: (error) => {
          console.error("Error updating reply:", error);
        },
        complete: () => {
          console.log("Reply update request completed successfully.");
        }
      });
  }
  
  
  

// Update Pagination (without modifying filteredReplies)
updatePagination(): void {
  this.totalPages = Math.ceil(this.filteredReplies.length / this.itemsPerPage) || 1;
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.pagedReplies = this.filteredReplies.slice(startIndex, endIndex);
}

// Move to Previous Page
previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagination();
  }
}

// Move to Next Page
nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagination();
  }
}

  openReadModal(replyId: number): void {
    // Find the reply by ID
    const foundReply = this.replies.find(reply => reply.id === replyId);

    if (foundReply) {
        this.selectedReply = foundReply;
        const modal = new bootstrap.Modal(document.getElementById('readReplyModal'));
        modal.show();
    } else {
        console.error('Reply not found');
    }
  }
}
