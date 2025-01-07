import { IUDGSSupplierRequestGridModel } from "../../model-v2/udgs-supplierrequest-model";

export enum UDGSSupplierRequestStatus {
  Idle,
  Loading,
  Failed,
}
export interface IUDGSSupplierREquestState {
  status: UDGSSupplierRequestStatus;
  message: string;
  currentSupplierRequest: IUDGSSupplierRequestGridModel;
}
export const initialState: IUDGSSupplierREquestState = {
  status: UDGSSupplierRequestStatus.Idle,
  message: "",
  currentSupplierRequest: {} as IUDGSSupplierRequestGridModel,
};
