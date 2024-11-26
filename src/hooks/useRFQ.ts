import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  RFQStatus,
  allRFQsSelector,
  getAllRFQsAction,
  updateRFQAction,
  isFetchingSelector,
  messageSelector,
  createRFQAction,
  getRFQAction,
} from "../features/rfqs";
import { IRFQGrid } from "../model/rfq";

type RFQOperators = [
  isFetching: RFQStatus,
  allRFQs: IRFQGrid[],
  errorMessage: string,
  getAllRFQs: () => void,
  getRFQ: (rfq: string) => void,
  updateRFQ: (rfq: IRFQGrid) => void,
  createRFQ: (rfq: IRFQGrid) => Promise<string>
];

export const useRFQ = (): Readonly<RFQOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const allRFQs = useAppSelector(allRFQsSelector);
  const getAllRFQs = useCallback(() => {
    return dispatch(getAllRFQsAction());
  }, [dispatch]);
  const getRFQ = useCallback(
    (rfqId: string) => {
      return dispatch(getRFQAction(rfqId));
    },
    [dispatch]
  );
  const updateRFQ = useCallback(
    (rfq: IRFQGrid) => {
      return dispatch(updateRFQAction(rfq));
    },
    [dispatch]
  );
  const createRFQ = useCallback(
    async (rfq: IRFQGrid): Promise<string> => {
      const actionResult = await dispatch(createRFQAction(rfq));
      if (createRFQAction.fulfilled.match(actionResult)) {
        return actionResult.payload as string;
      } else {
        throw new Error("Error When Return New RFQ ID");
      }
    },
    [dispatch]
  );
  return [
    isFetching,
    allRFQs,
    errorMessage,
    getAllRFQs,
    getRFQ,
    updateRFQ,
    createRFQ,
  ] as const;
};
