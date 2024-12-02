import { IActionLog } from "../../model/actionLog";
import { IQuotationGrid } from "../../model/requisition";
import { IRFQGrid } from "../../model/rfq";

export enum QuotationStatus {
  Idle,
  Loading,
  Failed,
}

export interface IQuotationState {
  status: QuotationStatus;
  message: string;
  AllQuotations: IQuotationGrid[];
  CurrentQuotation: IQuotationGrid;
  CurrentQuotationRFQ: IRFQGrid;
  AllActionLogs: IActionLog[];
}
export const initialState: IQuotationState = {
  status: QuotationStatus.Idle,
  message: "",
  AllQuotations: [],
  CurrentQuotation: {} as IQuotationGrid,
  CurrentQuotationRFQ: {} as IRFQGrid,
  AllActionLogs: [],
};
