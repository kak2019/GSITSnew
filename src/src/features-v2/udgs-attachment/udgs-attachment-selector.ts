import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  IUDGSAttachmentState,
  UDGSAttachmentStatus,
} from "./udgs-attachment-slice";

const featureStateSelector = (state: RootState): object =>
  state.udgsAttachments;
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSAttachmentState) => state?.status !== UDGSAttachmentStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSAttachmentState) => state?.message
);
export const currentAttachmentsSelector = createSelector(
  featureStateSelector,
  (state: IUDGSAttachmentState) => state?.currentAttachments
);
