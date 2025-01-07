import {
  ISupplierRequest,
  ISupplierRequestSubItem,
} from "../../model/priceChange";

export enum PriceChangeStatus {
  Idle,
  Loading,
  Failed,
}

export interface IPriceChangeStatusState {
  status: PriceChangeStatus;
  message: string;
  priceChangeRequestList: ISupplierRequest[];
  currentPriceChangeRequest: ISupplierRequest;
  currentPriceChangeRequestSubItemList: ISupplierRequestSubItem[];
}
export const initialState: IPriceChangeStatusState = {
  status: PriceChangeStatus.Idle,
  message: "",
  priceChangeRequestList: [],
  currentPriceChangeRequest: { ID: "0" },
  currentPriceChangeRequestSubItemList: [],
};
