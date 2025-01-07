import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import { IRFQGrid, IRFQQueryModel, IRFQRequisition } from "../../model/rfq";
import { IRequisitionRFQGrid } from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";
import { IComment } from "../../model/comment";
import {
  camlAndFinal,
  camlChoiceMultipleText,
  camlContainsText,
  camlEqChoice,
  camlEqText,
  camlGeqDate,
  camlLtDate,
} from "../../common/camlHelper";

//#region actions
export const getAllRFQsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/getAllRFQs`,
  async (): Promise<IRFQGrid[]> => {
    const sp = spfi(getSP());
    try {
      let items: IRFQGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_RFQ)
          .items.select(
            "ID",
            "Title",
            "Parma",
            "SupplierContact",
            "RFQDueDate",
            "OrderType",
            "RFQInstructionToSupplier",
            "RFQStatus",
            "BuyerInfo",
            "SectionInfo",
            "CommentHistory",
            "RequisitionIds",
            "QuoteReceivedDate",
            "ReasonofRFQ",
            "EffectiveDateRequest",
            "HandlerName",
            "RFQNo_x002e_",
            "Created",
            "RFQType"
          )
          .top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              Title: item.Title,
              Parma: item.Parma,
              SupplierContact: item.SupplierContact,
              RFQDueDate: item.RFQDueDate,
              OrderType: item.OrderType,
              RFQInstructionToSupplier: item.RFQInstructionToSupplier,
              RFQStatus: item.RFQStatus,
              BuyerInfo: item.BuyerInfo,
              SectionInfo: item.SectionInfo,
              CommentHistory: item.CommentHistory,
              RequisitionIds: item.RequisitionIds,
              QuoteReceivedDate: item.QuoteReceivedDate,
              ReasonOfRFQ: item.ReasonofRFQ,
              EffectiveDateRequest: item.EffectiveDateRequest,
              HandlerName: item.HandlerName,
              RFQNo: item.RFQNo_x002e_,
              Created: item.Created,
              RFQType: item.RFQType,
            } as IRFQGrid;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }
      return items;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getAllRFQs) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.retrieveDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const getRFQAction = createAsyncThunk(
  `${FeatureKey.RFQS}/getRFQ`,
  async (rfqId: string): Promise<IRFQRequisition> => {
    const sp = spfi(getSP());
    try {
      let rfqItems: IRFQGrid[] = [];
      let hasNextRFQ = true;
      let pageIndexRFQ = 0;
      let requisitionItems: IRequisitionRFQGrid[] = [];
      let hasNextRequisition = true;
      let pageIndexRequisition = 0;
      while (hasNextRequisition) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_REQUISITION)
          .items.top(5000)
          .skip(pageIndexRequisition * 5000)();
        requisitionItems = requisitionItems.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              PartNumber: item.PartNumber,
              Qualifier: item.Qualifier,
              PartDescription: item.PartDescription,
              MaterialUser: item.MaterialUser,
              AnnualQty: item.AnnualQty,
              OrderQty: item.OrderQty,
              QuotedUnitPrice: item.QuotedUnitPrice,
              Currency: item.Currency,
              UOP: item.UOP,
              EffectiveDate: item.EffectiveDate,
              PartStatus: item.Status,
              LastCommentBy: FetchLastComment(item.CommentHistory),
              BuyerName: item.BuyerName,
              Suffix: item.Suffix,
              OrderCoverageTime: item.OrderCoverageTime,
              NamedPlace: item.NamedPlace,
              NamedPlaceDescription: item.NamedPlaceDescription,
              FirstLot: item.FirstLot,
              CountryOfOrigin: item.CountryofOrigin,
              QuotedBasicUnitPriceTtl: item.QuotedBasicUnitPriceTtl,
              OrderPriceStatusCode: item.PriceType,
              MaterialsCostsTtl: item.MaterialsCostsTtl,
              PurchasedPartsCostsTtl: item.PurchasedPartsCostsTtl,
              ProcessingCostsTtl: item.ProcessingCostsTtl,
              ToolingJigDeprCostTtl: item.ToolingJigDeprCostTtl,
              AdminExpProfit: item.AdminExp_x002f_Profit,
              PackingAndDistributionCosts: item.PackingandDistributionCosts,
              Other: item.Other,
              PaidProvPartsCost: item.PaidProvPartsCost,
              SuppliedMtrCost: item.SuppliedMtrCost,
              PartIssue: item.PartIssue,
              SurfaceTreatmentCode: item.SurfaceTreatmentCode,
              DrawingNo: item.DrawingNo_x002e_,
              Porg: item.Porg,
              Handler: item.Handler,
              Parma: item.Parma,
              StandardOrderText1: item.StandardOrderText1,
              StandardOrderText2: item.StandardOrderText2,
              StandardOrderText3: item.StandardOrderText3,
              FreePartText: item.FreePartText,
              OrderNumber: item.OrderNumber,
              HandlerName: item.HandlerName,
                PriceType:item.PriceType,
            } as IRequisitionRFQGrid;
          })
        );
        hasNextRequisition = response.length === 5000;
        pageIndexRequisition += 1;
      }
      while (hasNextRFQ) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_RFQ)
          .items.select(
            "ID",
            "RFQNo_x002e_",
            "Created",
            "Parma",
            "RFQDueDate",
            "OrderType",
            "SupplierContact",
            "RFQInstructionToSupplier",
            "RFQStatus",
            "LatestQuoteDate",
            "CommentHistory",
            "RequisitionIds",
            "SupplierName"
          )
          .top(5000)
          .skip(pageIndexRFQ * 5000)();
        rfqItems = rfqItems.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              RFQNo: item.RFQNo_x002e_,
              Created: item.Created,
              Parma: item.Parma,
              RFQDueDate: item.RFQDueDate,
              OrderType: item.OrderType,
              SupplierContact: item.SupplierContact,
              RFQInstructionToSupplier: item.RFQInstructionToSupplier,
              RFQStatus: item.RFQStatus,
              LatestQuoteDate: item.LatestQuoteDate,
              CommentHistory: item.CommentHistory,
              RequisitionIds: item.RequisitionIds,
              SupplierName: item.SupplierName,
            } as IRFQGrid;
          })
        );
        hasNextRFQ = response.length === 5000;
        pageIndexRFQ += 1;
      }
      const currentRFQ = rfqItems.filter(
        (item) => item.ID?.toString() === rfqId
      )[0];
      const requisitionIds: string[] = JSON.parse(
        JSON.stringify(currentRFQ.RequisitionIds)
      );
      const requisitions = requisitionItems.filter(
        (item) => requisitionIds && requisitionIds.indexOf(item.ID) !== -1
      );
      return {
        RFQ: currentRFQ,
        Requisitions: requisitions,
      } as IRFQRequisition;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getRFQ) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.retrieveDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const updateRFQAction = createAsyncThunk(
  `${FeatureKey.RFQS}/updateRFQ`,
  async (rfq: IRFQGrid): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQ)
        .items.getById(+rfq.ID!)
        .update({
          ID: rfq.ID,
          Title: rfq.Title,
          Parma: rfq.Parma,
          SupplierContact: rfq.SupplierContact,
          RFQDueDate: rfq.RFQDueDate,
          OrderType: rfq.OrderType,
          RFQInstructionToSupplier: rfq.RFQInstructionToSupplier,
          RFQStatus: rfq.RFQStatus,
          BuyerInfo: rfq.BuyerInfo,
          SectionInfo: rfq.SectionInfo,
          CommentHistory: rfq.CommentHistory,
          RequisitionIds: rfq.RequisitionIds,
          QuoteReceivedDate: rfq.QuoteReceivedDate,
          ReasonofRFQ: rfq.ReasonOfRFQ,
          EffectiveDateRequest: rfq.EffectiveDateRequest,
          HandlerName: rfq.HandlerName,
          RFQNo_x002e_: rfq.RFQNo,
          RFQType: rfq.RFQType,
          LatestQuoteDate: rfq.LatestQuoteDate,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateRFQ) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.updateDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.updateDataFailed);
    }
  }
);
export const createRFQAction = createAsyncThunk(
  `${FeatureKey.RFQS}/createRFQ`,
  async (rfq: IRFQGrid): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const addItemResult = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQ)
        .items.add({
          ID: rfq.ID,
          Title: rfq.Title,
          Parma: rfq.Parma,
          SupplierContact: rfq.SupplierContact,
          RFQDueDate: rfq.RFQDueDate,
          OrderType: rfq.OrderType,
          RFQInstructionToSupplier: rfq.RFQInstructionToSupplier,
          RFQStatus: rfq.RFQStatus,
          BuyerInfo: rfq.BuyerInfo,
          SectionInfo: rfq.SectionInfo,
          CommentHistory: rfq.CommentHistory,
          RequisitionIds: rfq.RequisitionIds,
          QuoteReceivedDate: rfq.QuoteReceivedDate,
          ReasonofRFQ: rfq.ReasonOfRFQ,
          EffectiveDateRequest: rfq.EffectiveDateRequest,
          HandlerName: rfq.HandlerName,
          RFQNo_x002e_: rfq.RFQNo,
          RFQType: rfq.RFQType,
          BuyerName: rfq.BuyerName,
          BuyerEmail: rfq.BuyerEmail,
          SupplierName: rfq.SupplierName,
        });
      return addItemResult.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_createRFQ) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.createDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.createDataFailed);
    }
  }
);
export const queryRFQsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/queryRFQs`,
  async (Query: IRFQQueryModel): Promise<IRFQGrid[]> => {
    const sp = spfi(getSP());
    try {
      const queryXml = GetQueryInfo(Query);
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQ)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        ${queryXml}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      return response.Row.map((item) => {
        return {
          ID: item.ID,
          Title: item.Title,
          Parma: item.Parma,
          SupplierContact: item.SupplierContact,
          RFQDueDate: item.RFQDueDate,
          OrderType: item.OrderType,
          RFQInstructionToSupplier: item.RFQInstructionToSupplier,
          RFQStatus: item.RFQStatus,
          BuyerInfo: item.BuyerInfo,
          SectionInfo: item.SectionInfo,
          CommentHistory: item.CommentHistory,
          RequisitionIds: item.RequisitionIds,
          QuoteReceivedDate: item.QuoteReceivedDate,
          ReasonOfRFQ: item.ReasonofRFQ,
          EffectiveDateRequest: item.EffectiveDateRequest,
          HandlerName: item.HandlerName,
          RFQNo: item.RFQNo_x002e_,
          Created: item.Created,
          RFQType: item.RFQType,
        } as IRFQGrid;
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_queryRFQs) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.retrieveDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export //#endregion
//#region methods
function FetchLastComment(comments: string): string {
  if (!comments) {
    return "";
  }
  const commentHistory: IComment[] = JSON.parse(comments);
  if (commentHistory.length === 0) {
    return "";
  }
  commentHistory.sort((a, b) => {
    return (
      new Date(b.CommentDate).getTime() - new Date(a.CommentDate).getTime()
    );
  });
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateString = new Intl.DateTimeFormat("js-JP", options).format(
    new Date(commentHistory[0].CommentDate)
  );
  return `${formattedDateString.split(",")[0]} ${commentHistory[0].CommentBy}`;
}
function GetQueryInfo(queryCreteria: IRFQQueryModel): string {
  const creterias: string[] = [];
  if (queryCreteria.RfqType) {
    if (queryCreteria.RfqType.length > 0) {
      creterias.push(camlEqChoice(queryCreteria.RfqType, "RFQType"));
    }
  }
  if (queryCreteria.RfqNo) {
    creterias.push(camlContainsText(queryCreteria.RfqNo, "RFQNo_x002e_"));
  }
  if (queryCreteria.Buyer) {
    creterias.push(camlContainsText(queryCreteria.Buyer, "BuyerInfo"));
  }
  if (queryCreteria.Section) {
    creterias.push(camlContainsText(queryCreteria.Section, "SectionInfo"));
  }
  if (queryCreteria.Status) {
    if (queryCreteria.Status.length > 0) {
      creterias.push(camlChoiceMultipleText("RFQStatus", queryCreteria.Status));
    }
  }
  if (queryCreteria.ParmaAccurate) {
    creterias.push(camlEqText(queryCreteria.ParmaAccurate, "Parma"));
  }
  if (queryCreteria.ParmaBlur) {
    creterias.push(camlContainsText(queryCreteria.ParmaBlur, "Parma"));
  }
  if (queryCreteria.RfqReleaseDateFrom) {
    creterias.push(camlGeqDate(queryCreteria.RfqReleaseDateFrom, "Created"));
  }
  if (queryCreteria.RfqReleaseDateTo) {
    creterias.push(camlLtDate(queryCreteria.RfqReleaseDateTo, "Created"));
  }
  if (queryCreteria.RfqDueDateFrom) {
    creterias.push(camlGeqDate(queryCreteria.RfqDueDateFrom, "RFQDueDate"));
  }
  if (queryCreteria.RfqDueDateTo) {
    creterias.push(camlLtDate(queryCreteria.RfqDueDateTo, "RFQDueDate"));
  }
  return camlAndFinal(creterias);
}
//#endregion
