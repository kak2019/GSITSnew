import {
  IUDGSNewPartGridModel,
  IUDGSNewPartQuotationGridModel,
} from "../../model-v2/udgs-part-model";

export enum UDGSPartStatus {
  Idle,
  Loading,
  Failed,
}
export interface IUDGSPartState {
  status: UDGSPartStatus;
  message: string;
  currentPartWithQuotation: IUDGSNewPartQuotationGridModel[];
  currentPart: IUDGSNewPartGridModel;
  currentParts: IUDGSNewPartGridModel[];
}
export const initialState: IUDGSPartState = {
  status: UDGSPartStatus.Idle,
  message: "",
  currentPartWithQuotation: [],
  currentPart: {} as IUDGSNewPartGridModel,
  currentParts: [],
};
