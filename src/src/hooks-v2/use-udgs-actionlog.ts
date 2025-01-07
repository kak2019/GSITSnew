import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  IUDGSActionlogFormModel,
  IUDGSActionlogGridModel,
} from "../model-v2/udgs-actionlog-model";
import {
  currentActionlogsSelector,
  getActionlogsByPartIDAction,
  getActionlogsByRFQIDAction,
  isFetchingSelector,
  messageSelector,
  postActionlogAction,
} from "../features-v2/udgs-actionlog";

type ActionlogOperators = [
  isFetching: boolean,
  errorMessage: string,
  currentActionlogs: IUDGSActionlogGridModel[],
  getActionlogsByPartID: (partID: number) => Promise<IUDGSActionlogGridModel[]>,
  getActionlogsByRFQID: (RFQID: number) => Promise<IUDGSActionlogGridModel[]>,
  postActionlog: (actionlog: IUDGSActionlogFormModel) => Promise<number>
];

export const useUDGSActionlog = (): Readonly<ActionlogOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const currentActionlogs = useAppSelector(currentActionlogsSelector);
  const getActionlogsByPartID = useCallback(
    async (partID: number): Promise<IUDGSActionlogGridModel[]> => {
      const actionResult = await dispatch(getActionlogsByPartIDAction(partID));
      if (getActionlogsByPartIDAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching Actionlogs");
    },
    [dispatch]
  );
  const getActionlogsByRFQID = useCallback(
    async (RFQID: number): Promise<IUDGSActionlogGridModel[]> => {
      const actionResult = await dispatch(getActionlogsByRFQIDAction(RFQID));
      if (getActionlogsByRFQIDAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Fetching Actionlogs");
    },
    [dispatch]
  );
  const postActionlog = useCallback(
    async (actionlog: IUDGSActionlogFormModel): Promise<number> => {
      const actionResult = await dispatch(postActionlogAction(actionlog));
      if (postActionlogAction.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
      throw new Error("Error When Add Actionlog");
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    currentActionlogs,
    getActionlogsByPartID,
    getActionlogsByRFQID,
    postActionlog,
  ] as const;
};
