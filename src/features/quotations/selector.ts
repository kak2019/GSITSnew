import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IQuotationState, QuotationStatus } from "./quotationsSlice";

const featureStateSelector = (state: RootState): object => state.quotations;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.status === QuotationStatus.Loading
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
export const quotationAttachmentsSelector = createSelector(
  featureStateSelector,
  (state: IQuotationState) => state?.QuotationAttachments
);
