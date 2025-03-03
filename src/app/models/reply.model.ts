import { Post } from "./post.model";

export interface Reply {
    id?: number; // Optional, for new replies
    content: string;
    createdAt: string;  // Date format, assuming it's returned as a string
    lastUpdatedAt?: string;  // Optional, assuming backend provides this field
    isEdited: boolean;  // True if the reply was edited
    commentId: number;  // Link to the associated comment
    userId: number;  // Link to the user who created the reply
    post?: Post;  // The post linked to the reply, not stored in DB, used for front-end purposes
  }
  