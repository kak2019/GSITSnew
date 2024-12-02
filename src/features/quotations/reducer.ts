import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, QuotationStatus } from "./quotationsSlice";
import {
  createActionLogAction,
  getAllActionLogsAction,
  getAllQuotationsAction,
  getCurrentQuotationAction,
  getCurrentQuotationRFQAction,
  updateQuotationAction,
} from "./action";
import { IQuotationGrid } from "../../model/requisition";
import { IActionLog } from "../../model/actionLog";

const quotationsSlice = createSlice({
  name: FeatureKey.QUOTATIONS,
  initialState,
  reducers: {
    QuotationStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuotationsAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getAllQuotationsAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.AllQuotations = [
          ...(action.payload as readonly IQuotationGrid[]),
        ];
      })
      .addCase(getAllQuotationsAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(updateQuotationAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(updateQuotationAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
      })
      .addCase(updateQuotationAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getCurrentQuotationAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getCurrentQuotationAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.CurrentQuotation = action.payload as IQuotationGrid;
      })
      .addCase(getCurrentQuotationAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getCurrentQuotationRFQAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getCurrentQuotationRFQAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.CurrentQuotationRFQ = action.payload;
      })
      .addCase(getCurrentQuotationRFQAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getAllActionLogsAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getAllActionLogsAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.AllActionLogs = [...(action.payload as readonly IActionLog[])];
      })
      .addCase(getAllActionLogsAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(createActionLogAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(createActionLogAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
      })
      .addCase(createActionLogAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { QuotationStatusChanged } = quotationsSlice.actions;
export const quotationsReducer = quotationsSlice.reducer;
