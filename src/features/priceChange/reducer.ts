import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, PriceChangeStatus } from "./slice";
import {
  getSupplierRequestListAction,
  getSupplierRequestAction,
  getSupplierRequestSubitemListAction,
  createSupplierRequestAction,
  updateSupplierRequestAction,
} from "./action";
import {
  ISupplierRequest,
  ISupplierRequestSubItem,
} from "../../model/priceChange";

const priceChangeSlice = createSlice({
  name: FeatureKey.PRICECHANGE,
  initialState,
  reducers: {
    priceChangeStatusChanged(state, action) {
      state.status = action.payload;
    },
    setCurrentPriceChangeRequest(state, action) {
      state.currentPriceChangeRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierRequestListAction.pending, (state, action) => {
        state.status = PriceChangeStatus.Loading;
      })
      .addCase(getSupplierRequestListAction.fulfilled, (state, action) => {
        state.status = PriceChangeStatus.Idle;
        state.priceChangeRequestList = [
          ...(action.payload as readonly ISupplierRequest[]),
        ];
      })
      .addCase(getSupplierRequestListAction.rejected, (state, action) => {
        state.status = PriceChangeStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getSupplierRequestAction.pending, (state, action) => {
        state.status = PriceChangeStatus.Loading;
      })
      .addCase(getSupplierRequestAction.fulfilled, (state, action) => {
        state.status = PriceChangeStatus.Idle;
        state.currentPriceChangeRequest = { ...action.payload };
      })
      .addCase(getSupplierRequestAction.rejected, (state, action) => {
        state.status = PriceChangeStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getSupplierRequestSubitemListAction.pending, (state, action) => {
        state.status = PriceChangeStatus.Loading;
      })
      .addCase(
        getSupplierRequestSubitemListAction.fulfilled,
        (state, action) => {
          state.status = PriceChangeStatus.Idle;
          state.currentPriceChangeRequestSubItemList = [
            ...(action.payload as readonly ISupplierRequestSubItem[]),
          ];
        }
      )
      .addCase(
        getSupplierRequestSubitemListAction.rejected,
        (state, action) => {
          state.status = PriceChangeStatus.Failed;
          state.message = action.error?.message || "";
        }
      )
      .addCase(createSupplierRequestAction.pending, (state, action) => {
        state.status = PriceChangeStatus.Loading;
      })
      .addCase(createSupplierRequestAction.fulfilled, (state, action) => {
        state.status = PriceChangeStatus.Idle;
      })
      .addCase(createSupplierRequestAction.rejected, (state, action) => {
        state.status = PriceChangeStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(updateSupplierRequestAction.pending, (state, action) => {
        state.status = PriceChangeStatus.Loading;
      })
      .addCase(updateSupplierRequestAction.fulfilled, (state, action) => {
        state.status = PriceChangeStatus.Idle;
      })
      .addCase(updateSupplierRequestAction.rejected, (state, action) => {
        state.status = PriceChangeStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { priceChangeStatusChanged } = priceChangeSlice.actions;
export const { setCurrentPriceChangeRequest } = priceChangeSlice.actions;
export const priceChangeReducer = priceChangeSlice.reducer;
