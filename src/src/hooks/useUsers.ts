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
  getSupplierId: (email: string) => Promise<string>
];

export const useUsers = (): Readonly<UserRoleOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const supplierId = useAppSelector(supplierIdSelector);
  const getSupplierId = useCallback(
    async (email: string):Promise<string> => {
      const actionResult=await dispatch(getSupplierIdByUserEmailAction(email)).catch((err)=>{console.log(err)});
      if (getSupplierIdByUserEmailAction.fulfilled.match(actionResult)) {
        return actionResult.payload as string;
      } else {
        throw new Error("Error When Return New RFQ ID");
      }
    },
    [dispatch]
  );
  return [isFetching, supplierId, errorMessage, getSupplierId] as const;
};
