import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IQuotationState } from "./quotationsSlice";

const featureStateSelector = (state: RootState): object => state.quotations;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.status
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.message
);
export const allQuotationsSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.AllQuotations
);
export const currentQuotationSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.CurrentQuotation
);
export const currentQuotationRFQSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.CurrentQuotationRFQ
);
export const allActionLogsSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.AllActionLogs
);
