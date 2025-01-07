import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  IUDGSSectionModel,
  IUDGSUserRoleModel,
} from "../model-v2/udgs-user-model";
import {
  currentRolesSelector,
  currentSectionsSelector,
  getRolesAction,
  getSectionsAction,
  getSupplierIdAction,
  isFetchingSelector,
  messageSelector,
  supplierIdSelector,
} from "../features-v2/udgs-user";

type UserOperators = [
  isFetching: boolean,
  errorMessage: string,
  supplierId: string,
  currentRoles: IUDGSUserRoleModel[],
  currentSections: IUDGSSectionModel[],
  getSupplierId: (email: string) => Promise<string>,
  getRoles: () => Promise<void>,
  getSections: () => Promise<IUDGSSectionModel[]>
];

export const useUDGSUser = (): Readonly<UserOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const supplierId = useAppSelector(supplierIdSelector);
  const currentRoles = useAppSelector(currentRolesSelector);
  const currentSections = useAppSelector(currentSectionsSelector);
  const getSupplierId = useCallback(
    async (email: string): Promise<string> => {
      const actionResult = await dispatch(getSupplierIdAction(email));
      if (getSupplierIdAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching SupplierId");
    },
    [dispatch]
  );
  const getRoles = useCallback(async (): Promise<void> => {
    const actionResult = await dispatch(getRolesAction());
    if (getRolesAction.fulfilled.match(actionResult)) {
      return;
    }
    throw new Error("Error When Fetching Roles");
  }, [dispatch]);
  const getSections = useCallback(async (): Promise<IUDGSSectionModel[]> => {
    const result = await dispatch(getSectionsAction());
    return result.payload as IUDGSSectionModel[];
  }, [dispatch]);
  return [
    isFetching,
    errorMessage,
    supplierId,
    currentRoles,
    currentSections,
    getSupplierId,
    getRoles,
    getSections,
  ] as const;
};
