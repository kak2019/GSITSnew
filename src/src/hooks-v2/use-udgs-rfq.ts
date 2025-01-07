import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  putRFQAction,
  isFetchingSelector,
  messageSelector,
  postRFQAction,
  getRFQByIDAction,
  currentRFQSelector,
  queryRFQsAction,
  queriedRFQsSelector,
} from "../features-v2/udgs-rfq";
import {
  IUDGSRFQCreteriaModel,
  IUDGSRFQFormModel,
  IUDGSRFQGridModel,
} from "../model-v2/udgs-rfq-model";

type RFQOperators = [
  isFetching: boolean,
  errorMessage: string,
  queriedRFQs: IUDGSRFQGridModel[],
  currentRFQ: IUDGSRFQGridModel,
  queryRFQs: (query: IUDGSRFQCreteriaModel) => Promise<void>,
  getRFQByID: (rfqID: number) => Promise<IUDGSRFQGridModel>,
  postRFQ: (rfq: IUDGSRFQFormModel) => Promise<number>,
  putRFQ: (rfq: IUDGSRFQFormModel) => Promise<Date>
];

export const useUDGSRFQ = (): Readonly<RFQOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const queriedRFQs = useAppSelector(queriedRFQsSelector);
  const currentRFQ = useAppSelector(currentRFQSelector);
  const queryRFQs = useCallback(
    async (creteria: IUDGSRFQCreteriaModel): Promise<void> => {
      const actionResult = await dispatch(queryRFQsAction(creteria));
      if (queryRFQsAction.fulfilled.match(actionResult)) {
        return;
      }
      throw new Error("Error When Fetching RFQ");
    },
    [dispatch]
  );
  const getRFQByID = useCallback(
    async (rfqID: number): Promise<IUDGSRFQGridModel> => {
      const actionResult = await dispatch(getRFQByIDAction(rfqID));
      if (getRFQByIDAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching RFQ");
    },
    [dispatch]
  );
  const postRFQ = useCallback(
    async (rfq: IUDGSRFQFormModel): Promise<number> => {
      const actionResult = await dispatch(postRFQAction(rfq));
      if (postRFQAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Return New RFQ ID");
    },
    [dispatch]
  );
  const putRFQ = useCallback(
    async (rfq: IUDGSRFQFormModel): Promise<Date> => {
      const result = await dispatch(putRFQAction(rfq));
      return new Date(result.payload as string);
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    queriedRFQs,
    currentRFQ,
    queryRFQs,
    getRFQByID,
    postRFQ,
    putRFQ,
  ] as const;
};
