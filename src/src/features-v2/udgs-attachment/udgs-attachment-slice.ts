import { IUDGSAttachmentGridModel } from "../../model-v2/udgs-attachment-model";

export enum UDGSAttachmentStatus {
  Idle,
  Loading,
  Failed,
}
export interface IUDGSAttachmentState {
  status: UDGSAttachmentStatus;
  message: string;
  currentAttachments: IUDGSAttachmentGridModel[];
}
export const initialState: IUDGSAttachmentState = {
  status: UDGSAttachmentStatus.Idle,
  message: "",
  currentAttachments: [],
};
