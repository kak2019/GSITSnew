import { createSelector } from "@reduxjs/toolkit";
import {
  UDGSQuotationStatus,
  IUDGSQuotationState,
} from "./udgs-quotation-slice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object => state.udgsQuotations;
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSQuotationState) => state?.status !== UDGSQuotationStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSQuotationState) => state?.message
);
export const currentQuotationSelector = createSelector(
  featureStateSelector,
  (state: IUDGSQuotationState) => state?.currentQuotation
);
