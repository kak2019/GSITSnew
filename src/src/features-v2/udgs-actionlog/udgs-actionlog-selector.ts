import { createSelector } from "@reduxjs/toolkit";
import {
  UDGSActionlogStatus,
  IUDGSActionlogState,
} from "./udgs-actionlog-slice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object => state.udgsActionlogs;
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSActionlogState) => state?.status !== UDGSActionlogStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSActionlogState) => state?.message
);
export const currentActionlogsSelector = createSelector(
  featureStateSelector,
  (state: IUDGSActionlogState) => state?.currentActionLogs
);
