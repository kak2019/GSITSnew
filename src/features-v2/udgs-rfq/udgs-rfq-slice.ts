import { IUDGSRFQGridModel } from "../../model-v2/udgs-rfq-model";

export enum UDGSRFQStatus {
  Idle,
  Loading,
  Failed,
}

export interface IUDGSRFQState {
  status: UDGSRFQStatus;
  message: string;
  queriedRFQs: IUDGSRFQGridModel[];
  currentRFQ: IUDGSRFQGridModel;
}
export const initialState: IUDGSRFQState = {
  status: UDGSRFQStatus.Idle,
  message: "",
  queriedRFQs: [],
  currentRFQ: {} as IUDGSRFQGridModel,
};
