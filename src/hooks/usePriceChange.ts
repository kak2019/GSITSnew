import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  isFetchingSelector,
  messageSelector,
  priceChangeRequestListSelector,
  currentPriceChangeRequestSelector,
  currentPriceChangeRequestSubItemListSelector,
  getSupplierRequestListAction,
  getSupplierRequestAction,
  getSupplierRequestSubitemListAction,
  getSupplierRequestSubitemListByFilterAction,
  createSupplierRequestAction,
  updateSupplierRequestAction,
  createSupplierRequestSubitemsAction,
  updateSupplierRequestSubitemsAction,
  deleteSupplierRequestSubitemsAction,
  setCurrentPriceChangeRequestAction,
} from "../features/priceChange";
import {
  ISupplierRequestFormModel,
  ISupplierRequestCreteriaModel,
  ISupplierRequest,
  ISupplierRequestSubItemFormModel,
  ISupplierRequestSubItem,
} from "../model/priceChange";
import { getENegotiationRequestListAction } from "../features/eNegotiation";
import { IENegotiationRequest } from "../model/eNegotiation";

type PriceChangeOperators = [
  isFetching: boolean,
  errorMessage: string,
  priceChangeRequestList: ISupplierRequest[],
  currentPriceChangeRequest: ISupplierRequest,
  currentPriceChangeRequestSubItemList: ISupplierRequestSubItem[],
  getSupplierRequestList: (
    query: ISupplierRequestCreteriaModel
  ) => Promise<ISupplierRequest[]>,
  getSupplierRequest: (id: string) => Promise<ISupplierRequest>,
  getSupplierRequestSubitemList: (
    id: string
  ) => Promise<ISupplierRequestSubItem[]>,
  createSupplierRequest: (form: ISupplierRequestFormModel) => Promise<string>,
  updateSupplierRequest: (form: ISupplierRequestFormModel) => Promise<void>,
  setCurrentPriceChangeRequest: (form: ISupplierRequestFormModel) => void,
  createSupplierRequestSubitems: (
    forms: ISupplierRequestSubItemFormModel[]
  ) => Promise<string[]>,
  updateSupplierRequestSubitems: (
    forms: ISupplierRequestSubItemFormModel[]
  ) => Promise<void>,
  deleteSupplierRequestSubitems: (ids: string[]) => Promise<void>
];

export const usePriceChange = (): Readonly<PriceChangeOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const priceChangeRequestList = useAppSelector(priceChangeRequestListSelector);
  const currentPriceChangeRequest = useAppSelector(
    currentPriceChangeRequestSelector
  );
  const currentPriceChangeRequestSubItemList = useAppSelector(
    currentPriceChangeRequestSubItemListSelector
  );
  const getSupplierRequestList = useCallback(
    async (
      query: ISupplierRequestCreteriaModel
    ): Promise<ISupplierRequest[]> => {
      // ResponsibleBuyer param is ‘porg handler'
      const tempQuery = { ...query };
      if (query.ResponsibleBuyer) {
        const splitResponsibleBuyer = query.ResponsibleBuyer.split(" ");
        if (splitResponsibleBuyer.length !== 2) {
          throw new Error("Error Get Supplier Request List");
        }
        const Porg = splitResponsibleBuyer[0];
        const Handler = Number(splitResponsibleBuyer[1]);
        // fitst search subitems
        const subitemsResult = await dispatch(
          getSupplierRequestSubitemListByFilterAction({ Porg, Handler })
        );
        if (
          getSupplierRequestSubitemListByFilterAction.fulfilled.match(
            subitemsResult
          )
        ) {
          const supplierRequestIds = subitemsResult.payload.map((item) =>
            Number(item.RequestIDRef)
          );
          // handle query
          tempQuery.IDS = supplierRequestIds;
        } else {
          throw new Error("Error Get Supplier Request List");
        }
      }
      const result = await dispatch(getSupplierRequestListAction(tempQuery));
      if (getSupplierRequestListAction.fulfilled.match(result)) {
        return result.payload as ISupplierRequest[];
      } else {
        throw new Error("Error Get Supplier Request List");
      }
    },
    [dispatch]
  );
  const getSupplierRequest = useCallback(
    async (id: string): Promise<ISupplierRequest> => {
      const result = await dispatch(getSupplierRequestAction(id));
      if (getSupplierRequestAction.fulfilled.match(result)) {
        return result.payload as ISupplierRequest;
      } else {
        throw new Error("Error Get Supplier Request");
      }
    },
    [dispatch]
  );
  const getSupplierRequestSubitemList = useCallback(
    async (id: string): Promise<ISupplierRequestSubItem[]> => {
      const subitemsResult = await dispatch(
        getSupplierRequestSubitemListAction(id)
      );
      if (getSupplierRequestSubitemListAction.fulfilled.match(subitemsResult)) {
        const tempSubitemsResult =
          subitemsResult.payload as ISupplierRequestSubItem[];
        const eNegotiationListResult = await dispatch(
          getENegotiationRequestListAction({
            SupplierRequestID: id,
          })
        );
        if (
          getENegotiationRequestListAction.fulfilled.match(
            eNegotiationListResult
          )
        ) {
          const tempENegotiationListResult =
            eNegotiationListResult.payload as IENegotiationRequest[];
          const mapping: Record<string, string> = {};
          tempENegotiationListResult.forEach((item) => {
            if (item.RFQNo) {
              const key = `${item.Porg} ${item.Handler}`;
              mapping[key] = item.RFQNo;
            }
          });
          tempSubitemsResult.forEach((item) => {
            const key = `${item.Porg} ${item.Handler}`;
            if (mapping[key]) {
              item.RFQNo = mapping[key];
            }
          });
          return tempSubitemsResult;
        } else {
          throw new Error("Error Get Supplier Request Subitem List");
        }
      } else {
        throw new Error("Error Get Supplier Request Subitem List");
      }
    },
    [dispatch]
  );
  const createSupplierRequest = useCallback(
    async (form: ISupplierRequestFormModel): Promise<string> => {
      const result = await dispatch(createSupplierRequestAction(form));
      if (createSupplierRequestAction.fulfilled.match(result)) {
        return result.payload as string;
      } else {
        throw new Error("Error Create Supplier Request");
      }
    },
    [dispatch]
  );
  const updateSupplierRequest = useCallback(
    async (form: ISupplierRequestFormModel): Promise<void> => {
      await dispatch(updateSupplierRequestAction(form));
    },
    [dispatch]
  );
  const createSupplierRequestSubitems = useCallback(
    async (forms: ISupplierRequestSubItemFormModel[]): Promise<string[]> => {
      const result = await dispatch(createSupplierRequestSubitemsAction(forms));
      if (createSupplierRequestSubitemsAction.fulfilled.match(result)) {
        return result.payload as string[];
      } else {
        throw new Error("Error Create Supplier Request Subitems");
      }
    },
    [dispatch]
  );
  const updateSupplierRequestSubitems = useCallback(
    async (forms: ISupplierRequestSubItemFormModel[]): Promise<void> => {
      await dispatch(updateSupplierRequestSubitemsAction(forms));
    },
    [dispatch]
  );
  const deleteSupplierRequestSubitems = useCallback(
    async (ids: string[]): Promise<void> => {
      await dispatch(deleteSupplierRequestSubitemsAction(ids));
    },
    [dispatch]
  );
  const setCurrentPriceChangeRequest = useCallback(
    (form: ISupplierRequestFormModel): void => {
      dispatch(setCurrentPriceChangeRequestAction(form));
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    priceChangeRequestList,
    currentPriceChangeRequest,
    currentPriceChangeRequestSubItemList,
    getSupplierRequestList,
    getSupplierRequest,
    getSupplierRequestSubitemList,
    createSupplierRequest,
    updateSupplierRequest,
    setCurrentPriceChangeRequest,
    createSupplierRequestSubitems,
    updateSupplierRequestSubitems,
    deleteSupplierRequestSubitems,
  ] as const;
};
