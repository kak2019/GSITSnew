import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IUDGSUserState, UDGSUserStatus } from "./udgs-user-slice";

const featureStateSelector = (state: RootState): object => state.udgsUsers;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IUDGSUserState) => state?.status !== UDGSUserStatus.Idle
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IUDGSUserState) => state?.message
);
export const supplierIdSelector = createSelector(
  featureStateSelector,
  (state: IUDGSUserState) => state?.supplierId
);
export const currentRolesSelector = createSelector(
  featureStateSelector,
  (state: IUDGSUserState) => state?.currentRoles
);
export const currentSectionsSelector = createSelector(
  featureStateSelector,
  (state: IUDGSUserState) => state?.currentSections
);
