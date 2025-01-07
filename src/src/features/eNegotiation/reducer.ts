import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, ENegotiationRequestStatus } from "./slice";
import {
  getENegotiationRequestListAction,
  createENegotiationRequestAction,
  updateENegotiationRequestAction,
} from "./action";
import { IENegotiationRequest } from "../../model/eNegotiation";

const eNegotiationSlice = createSlice({
  name: FeatureKey.ENEGOTIATIONREQUESTS,
  initialState,
  reducers: {
    eNegotiationStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getENegotiationRequestListAction.pending, (state, action) => {
        state.status = ENegotiationRequestStatus.Loading;
      })
      .addCase(getENegotiationRequestListAction.fulfilled, (state, action) => {
        state.status = ENegotiationRequestStatus.Idle;
        state.eNegotiationRequestList = [
          ...(action.payload as readonly IENegotiationRequest[]),
        ];
      })
      .addCase(getENegotiationRequestListAction.rejected, (state, action) => {
        state.status = ENegotiationRequestStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(createENegotiationRequestAction.pending, (state, action) => {
        state.status = ENegotiationRequestStatus.Loading;
      })
      .addCase(createENegotiationRequestAction.fulfilled, (state, action) => {
        state.status = ENegotiationRequestStatus.Idle;
      })
      .addCase(createENegotiationRequestAction.rejected, (state, action) => {
        state.status = ENegotiationRequestStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(updateENegotiationRequestAction.pending, (state, action) => {
        state.status = ENegotiationRequestStatus.Loading;
      })
      .addCase(updateENegotiationRequestAction.fulfilled, (state, action) => {
        state.status = ENegotiationRequestStatus.Idle;
      })
      .addCase(updateENegotiationRequestAction.rejected, (state, action) => {
        state.status = ENegotiationRequestStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { eNegotiationStatusChanged } = eNegotiationSlice.actions;
export const eNegotiationReducer = eNegotiationSlice.reducer;
