import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { UDGSPartStatus, initialState } from "./udgs-part-slice";
import {
  getPartByIDAction,
  getPartsByRFQIDAction,
  getPartWithQuotationByRFQIDAction,
  queryPartsAction,
} from "./udgs-part-action";
import {
  IUDGSNewPartGridModel,
  IUDGSNewPartQuotationGridModel,
} from "../../model-v2/udgs-part-model";

const udgsPartsSlice = createSlice({
  name: FeatureKey.PARTS,
  initialState,
  reducers: {
    UDGSPartStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryPartsAction.pending, (state, action) => {
        state.status = UDGSPartStatus.Loading;
      })
      .addCase(queryPartsAction.fulfilled, (state, action) => {
        state.status = UDGSPartStatus.Idle;
        state.currentParts = [...(action.payload as IUDGSNewPartGridModel[])];
      })
      .addCase(queryPartsAction.rejected, (state, action) => {
        state.status = UDGSPartStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getPartWithQuotationByRFQIDAction.pending, (state, action) => {
        state.status = UDGSPartStatus.Loading;
      })
      .addCase(getPartWithQuotationByRFQIDAction.fulfilled, (state, action) => {
        state.status = UDGSPartStatus.Idle;
        state.currentPartWithQuotation = [
          ...(action.payload as IUDGSNewPartQuotationGridModel[]),
        ];
      })
      .addCase(getPartWithQuotationByRFQIDAction.rejected, (state, action) => {
        state.status = UDGSPartStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getPartByIDAction.pending, (state, action) => {
        state.status = UDGSPartStatus.Loading;
      })
      .addCase(getPartByIDAction.fulfilled, (state, action) => {
        state.status = UDGSPartStatus.Idle;
        state.currentPart = action.payload;
      })
      .addCase(getPartByIDAction.rejected, (state, action) => {
        state.status = UDGSPartStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getPartsByRFQIDAction.pending, (state, action) => {
        state.status = UDGSPartStatus.Loading;
      })
      .addCase(getPartsByRFQIDAction.fulfilled, (state, action) => {
        state.status = UDGSPartStatus.Idle;
        state.currentParts = [...(action.payload as IUDGSNewPartGridModel[])];
      })
      .addCase(getPartsByRFQIDAction.rejected, (state, action) => {
        state.status = UDGSPartStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSPartStatusChanged } = udgsPartsSlice.actions;
export const udgsPartsReducer = udgsPartsSlice.reducer;
