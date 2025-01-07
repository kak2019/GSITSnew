import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IRequisitionState } from "./requisitionsSlice";

const featureStateSelector = (state: RootState): object => state.requisitions;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IRequisitionState) => state?.status
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IRequisitionState) => state?.message
);
export const allRequisitionsSelector = createSelector(
  featureStateSelector,
  (state: IRequisitionState) => state?.AllRequisitions
);
