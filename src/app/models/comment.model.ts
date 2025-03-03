import { Reply } from "./reply.model";

export interface Comment {
    id: number; // Optional, for new comments
    content: string;
    createdAt: string;  // Date format, assuming it's returned as a string
    lastUpdatedAt?: string;  // Optional, assuming backend provides this field
    isEdited: boolean;  // True if the comment was edited
    postId: number;  // Link to the associated post
    userId: number;  // Link to the user who created the comment
    replies?: Reply[];  // Optional replies, can be populated later
  }
  