import { IUDGSActionlogGridModel } from "../../model-v2/udgs-actionlog-model";

export enum UDGSActionlogStatus {
  Idle,
  Loading,
  Failed,
}
export interface IUDGSActionlogState {
  status: UDGSActionlogStatus;
  message: string;
  currentActionLogs: IUDGSActionlogGridModel[];
}
export const initialState: IUDGSActionlogState = {
  status: UDGSActionlogStatus.Idle,
  message: "",
  currentActionLogs: [],
};
