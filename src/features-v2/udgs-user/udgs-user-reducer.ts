import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, UDGSUserStatus } from "./udgs-user-slice";
import {
  getRolesAction,
  getSectionsAction,
  getSupplierIdAction,
} from "./udgs-user-action";
import {
  IUDGSSectionModel,
  IUDGSUserRoleModel,
} from "../../model-v2/udgs-user-model";

const usersSlice = createSlice({
  name: FeatureKey.USERS,
  initialState,
  reducers: {
    UDGSUserStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierIdAction.pending, (state, action) => {
        state.status = UDGSUserStatus.Loading;
      })
      .addCase(getSupplierIdAction.fulfilled, (state, action) => {
        state.status = UDGSUserStatus.Idle;
        state.supplierId = action.payload as string;
      })
      .addCase(getSupplierIdAction.rejected, (state, action) => {
        state.status = UDGSUserStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getRolesAction.pending, (state, action) => {
        state.status = UDGSUserStatus.Loading;
      })
      .addCase(getRolesAction.fulfilled, (state, action) => {
        state.status = UDGSUserStatus.Idle;
        state.currentRoles = [...action.payload] as IUDGSUserRoleModel[];
      })
      .addCase(getRolesAction.rejected, (state, action) => {
        state.status = UDGSUserStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getSectionsAction.pending, (state, action) => {
        state.status = UDGSUserStatus.Loading;
      })
      .addCase(getSectionsAction.fulfilled, (state, action) => {
        state.status = UDGSUserStatus.Idle;
        state.currentSections = [...action.payload] as IUDGSSectionModel[];
      })
      .addCase(getSectionsAction.rejected, (state, action) => {
        state.status = UDGSUserStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UDGSUserStatusChanged } = usersSlice.actions;
export const udgsUsersReducer = usersSlice.reducer;
