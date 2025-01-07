import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IUserRoleState } from "./userRolesSlice";

const featureStateSelector = (state: RootState): object => state.userRoles;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUserRoleState) => state?.status
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUserRoleState) => state?.message
);
export const supplierIdSelector = createSelector(
  featureStateSelector,
  (state: IUserRoleState) => state?.SupplierId
);
export const allUserRolesSelector = createSelector(
  featureStateSelector,
  (state: IUserRoleState) => state?.AllUserRoles
);
