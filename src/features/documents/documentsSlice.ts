import { DocumentsStatus, IFile, IRFQAttachment } from "../../model/documents";

export interface IDocumentsState {
  status: DocumentsStatus;
  message: string;
  items: IFile[];
  rfqAttachments: IRFQAttachment[];
}
export const initialState: IDocumentsState = {
  status: DocumentsStatus.Idle,
  message: "",
  items: [],
  rfqAttachments: [],
};
