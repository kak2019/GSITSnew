import { IRequisitionRFQGrid } from "../../model/requisition";
import { IRFQGrid } from "../../model/rfq";

export enum RFQStatus {
  Idle,
  Loading,
  Failed,
}

export interface IRFQState {
  status: RFQStatus;
  message: string;
  AllRFQs: IRFQGrid[];
  currentRFQ: IRFQGrid;
  currentRFQRequisitions: IRequisitionRFQGrid[];
}
export const initialState: IRFQState = {
  status: RFQStatus.Idle,
  message: "",
  AllRFQs: [],
  currentRFQ: {},
  currentRFQRequisitions: [],
};
