import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, RequisitionStatus } from "./requisitionsSlice";
import { getAllRequisitionsAction, updateRequisitionAction } from "./action";
import { IRequisitionGrid } from "../../model/requisition";

const requisitionsSlice = createSlice({
  name: FeatureKey.REQUISITIONS,
  initialState,
  reducers: {
    RequisitionStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequisitionsAction.pending, (state, action) => {
        state.status = RequisitionStatus.Loading;
      })
      .addCase(getAllRequisitionsAction.fulfilled, (state, action) => {
        state.status = RequisitionStatus.Idle;
        state.AllRequisitions = [
          ...(action.payload as readonly IRequisitionGrid[]),
        ];
      })
      .addCase(getAllRequisitionsAction.rejected, (state, action) => {
        state.status = RequisitionStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(updateRequisitionAction.pending, (state, action) => {
        state.status = RequisitionStatus.Loading;
      })
      .addCase(updateRequisitionAction.fulfilled, (state, action) => {
        state.status = RequisitionStatus.Idle;
      })
      .addCase(updateRequisitionAction.rejected, (state, action) => {
        state.status = RequisitionStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { RequisitionStatusChanged } = requisitionsSlice.actions;
export const requisitionsReducer = requisitionsSlice.reducer;
