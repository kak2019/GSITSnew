import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  IUDGSQuotationFormModel,
  IUDGSQuotationGridModel,
} from "../model-v2/udgs-quotation-model";
import {
  currentQuotationSelector,
  getQuotationByIDAction,
  getQuotationByPartIDAction,
  isFetchingSelector,
  messageSelector,
  postQuotationAction,
  putQuotationAction,
} from "../features-v2/udgs-quotation";

type QuotationOperators = [
  isFetching: boolean,
  errorMessage: string,
  currentQuotation: IUDGSQuotationGridModel,
  getQuotationByID: (quotationID: number) => Promise<IUDGSQuotationGridModel>,
  getQuotationByPartID: (partID: number) => Promise<void>,
  postQuotation: (quotation: IUDGSQuotationFormModel) => Promise<number>,
  putQuotation: (quotation: IUDGSQuotationFormModel) => Promise<Date>
];

export const useUDGSQuotation = (): Readonly<QuotationOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const currentQuotation = useAppSelector(currentQuotationSelector);
  const getQuotationByID = useCallback(
    async (quotationID: number): Promise<IUDGSQuotationGridModel> => {
      const actionResult = await dispatch(getQuotationByIDAction(quotationID));
      if (getQuotationByIDAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching Quotation");
    },
    [dispatch]
  );
  const getQuotationByPartID = useCallback(
    async (partID: number): Promise<void> => {
      const actionResult = await dispatch(getQuotationByPartIDAction(partID));
      if (getQuotationByPartIDAction.fulfilled.match(actionResult)) {
        return;
      }
      throw new Error("Error When Fetching Quotation");
    },
    [dispatch]
  );
  const postQuotation = useCallback(
    async (quotation: IUDGSQuotationFormModel): Promise<number> => {
      const result = await dispatch(postQuotationAction(quotation));
      return result.payload as number;
    },
    [dispatch]
  );
  const putQuotation = useCallback(
    async (quotation: IUDGSQuotationFormModel): Promise<Date> => {
      const result = await dispatch(putQuotationAction(quotation));
      return new Date(result.payload as string);
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    currentQuotation,
    getQuotationByID,
    getQuotationByPartID,
    postQuotation,
    putQuotation,
  ] as const;
};
