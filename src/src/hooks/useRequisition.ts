import { useCallback } from "react";
import {
  allRequisitionsSelector,
  getAllRequisitionsAction,
  isFetchingSelector,
  messageSelector,
  queryRequisitionsAction,
  RequisitionStatus,
  updateRequisitionAction,
} from "../features/requisitions";
import { IRequisitionGrid, IRequisitionQueryModel } from "../model/requisition";
import { useAppDispatch, useAppSelector } from "./useApp";

type RequisitionOperators = [
  isFetching: RequisitionStatus,
  allRequisitions: IRequisitionGrid[],
  errorMessage: string,
  getAllRequisitions: () => void,
  updateRequisition: (Requisition: IRequisitionGrid) => void,
  queryRequisitions: (Query: IRequisitionQueryModel) => void
];

export const useRequisition = (): Readonly<RequisitionOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const allRequisitions = useAppSelector(allRequisitionsSelector);
  const getAllRequisitions = useCallback(() => {
    return dispatch(getAllRequisitionsAction());
  }, [dispatch]);
  const updateRequisition = useCallback(
    (Requisition: IRequisitionGrid) => {
      return dispatch(updateRequisitionAction(Requisition));
    },
    [dispatch]
  );
  const queryRequisitions = useCallback(
    (Query: IRequisitionQueryModel) => {
      return dispatch(queryRequisitionsAction(Query));
    },
    [dispatch]
  );
  return [
    isFetching,
    allRequisitions,
    errorMessage,
    getAllRequisitions,
    updateRequisition,
    queryRequisitions,
  ] as const;
};
