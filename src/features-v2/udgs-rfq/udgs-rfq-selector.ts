import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IUDGSRFQState, UDGSRFQStatus } from "./udgs-rfq-slice";
const featureStateSelector = (state: RootState): object => state.udgsRFQs;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSRFQState) => state?.status !== UDGSRFQStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSRFQState) => state?.message
);
export const queriedRFQsSelector = createSelector(
  featureStateSelector,
  (state: IUDGSRFQState) => state?.queriedRFQs
);
export const currentRFQSelector = createSelector(
  featureStateSelector,
  (state: IUDGSRFQState) => state?.currentRFQ
);
