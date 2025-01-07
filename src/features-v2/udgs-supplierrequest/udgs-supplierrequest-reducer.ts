import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import {
  UDGSSupplierRequestStatus,
  initialState,
} from "./udgs-supplierrequest-slice";
import {
  getSupplierRequestByIDAction,
  postSupplierRequestAction,
  putSupplierRequestAction,
} from "./udgs-supplierrequest-action";

const udgsSupplierRequestsSlice = createSlice({
  name: FeatureKey.SUPPLIERREQUEST,
  initialState,
  reducers: {
    UDGSSupplierRequestStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierRequestByIDAction.pending, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Loading;
      })
      .addCase(getSupplierRequestByIDAction.fulfilled, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Idle;
        state.currentSupplierRequest = action.payload;
      })
      .addCase(getSupplierRequestByIDAction.rejected, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postSupplierRequestAction.pending, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Loading;
      })
      .addCase(postSupplierRequestAction.fulfilled, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Idle;
      })
      .addCase(postSupplierRequestAction.rejected, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(putSupplierRequestAction.pending, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Loading;
      })
      .addCase(putSupplierRequestAction.fulfilled, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Idle;
      })
      .addCase(putSupplierRequestAction.rejected, (state, action) => {
        state.status = UDGSSupplierRequestStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSSupplierRequestStatusChanged } =
  udgsSupplierRequestsSlice.actions;
export const udgsSupplierRequestsReducer = udgsSupplierRequestsSlice.reducer;
