import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState } from "./documentsSlice";
import {
  readAllFilesSizeAction,
  updateTitlesAction,
  getDocumentsAction,
  initialUploadRFQAttachmentsAction,
  getRFQAttachmentsAction,
} from "./action";
import { DocumentsStatus, IFile, IRFQAttachment } from "../../model/documents";

const documentsSlice = createSlice({
  name: FeatureKey.DOCUMENTS,
  initialState,
  reducers: {
    DocumentStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readAllFilesSizeAction.pending, (state, action) => {
        state.status = DocumentsStatus.Loading;
      })
      .addCase(readAllFilesSizeAction.fulfilled, (state, action) => {
        state.status = DocumentsStatus.Idle;
        state.items = [...(action.payload as readonly IFile[])];
      })
      .addCase(readAllFilesSizeAction.rejected, (state, action) => {
        state.status = DocumentsStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(updateTitlesAction.pending, (state, action) => {
        state.status = DocumentsStatus.Loading;
      })
      .addCase(updateTitlesAction.fulfilled, (state, action) => {
        state.status = DocumentsStatus.Idle;
        const a = [...(action.payload as readonly IFile[])];
        const updatedItems = state.items.map((item) => {
          const updatedItem = a.find((updated) => updated.Id === item.Id);
          return updatedItem ? { ...item, ...updatedItem } : item;
        });
        state.items = updatedItems;
      })
      .addCase(updateTitlesAction.rejected, (state, action) => {
        state.status = DocumentsStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getDocumentsAction.pending, (state, action) => {
        state.status = DocumentsStatus.Loading;
      })
      .addCase(getDocumentsAction.fulfilled, (state, action) => {
        state.status = DocumentsStatus.Idle;
        state.items = [...(action.payload as readonly IFile[])];
      })
      .addCase(getDocumentsAction.rejected, (state, action) => {
        state.status = DocumentsStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(initialUploadRFQAttachmentsAction.pending, (state, action) => {
        state.status = DocumentsStatus.Loading;
      })
      .addCase(initialUploadRFQAttachmentsAction.fulfilled, (state, action) => {
        state.status = DocumentsStatus.Idle;
      })
      .addCase(initialUploadRFQAttachmentsAction.rejected, (state, action) => {
        state.status = DocumentsStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getRFQAttachmentsAction.pending, (state, action) => {
        state.status = DocumentsStatus.Loading;
      })
      .addCase(getRFQAttachmentsAction.fulfilled, (state, action) => {
        state.status = DocumentsStatus.Idle;
        state.rfqAttachments = [...action.payload] as IRFQAttachment[];
      })
      .addCase(getRFQAttachmentsAction.rejected, (state, action) => {
        state.status = DocumentsStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});

export const { DocumentStatusChanged } = documentsSlice.actions;
export const documentsReducer = documentsSlice.reducer;
