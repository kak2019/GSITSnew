import { IUserRole } from "../../model/user";

export enum UserRoleStatus {
  Idle,
  Loading,
  Failed,
}

export interface IUserRoleState {
  status: UserRoleStatus;
  message: string;
  SupplierId: string;
  AllUserRoles: IUserRole[];
}
export const initialState: IUserRoleState = {
  status: UserRoleStatus.Idle,
  message: "",
  SupplierId: "",
  AllUserRoles: [],
};
