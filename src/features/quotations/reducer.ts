import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, QuotationStatus } from "./quotationsSlice";
import {
  AcceptOrReturnAction as acceptOrReturnAction,
  createActionLogAction,
  getActionLogsAction,
  getAllQuotationsAction,
  getCurrentQuotationAction,
  getCurrentQuotationRFQAction,
  getQuotationAttachmentsAction,
  postCommentAction as postCommentAction,
  ProceedToPoAction,
  updateQuotationAction,
  UploadQuotationAttachmentsAction as uploadQuotationAttachmentsAction,
} from "./action";
import { IQuotationGrid } from "../../model/requisition";
import { IActionLog } from "../../model/actionLog";
import { IAttachments } from "../../model/documents";

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
        state.message = "";
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
        state.message = "";
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
        state.message = "";
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
        state.message = "";
        state.CurrentQuotationRFQ = action.payload;
      })
      .addCase(getCurrentQuotationRFQAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getActionLogsAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getActionLogsAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.AllActionLogs = [...(action.payload as readonly IActionLog[])];
      })
      .addCase(getActionLogsAction.rejected, (state, action) => {
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
      })
      .addCase(acceptOrReturnAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(acceptOrReturnAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
      })
      .addCase(acceptOrReturnAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(postCommentAction.pending, (state, action) => {})
      .addCase(postCommentAction.fulfilled, (state, action) => {})
      .addCase(postCommentAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(uploadQuotationAttachmentsAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(uploadQuotationAttachmentsAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
      })
      .addCase(uploadQuotationAttachmentsAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getQuotationAttachmentsAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(getQuotationAttachmentsAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
        state.QuotationAttachments = [...(action.payload as IAttachments[])];
      })
      .addCase(getQuotationAttachmentsAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(ProceedToPoAction.pending, (state, action) => {
        state.status = QuotationStatus.Loading;
      })
      .addCase(ProceedToPoAction.fulfilled, (state, action) => {
        state.status = QuotationStatus.Idle;
      })
      .addCase(ProceedToPoAction.rejected, (state, action) => {
        state.status = QuotationStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { QuotationStatusChanged } = quotationsSlice.actions;
export const quotationsReducer = quotationsSlice.reducer;
