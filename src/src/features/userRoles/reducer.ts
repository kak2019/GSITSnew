import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../config/const";
import { initialState, UserRoleStatus } from "./userRolesSlice";
import { getSupplierIdByUserEmailAction, getUserRoleAction } from "./action";
import { IUserRole } from "../../model/user";

const userRolesSlice = createSlice({
  name: FeatureKey.USERROLES,
  initialState,
  reducers: {
    UserStatusChanged(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierIdByUserEmailAction.pending, (state, action) => {
        state.status = UserRoleStatus.Loading;
      })
      .addCase(getSupplierIdByUserEmailAction.fulfilled, (state, action) => {
        state.status = UserRoleStatus.Idle;
        state.SupplierId = action.payload as string;
      })
      .addCase(getSupplierIdByUserEmailAction.rejected, (state, action) => {
        state.status = UserRoleStatus.Failed;
        state.message = action.error?.message || "";
      })
      .addCase(getUserRoleAction.pending, (state, action) => {
        state.status = UserRoleStatus.Loading;
      })
      .addCase(getUserRoleAction.fulfilled, (state, action) => {
        state.status = UserRoleStatus.Idle;
        state.AllUserRoles = [...action.payload] as IUserRole[];
      })
      .addCase(getUserRoleAction.rejected, (state, action) => {
        state.status = UserRoleStatus.Failed;
        state.message = action.error?.message || "";
      });
  },
});
export const { UserStatusChanged: UserRoleStatusChanged } =
  userRolesSlice.actions;
export const userRolesReducer = userRolesSlice.reducer;
