import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, UDGSRFQStatus } from "./udgs-rfq-slice";
import {
  queryRFQsAction,
  getRFQByIDAction,
  postRFQAction,
  putRFQAction,
} from "./udgs-rfq-action";
import { IUDGSRFQGridModel } from "../../model-v2/udgs-rfq-model";

const udgsRFQsSlice = createSlice({
  name: FeatureKey.RFQS,
  initialState,
  reducers: {
    UDGSRFQStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryRFQsAction.pending, (state, action) => {
        state.status = UDGSRFQStatus.Loading;
      })
      .addCase(queryRFQsAction.fulfilled, (state, action) => {
        state.status = UDGSRFQStatus.Idle;
        state.queriedRFQs = [
          ...(action.payload as readonly IUDGSRFQGridModel[]),
        ];
      })
      .addCase(queryRFQsAction.rejected, (state, action) => {
        state.status = UDGSRFQStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getRFQByIDAction.pending, (state, action) => {
        state.status = UDGSRFQStatus.Loading;
      })
      .addCase(getRFQByIDAction.fulfilled, (state, action) => {
        state.status = UDGSRFQStatus.Idle;
        state.currentRFQ = action.payload as IUDGSRFQGridModel;
      })
      .addCase(getRFQByIDAction.rejected, (state, action) => {
        state.status = UDGSRFQStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postRFQAction.pending, (state, action) => {
        state.status = UDGSRFQStatus.Loading;
      })
      .addCase(postRFQAction.fulfilled, (state, action) => {
        state.status = UDGSRFQStatus.Idle;
      })
      .addCase(postRFQAction.rejected, (state, action) => {
        state.status = UDGSRFQStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(putRFQAction.pending, (state, action) => {
        state.status = UDGSRFQStatus.Loading;
      })
      .addCase(putRFQAction.fulfilled, (state, action) => {
        state.status = UDGSRFQStatus.Idle;
      })
      .addCase(putRFQAction.rejected, (state, action) => {
        state.status = UDGSRFQStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSRFQStatusChanged } = udgsRFQsSlice.actions;
export const udgsRFQsReducer = udgsRFQsSlice.reducer;
