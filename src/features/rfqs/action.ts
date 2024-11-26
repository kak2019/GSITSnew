import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import { IRFQGrid, IRFQRequisition } from "../../model/rfq";
import { IRequisitionGrid } from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";

//#region actions
export const getAllRFQsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/getAllRFQs`,
  async (): Promise<IRFQGrid[]> => {
    const sp = spfi(getSP());
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      let items: IRFQGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await spCache.web.lists
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
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      let rfqItems: IRFQGrid[] = [];
      let hasNextRFQ = true;
      let pageIndexRFQ = 0;
      let requisitionItems: IRequisitionGrid[] = [];
      let hasNextRequisition = true;
      let pageIndexRequisition = 0;
      while (hasNextRequisition) {
        const response = await spCache.web.lists
          .getByTitle(CONST.LIST_NAME_REQUISITION)
          .items.select(
            "Title",
            "ID",
            "RequisitionType",
            "Section",
            "Status",
            "PartNumber",
            "Qualifier",
            "MaterialUser",
            "Pproject",
            "RFQNumber",
            "Parma",
            "PartDescription",
            "AnnualQty",
            "OrderQty",
            "RequiredWeek",
            "CreatedDate",
            "RequisitionBuyer",
            "HandlerName",
            "BuyerFullInfo"
          )
          .top(5000)
          .skip(pageIndexRequisition * 5000)();
        requisitionItems = requisitionItems.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              UniqueIdentifier: item.Title,
              IsSelected: false,
              RequisitionType: item.RequisitionType,
              Section: item.Section,
              Status: item.Status,
              PartNumber: item.PartNumber,
              Qualifier: item.Qualifier,
              MaterialUser: item.MaterialUser,
              Project: item.Pproject,
              RequiredWeek: item.RequiredWeek,
              CreateDate:
                item.CreatedDate === null
                  ? null
                  : stringToDate(item.CreatedDate),
              RfqNo: item.RFQNumber,
              Parma: item.Parma,
              PartDescription: item.PartDescription,
              AnnualQty: item.AnnualQty,
              OrderQty: item.OrderQty,
              ReqBuyer: item.RequisitionBuyer,
              HandlerName: item.HandlerName,
              BuyerFullInfo: item.BuyerFullInfo,
            } as IRequisitionGrid;
          })
        );
        hasNextRequisition = response.length === 5000;
        pageIndexRequisition += 1;
      }
      while (hasNextRFQ) {
        const response = await spCache.web.lists
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
            "Comment",
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
          .skip(pageIndexRFQ * 5000)();
        rfqItems = rfqItems.concat(
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
              Comment: item.Comment,
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
        hasNextRFQ = response.length === 5000;
        pageIndexRFQ += 1;
      }
      const currentRFQ = rfqItems.filter((item) => item.ID === rfqId)[0];
      const requisitionIds: string[] = JSON.parse(
        JSON.stringify(currentRFQ.RequisitionIds)
      );
      const requisitions = requisitionItems.filter(
        (item) => requisitionIds.indexOf(item.ID) !== -1
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
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      await spCache.web.lists
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
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      const addItemResult = await spCache.web.lists
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
//#endregion
//#region methods
function stringToDate(dateString: string): Date {
  const year = Number(`20${dateString.substring(0, 2)}`);
  const month = Number(dateString.substring(2, 4));
  const day = Number(dateString.substring(4, 6));
  return new Date(year, month, day);
}
// function pad(value: number): string {
//   return value < 10 ? "0" + value : String(value);
// }
// function processDate(dateToBeProcess: string): string {
//   if (!dateToBeProcess) {
//     return "";
//   } else {
//     const dateTime = new Date(dateToBeProcess);
//     const userTimeZoneOffset = dateTime.getTimezoneOffset() * 60000;
//     const dateLocalTime = new Date(dateTime.getTime() - userTimeZoneOffset);
//     const dateDecoded = [];
//     const year = String(dateLocalTime.getUTCFullYear());
//     const month = pad(dateLocalTime.getUTCMonth() + 1);
//     const day = pad(dateLocalTime.getUTCDate());
//     dateDecoded[0] = day;
//     dateDecoded[1] = month;
//     dateDecoded[2] = year;
//     return dateDecoded.join("-");
//   }
// }
//#endregion
