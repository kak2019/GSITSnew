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
import { getRFQs } from "../actions/get-rfqs";

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
      // Buyer得拆成porg和handler
      const tempQuery = { ...query };
      if (query.Buyer) {
        const splitBuyer = query.Buyer.split(" ");
        if (splitBuyer.length !== 2) {
          throw new Error("Error get ENegotiation Request List");
        }
        const Porg = splitBuyer[0];
        const Handler = Number(splitBuyer[1]);
        tempQuery.Porg = Porg;
        tempQuery.Handler = Handler;
      }
      // 获取rfq id和status的mapping
      const mapping: Record<number, string> = {};
      if (query.RFQStatus && query.RFQStatus.length) {
        // 需要去rfq表查这个status的数据，把所有数据的id拿回来
        const rfqs = await getRFQs({ RFQStatus: query.RFQStatus });
        const ids = rfqs.map((item) => {
          mapping[item.ID] = item.RFQStatus;
          return item.ID;
        });
        tempQuery.RFQIDRefs = ids;
      } else {
        // 查所有的rfq数据
        const rfqs = await getRFQs({});
        rfqs.forEach((item) => {
          mapping[item.ID] = item.RFQStatus;
        });
      }
      // 拿到的result没有rfq status
      const tempResult = await dispatch(
        getENegotiationRequestListAction(tempQuery)
      );
      if (getENegotiationRequestListAction.fulfilled.match(tempResult)) {
        const result = tempResult.payload.map((item) => {
          const id = item.RFQIDRef ?? -1;
          const RFQStatus = mapping[id] ?? "";
          return {
            ...item,
            RFQStatus,
          };
        });
        return result as IENegotiationRequest[];
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
