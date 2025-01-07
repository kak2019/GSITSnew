import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IPriceChangeStatusState, PriceChangeStatus } from "./slice";

const featureStateSelector = (state: RootState): object => state.priceChange;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IPriceChangeStatusState) => state?.status !== PriceChangeStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IPriceChangeStatusState) => state?.message
);
export const priceChangeRequestListSelector = createSelector(
  featureStateSelector,
  (state: IPriceChangeStatusState) => state?.priceChangeRequestList
);
export const currentPriceChangeRequestSelector = createSelector(
  featureStateSelector,
  (state: IPriceChangeStatusState) => state?.currentPriceChangeRequest
);
export const currentPriceChangeRequestSubItemListSelector = createSelector(
  featureStateSelector,
  (state: IPriceChangeStatusState) =>
    state?.currentPriceChangeRequestSubItemList
);
