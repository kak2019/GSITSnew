import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { UDGSActionlogStatus, initialState } from "./udgs-actionlog-slice";
import {
  getActionlogsByPartIDAction,
  getActionlogsByRFQIDAction,
  postActionlogAction,
} from "./udgs-actionlog-action";
import { IUDGSActionlogGridModel } from "../../model-v2/udgs-actionlog-model";

const udgsActionlogsSlice = createSlice({
  name: FeatureKey.ACTIONLOGS,
  initialState,
  reducers: {
    UDGSActionlogStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActionlogsByPartIDAction.pending, (state, action) => {
        state.status = UDGSActionlogStatus.Loading;
      })
      .addCase(getActionlogsByPartIDAction.fulfilled, (state, action) => {
        state.status = UDGSActionlogStatus.Idle;
        state.currentActionLogs = [
          ...(action.payload as IUDGSActionlogGridModel[]),
        ];
      })
      .addCase(getActionlogsByPartIDAction.rejected, (state, action) => {
        state.status = UDGSActionlogStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getActionlogsByRFQIDAction.pending, (state, action) => {
        state.status = UDGSActionlogStatus.Loading;
      })
      .addCase(getActionlogsByRFQIDAction.fulfilled, (state, action) => {
        state.status = UDGSActionlogStatus.Idle;
        state.currentActionLogs = [
          ...(action.payload as IUDGSActionlogGridModel[]),
        ];
      })
      .addCase(getActionlogsByRFQIDAction.rejected, (state, action) => {
        state.status = UDGSActionlogStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postActionlogAction.pending, (state, action) => {
        state.status = UDGSActionlogStatus.Loading;
      })
      .addCase(postActionlogAction.fulfilled, (state, action) => {
        state.status = UDGSActionlogStatus.Idle;
      })
      .addCase(postActionlogAction.rejected, (state, action) => {
        state.status = UDGSActionlogStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSActionlogStatusChanged } = udgsActionlogsSlice.actions;
export const udgsActionlogsReducer = udgsActionlogsSlice.reducer;
