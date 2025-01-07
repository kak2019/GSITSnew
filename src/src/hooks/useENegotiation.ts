import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  isFetchingSelector,
  messageSelector,
  eNegotiationRequestListSelector,
  getENegotiationRequestListAction,
  createENegotiationRequestAction,
  updateENegotiationRequestAction,
  deleteENegotiationRequestsAction,
} from "../features/eNegotiation";
import {
  IENegotiationRequestFormModel,
  IENegotiationRequestCreteriaModel,
  IENegotiationRequest,
} from "../model/eNegotiation";

type ENegotiationOperators = [
  isFetching: boolean,
  errorMessage: string,
  eNegotiationRequestList: IENegotiationRequest[],
  getENegotiationRequestList: (
    query: IENegotiationRequestCreteriaModel
  ) => Promise<IENegotiationRequest[]>,
  createENegotiationRequest: (
    form: IENegotiationRequestFormModel
  ) => Promise<string>,
  updateENegotiationRequest: (
    form: IENegotiationRequestFormModel
  ) => Promise<void>,
  deleteENegotiationRequests: (ids: string[]) => Promise<void>
];

export const useENegotiation = (): Readonly<ENegotiationOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const eNegotiationRequestList = useAppSelector(
    eNegotiationRequestListSelector
  );

  const getENegotiationRequestList = useCallback(
    async (
      query: IENegotiationRequestCreteriaModel
    ): Promise<IENegotiationRequest[]> => {
      const result = await dispatch(getENegotiationRequestListAction(query));
      if (getENegotiationRequestListAction.fulfilled.match(result)) {
        return result.payload as IENegotiationRequest[];
      } else {
        throw new Error("Error get ENegotiation Request List");
      }
    },
    [dispatch]
  );
  const createENegotiationRequest = useCallback(
    async (form: IENegotiationRequestFormModel): Promise<string> => {
      const result = await dispatch(createENegotiationRequestAction(form));
      if (createENegotiationRequestAction.fulfilled.match(result)) {
        return result.payload as string;
      } else {
        throw new Error("Error create ENegotiation Request");
      }
    },
    [dispatch]
  );
  const updateENegotiationRequest = useCallback(
    async (form: IENegotiationRequestFormModel): Promise<void> => {
      await dispatch(updateENegotiationRequestAction(form));
    },
    [dispatch]
  );
  const deleteENegotiationRequests = useCallback(
    async (ids: string[]): Promise<void> => {
      await dispatch(deleteENegotiationRequestsAction(ids));
    },
    [dispatch]
  );

  return [
    isFetching,
    errorMessage,
    eNegotiationRequestList,
    getENegotiationRequestList,
    createENegotiationRequest,
    updateENegotiationRequest,
    deleteENegotiationRequests,
  ] as const;
};
