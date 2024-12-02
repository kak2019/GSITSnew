import { useCallback } from "react";
import { IQuotationGrid } from "../model/requisition";
import { useAppDispatch, useAppSelector } from "./useApp";
import { IRFQGrid } from "../model/rfq";
import {
  allActionLogsSelector,
  allQuotationsSelector,
  createActionLogAction,
  currentQuotationRFQSelector,
  currentQuotationSelector,
  getAllActionLogsAction,
  getAllQuotationsAction,
  getCurrentQuotationAction,
  getCurrentQuotationRFQAction,
  isFetchingSelector,
  messageSelector,
  QuotationStatus,
  updateQuotationAction,
} from "../features/quotations";
import { IActionLog } from "../model/actionLog";

type QuotationOperators = [
  isFetching: QuotationStatus,
  errorMessage: string,
  allQuotations: IQuotationGrid[],
  currentQuotation: IQuotationGrid,
  currentQuotationRFQ: IRFQGrid,
  allActionLogs: IActionLog[],
  getAllQuotations: () => void,
  initialLoadForPriceChange: (RFQId: string, QuotationId: string) => void,
  getQuotation: (QuotationId: string) => void,
  updateQuotaion: (Quotation: IQuotationGrid) => void,
  getAllActionLogs: () => void,
  createActionLog: (Log: IActionLog) => void
];

export const useQuotation = (): Readonly<QuotationOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const allQuotations = useAppSelector(allQuotationsSelector);
  const currentQuotation = useAppSelector(currentQuotationSelector);
  const currentQuotationRFQ = useAppSelector(currentQuotationRFQSelector);
  const allActionLogs = useAppSelector(allActionLogsSelector);
  const getAllQuotations = useCallback(() => {
    return dispatch(getAllQuotationsAction());
  }, [dispatch]);
  const initialLoadForPriceChange = useCallback(
    async (RFQId: string, QuotationId: string) => {
      await dispatch(getCurrentQuotationAction(QuotationId));
      await dispatch(getCurrentQuotationRFQAction(RFQId));
    },
    [dispatch]
  );
  const getQuotation = useCallback(
    (QuotationId: string) => {
      return dispatch(getCurrentQuotationAction(QuotationId));
    },
    [dispatch]
  );
  const updateQuotation = useCallback(
    (Quotation: IQuotationGrid) => {
      return dispatch(updateQuotationAction(Quotation));
    },
    [dispatch]
  );
  const getAllActionLogs = useCallback(() => {
    return dispatch(getAllActionLogsAction());
  }, [dispatch]);
  const createActionLog = useCallback(
    (Log: IActionLog) => {
      return dispatch(createActionLogAction(Log));
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    allQuotations,
    currentQuotation,
    currentQuotationRFQ,
    allActionLogs,
    getAllQuotations,
    initialLoadForPriceChange,
    getQuotation,
    updateQuotation,
    getAllActionLogs,
    createActionLog,
  ] as const;
};
