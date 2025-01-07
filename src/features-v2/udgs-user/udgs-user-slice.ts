import {
  IUDGSSectionModel,
  IUDGSUserRoleModel,
} from "../../model-v2/udgs-user-model";

export enum UDGSUserStatus {
  Idle,
  Loading,
  Failed,
}

export interface IUDGSUserState {
  status: UDGSUserStatus;
  message: string;
  supplierId: string;
  currentRoles: IUDGSUserRoleModel[];
  currentSections: IUDGSSectionModel[];
}
export const initialState: IUDGSUserState = {
  status: UDGSUserStatus.Idle,
  message: "",
  supplierId: "",
  currentRoles: [],
  currentSections: [],
};
