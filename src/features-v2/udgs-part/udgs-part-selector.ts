import { createSelector } from "@reduxjs/toolkit";
import { UDGSPartStatus, IUDGSPartState } from "./udgs-part-slice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object => state.udgsParts;
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSPartState) => state?.status !== UDGSPartStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSPartState) => state?.message
);
export const currentPartWithQuotationSelector = createSelector(
  featureStateSelector,
  (state: IUDGSPartState) => state?.currentPartWithQuotation
);
export const currentPartSelector = createSelector(
  featureStateSelector,
  (state: IUDGSPartState) => state?.currentPart
);
export const currentPartsSelector = createSelector(
  featureStateSelector,
  (state: IUDGSPartState) => state?.currentParts
);
