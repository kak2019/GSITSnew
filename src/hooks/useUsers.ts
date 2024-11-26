import { useCallback } from "react";
import {
  getSupplierIdByUserEmailAction,
  isFetchingSelector,
  messageSelector,
  supplierIdSelector,
  UserRoleStatus,
} from "../features/userRoles";
import { useAppDispatch, useAppSelector } from "./useApp";

type UserRoleOperators = [
  isFetching: UserRoleStatus,
  supplierId: string,
  errorMessage: string,
  getSupplierId: (email: string) => void
];

export const useUsers = (): Readonly<UserRoleOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const supplierId = useAppSelector(supplierIdSelector);
  const getSupplierId = useCallback(
    (email: string) => {
      return dispatch(getSupplierIdByUserEmailAction(email));
    },
    [dispatch]
  );
  return [isFetching, supplierId, errorMessage, getSupplierId] as const;
};
