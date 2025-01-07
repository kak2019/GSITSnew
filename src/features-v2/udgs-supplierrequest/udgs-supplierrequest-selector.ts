import { createSelector } from "@reduxjs/toolkit";
import {
  UDGSSupplierRequestStatus,
  IUDGSSupplierREquestState,
} from "./udgs-supplierrequest-slice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object =>
  state.udgsSupplierRequests;
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSSupplierREquestState) =>
    state?.status !== UDGSSupplierRequestStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSSupplierREquestState) => state?.message
);
export const currentSupplierRequestSelector = createSelector(
  featureStateSelector,
  (state: IUDGSSupplierREquestState) => state?.currentSupplierRequest
);
