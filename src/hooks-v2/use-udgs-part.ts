import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  acceptReturnAction,
  currentPartSelector,
  currentPartsSelector,
  currentPartWithQuotationSelector,
  getPartByIDAction,
  getPartsByRFQIDAction,
  getPartWithQuotationByRFQIDAction,
  isFetchingSelector,
  messageSelector,
  putPartAction,
  queryPartsAction,
} from "../features-v2/udgs-part";
import {
  IUDGSAcceptReturnModel,
  IUDGSNewPartCreteriaModel,
  IUDGSNewPartFormModel,
  IUDGSNewPartGridModel,
  IUDGSNewPartQuotationGridModel,
} from "../model-v2/udgs-part-model";
import {IUDGSNegotiationPartGridModel} from "../model-v2/udgs-negotiation-model";

type PartOperators = [
  isFetching: boolean,
  errorMessage: string,
  currentPartWithQuotation: IUDGSNewPartQuotationGridModel[],
  currentPart: IUDGSNewPartGridModel,
  currentParts: IUDGSNewPartGridModel[],
  queryParts: (
    creteria: IUDGSNewPartCreteriaModel
  ) => Promise<IUDGSNewPartGridModel[]>,
  getPartWithQuotationByRFQID: (arg:{rfqID: number,type:string}) => Promise<void>,
  getPartByID: (partID: number) => Promise<IUDGSNewPartGridModel>,
  getPartsByRFQID: (rfqID: number) => Promise<IUDGSNewPartGridModel[]>,
  putPart: (part: IUDGSNewPartFormModel) => Promise<void>,
  acceptReturn: (arg: IUDGSAcceptReturnModel[]) => Promise<void>
];

export const useUDGSPart = (): Readonly<PartOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const currentPartWithQuotation:IUDGSNewPartQuotationGridModel[] | IUDGSNegotiationPartGridModel[] = useAppSelector(
    currentPartWithQuotationSelector
  );
  const currentPart = useAppSelector(currentPartSelector);
  const currentParts = useAppSelector(currentPartsSelector);
  const queryParts = useCallback(
    async (
      creteria: IUDGSNewPartCreteriaModel
    ): Promise<IUDGSNewPartGridModel[]> => {
      const actionResult = await dispatch(queryPartsAction(creteria));
      if (queryPartsAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Query Parts");
    },
    [dispatch]
  );
  const getPartWithQuotationByRFQID = useCallback(
    async (arg:{rfqID: number,type:string}): Promise<void> => {
      const actionResult = await dispatch(
        getPartWithQuotationByRFQIDAction(arg)
      );
      if (getPartWithQuotationByRFQIDAction.fulfilled.match(actionResult)) {
        return;
      }
      throw new Error("Error When Fetching Parts");
    },
    [dispatch]
  );
  const getPartByID = useCallback(
    async (partID: number): Promise<IUDGSNewPartGridModel> => {
      const actionResult = await dispatch(getPartByIDAction(partID));
      if (getPartByIDAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching Parts");
    },
    [dispatch]
  );
  const getPartsByRFQID = useCallback(
    async (rfqID: number): Promise<IUDGSNewPartGridModel[]> => {
      const result = await dispatch(getPartsByRFQIDAction(rfqID));
      return result.payload as IUDGSNewPartGridModel[];
    },
    [dispatch]
  );
  const putPart = useCallback(
    async (part: IUDGSNewPartFormModel): Promise<void> => {
      const actionResult = await dispatch(putPartAction(part));
      if (putPartAction.fulfilled.match(actionResult)) {
        return;
      }
      throw new Error("Error When Update Part");
    },
    [dispatch]
  );
  const acceptReturn = useCallback(
    async (arg: IUDGSAcceptReturnModel[]): Promise<void> => {
      const actionResult = await dispatch(acceptReturnAction(arg));
      if (acceptReturnAction.fulfilled.match(actionResult)) {
        return;
      }
      throw new Error("Error When Trying To Accept/Return");
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    currentPartWithQuotation,
    currentPart,
    currentParts,
    queryParts,
    getPartWithQuotationByRFQID,
    getPartByID,
    getPartsByRFQID,
    putPart,
    acceptReturn,
  ] as const;
};
