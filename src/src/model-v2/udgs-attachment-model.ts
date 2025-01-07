export interface IUDGSAttachmentGridModel {
  FileItem?: File;
  FileID?: string;
  URL: string;
  Name: string;
  UploadTime?: string;
}
export interface IUDGSAttachmentFormModel {
  FolderName: string;
  SubFolderName: string;
  NewFileItems?: File[];
  RemoveFileIDs?: string[];
}
export interface IUDGSAttachmentCreteriaModel {
  FolderName: string;
  SubFolderName: string;
  IsDataNeeded?: boolean;
}
