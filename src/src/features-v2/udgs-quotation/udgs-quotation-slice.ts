import { IUDGSQuotationGridModel } from "../../model-v2/udgs-quotation-model";

export enum UDGSQuotationStatus {
  Idle,
  Loading,
  Failed,
}
export interface IUDGSQuotationState {
  status: UDGSQuotationStatus;
  message: string;
  currentQuotation: IUDGSQuotationGridModel;
}
export const initialState: IUDGSQuotationState = {
  status: UDGSQuotationStatus.Idle,
  message: "",
  currentQuotation: {} as IUDGSQuotationGridModel,
};
