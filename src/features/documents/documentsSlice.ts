import { DocumentsStatus, IFile } from "../../model/documents";

export interface IDocumentsState {
  status: DocumentsStatus;
  message: string;
  items: IFile[];
  rfqAttachments: File[];
}
export const initialState: IDocumentsState = {
  status: DocumentsStatus.Idle,
  message: "",
  items: [],
  rfqAttachments: [],
};
