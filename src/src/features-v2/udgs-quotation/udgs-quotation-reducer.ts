import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { UDGSQuotationStatus, initialState } from "./udgs-quotation-slice";
import {
  getQuotationByIDAction,
  getQuotationByPartIDAction,
  postQuotationAction,
  putQuotationAction,
} from "./udgs-quotation-action";

const udgsQuotationsSlice = createSlice({
  name: FeatureKey.QUOTATIONS,
  initialState,
  reducers: {
    UDGSQuotationStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuotationByIDAction.pending, (state, action) => {
        state.status = UDGSQuotationStatus.Loading;
      })
      .addCase(getQuotationByIDAction.fulfilled, (state, action) => {
        state.status = UDGSQuotationStatus.Idle;
        state.currentQuotation = action.payload;
      })
      .addCase(getQuotationByIDAction.rejected, (state, action) => {
        state.status = UDGSQuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getQuotationByPartIDAction.pending, (state, action) => {
        state.status = UDGSQuotationStatus.Loading;
      })
      .addCase(getQuotationByPartIDAction.fulfilled, (state, action) => {
        state.status = UDGSQuotationStatus.Idle;
        state.currentQuotation = action.payload;
      })
      .addCase(getQuotationByPartIDAction.rejected, (state, action) => {
        state.status = UDGSQuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postQuotationAction.pending, (state, action) => {
        state.status = UDGSQuotationStatus.Loading;
      })
      .addCase(postQuotationAction.fulfilled, (state, action) => {
        state.status = UDGSQuotationStatus.Idle;
      })
      .addCase(postQuotationAction.rejected, (state, action) => {
        state.status = UDGSQuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(putQuotationAction.pending, (state, action) => {
        state.status = UDGSQuotationStatus.Loading;
      })
      .addCase(putQuotationAction.fulfilled, (state, action) => {
        state.status = UDGSQuotationStatus.Idle;
      })
      .addCase(putQuotationAction.rejected, (state, action) => {
        state.status = UDGSQuotationStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSQuotationStatusChanged } = udgsQuotationsSlice.actions;
export const udgsQuotationsReducer = udgsQuotationsSlice.reducer;
