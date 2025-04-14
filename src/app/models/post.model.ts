import { CategoryType } from './category-type.enum';  // Import the enum
import { Reply } from './reply.model';
import { StatusType } from './Status-Type.enum';

export interface Post {
  id?: number; // Optional, for new posts
  title: string;
  content: string;
  createdAt?: string;        // Optional properties
  lastUpdatedAt?: string;    // Optional properties
  comments?: Comment[];     // Optional properties
  replyIds?: Reply[];       // Optional properties
  nbr_like?: number;         // Optional properties
  nbr_dislike?: number;     
  category: CategoryType;  // Use the CategoryType enum for the category field
  mediaPath: string;  // Use the CategoryType enum for the category field
  mediaType: string;  // Use the CategoryType enum for the category field
  userId: number;
  username:string;  // Assuming you need userId for linking the post to a user
  status: StatusType;
  rejectionReason?:string;
}
