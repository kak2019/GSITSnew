import { useCallback } from "react";
import { IProceedToPoFields, IQuotationGrid } from "../model/requisition";
import { useAppDispatch, useAppSelector } from "./useApp";
import { IRFQGrid } from "../model/rfq";
import {
  AcceptOrReturnAction,
  allActionLogsSelector,
  allQuotationsSelector,
  createActionLogAction,
  currentQuotationRFQSelector,
  currentQuotationSelector,
  getActionLogsAction,
  getAllQuotationsAction,
  getCurrentQuotationAction,
  getCurrentQuotationRFQAction,
  getQuotationAttachmentsAction,
  isFetchingSelector,
  messageSelector,
  postCommentAction,
  ProceedToPoAction,
  quotationAttachmentsSelector,
  updateQuotationAction,
  UploadQuotationAttachmentsAction,
} from "../features/quotations";
import { IActionLog } from "../model/actionLog";
import { IAttachments } from "../model/documents";

type QuotationOperators = [
  isFetching: boolean,
  errorMessage: string,
  allQuotations: IQuotationGrid[],
  currentQuotation: IQuotationGrid,
  currentQuotationRFQ: IRFQGrid,
  allActionLogs: IActionLog[],
  quotationAttachments: IAttachments[],
  getAllQuotations: () => void,
  initialLoadForPriceChange: (
    RFQId: string,
    QuotationId: string
  ) => Promise<void>,
  getQuotation: (QuotationId: string) => void,
  updateQuotaion: (Quotation: IQuotationGrid, RFQId: string) => Promise<void>,
  getActionLogs: (
    Term: "ByRFQId" | "ByRequisitionId",
    RFQId?: string,
    RequisitionId?: string
  ) => void,
  createActionLog: (Log: IActionLog) => void,
  acceptOrReturn: (
    Action: string,
    QuotationId: string,
    Comment: string
  ) => void,
  postComment: (CommentHistory: string, QuotationId: string) => void,
  uploadQuotationAttachments: (
    Attachments: File[],
    QuotationId: string,
    RemoveItemIds: string[]
  ) => void,
  proceedToPo: (Requisition: IProceedToPoFields) => void
];

export const useQuotation = (): Readonly<QuotationOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const allQuotations = useAppSelector(allQuotationsSelector);
  const currentQuotation = useAppSelector(currentQuotationSelector);
  const currentQuotationRFQ = useAppSelector(currentQuotationRFQSelector);
  const allActionLogs = useAppSelector(allActionLogsSelector);
  const quotationAttachments = useAppSelector(quotationAttachmentsSelector);
  const getAllQuotations = useCallback(() => {
    return dispatch(getAllQuotationsAction());
  }, [dispatch]);
  const initialLoadForPriceChange = useCallback(
    async (RFQId: string, QuotationId: string): Promise<void> => {
      await dispatch(getCurrentQuotationAction(QuotationId));
      await dispatch(getCurrentQuotationRFQAction(RFQId));
      await dispatch(getQuotationAttachmentsAction(QuotationId));
    },
    [dispatch]
  );
  const getQuotation = useCallback(
    (QuotationId: string) => {
      return dispatch(getCurrentQuotationAction(QuotationId));
    },
    [dispatch]
  );
  const getAllActionLogs = useCallback(
    (
      Term: "ByRFQId" | "ByRequisitionId",
      RFQId?: string,
      RequisitionId?: string
    ) => {
      return dispatch(
        getActionLogsAction({
          Term,
          RFQId: RFQId,
          RequisitionId: RequisitionId,
        })
      );
    },
    [dispatch]
  );
  const createActionLog = useCallback(
    (Log: IActionLog) => {
      return dispatch(createActionLogAction(Log));
    },
    [dispatch]
  );
  const updateQuotation = useCallback(
    async (Quotation: IQuotationGrid, RFQId: string): Promise<void> => {
      await dispatch(updateQuotationAction(Quotation)).then(
        async (): Promise<void> => {
          await initialLoadForPriceChange(RFQId, Quotation.ID);
          await getAllActionLogs("ByRequisitionId", "", Quotation.ID);
        }
      );
    },
    [dispatch]
  );
  const acceptOrReturn = useCallback(
    (Action: string, QuotationId: string, Comment: string) => {
      return dispatch(AcceptOrReturnAction({ Action, QuotationId, Comment }));
    },
    [dispatch]
  );
  const postComment = useCallback(
    (CommentHistory: string, QuotationId: string) => {
      return dispatch(postCommentAction({ CommentHistory, QuotationId }));
    },
    [dispatch]
  );
  const uploadQuotationAttachments = useCallback(
    (Attachments: File[], QuotationId: string, RemoveItemIds: string[]) => {
      return dispatch(
        UploadQuotationAttachmentsAction({
          Attachments,
          QuotationId,
          RemoveItemIds,
        })
      );
    },
    [dispatch]
  );
  const proceedToPo = useCallback(
    (Requisition: IProceedToPoFields) => {
      return dispatch(ProceedToPoAction(Requisition));
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
    quotationAttachments,
    getAllQuotations,
    initialLoadForPriceChange,
    getQuotation,
    updateQuotation,
    getAllActionLogs,
    createActionLog,
    acceptOrReturn,
    postComment,
    uploadQuotationAttachments,
    proceedToPo,
  ] as const;
};
