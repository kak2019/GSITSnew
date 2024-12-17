export interface IComment {
  CommentDate: Date;
  CommentBy: string;
  CommentText: string;
  CommentType: string;
}

export interface IAttachment {
  File: File;
  Url: string;
}
