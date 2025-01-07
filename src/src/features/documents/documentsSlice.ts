import { DocumentsStatus, IFile, IAttachments } from "../../model/documents";

export interface IDocumentsState {
  status: DocumentsStatus;
  message: string;
  items: IFile[];
  rfqAttachments: IAttachments[];
}
export const initialState: IDocumentsState = {
  status: DocumentsStatus.Idle,
  message: "",
  items: [],
  rfqAttachments: [],
};
