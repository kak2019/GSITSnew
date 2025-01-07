import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IDocumentsState } from "./documentsSlice";

const featureStateSelector = (state: RootState): object => state.documents;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IDocumentsState) => state?.status
);

/**
 * message selector
 */
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IDocumentsState) => state?.message
);

/**
 * all items selector
 */
export const itemsSelector = createSelector(
  featureStateSelector,
  (state: IDocumentsState) => state?.items
);
export const rfqAttachmentsSelector = createSelector(
  featureStateSelector,
  (state: IDocumentsState) => state?.rfqAttachments
);
