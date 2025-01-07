import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, UDGSAttachmentStatus } from "./udgs-attachment-slice";
import {
  getAttachmentsAction,
  postAttachmentsAction,
} from "./udgs-attachment-action";

const udgsAttachmentsSlice = createSlice({
  name: FeatureKey.ATTACHMENTS,
  initialState,
  reducers: {
    UDGSAttachmentStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttachmentsAction.pending, (state, action) => {
        state.status = UDGSAttachmentStatus.Loading;
      })
      .addCase(getAttachmentsAction.fulfilled, (state, action) => {
        state.status = UDGSAttachmentStatus.Idle;
        state.currentAttachments = action.payload;
      })
      .addCase(getAttachmentsAction.rejected, (state, action) => {
        state.status = UDGSAttachmentStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postAttachmentsAction.pending, (state, action) => {
        state.status = UDGSAttachmentStatus.Loading;
      })
      .addCase(postAttachmentsAction.fulfilled, (state, action) => {
        state.status = UDGSAttachmentStatus.Idle;
      })
      .addCase(postAttachmentsAction.rejected, (state, action) => {
        state.status = UDGSAttachmentStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSAttachmentStatusChanged } = udgsAttachmentsSlice.actions;
export const UDGSAttachmentsReducer = udgsAttachmentsSlice.reducer;
