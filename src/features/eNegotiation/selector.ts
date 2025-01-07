import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  IENegotiationRequestStatusState,
  ENegotiationRequestStatus,
} from "./slice";

const featureStateSelector = (state: RootState): object => state.eNegotiation;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IENegotiationRequestStatusState) =>
    state?.status !== ENegotiationRequestStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IENegotiationRequestStatusState) => state?.message
);
export const eNegotiationRequestListSelector = createSelector(
  featureStateSelector,
  (state: IENegotiationRequestStatusState) => state?.eNegotiationRequestList
);
