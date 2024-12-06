import { createAsyncThunk } from "@reduxjs/toolkit";
import { spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from "../../pnpjsConfig";
import { MESSAGE } from "../../config/message";
import { IQuotationGrid } from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";
import { IRFQGrid } from "../../model/rfq";
import { CONST, FeatureKey } from "../../config/const";
import { IActionLog } from "../../model/actionLog";

//#region actions
export const getAllQuotationsAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getAllQuotations`,
  async (): Promise<IQuotationGrid[]> => {
    const sp = spfi(getSP());
    try {
      let items: IQuotationGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_REQUISITION)
          .items.top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              PartNumber: item.PartNumber,
              Qualifier: item.Qualifier,
              PartDescription: item.PartDescription,
              PartIssue: item.PartIssue,
              DrawingNo: item.DrawingNo_x002e_,
              Status: item.Status,
              OrderType: item.OrderType,
              MaterialUser: item.MaterialUser,
              Suffix: item.Suffix,
              Porg: item.Porg,
              HandlerId: item.Handler,
              BuyerName: item.BuyerName,
              PARMA: item.Parma,
              NamedPlace: item.NamedPlace,
              NamedPlaceDescription: item.NamedPlaceDescription,
              SurfaceTreatmentCode: item.SurfaceTreatmentCode,
              CountryOfOrigin: item.CountryofOrigin,
              OrderCoverageTime: item.OrderCoverageTime,
              FirstLot: item.FirstLot,
              SupplierPartNumber: item.SupplierPartNumber,
              Currency: item.Currency,
              UnitOfPrice: item.UOM,
              QuotedUnitPriceTtl: item.QuotedUnitPrice,
              OrderPriceStatusCode: item.PriceType,
              QuotedToolingPriceTtl: item.QuotedToolingPriceTtl,
              QuotedOneTimePaymentTtl: item.QuotedOneTimePaymentTtl,
              MaterialsCostsTtl: item.MaterialsCostsTtl,
              PurchasedPartsCostsTtl: item.PurchasedPartsCostsTtl,
              ProcessingCostsTtl: item.ProcessingCostsTtl,
              ToolingJigDeprCostTtl: item.ToolingJigDeprCostTtl,
              AdminExpProfit: item.AdminExp_x002f_Profit,
              PackingAndDistributionCosts: item.PackingandDistributionCosts,
              Other: item.Other,
              QuotedBasicUnitPriceTtl: item.QuotedBasicUnitPriceTtl,
              PaidProvPartsCost: item.PaidProvPartsCost,
              SuppliedMtrCost: item.SuppliedMtrCost,
              CommentHistory: item.CommentHistory,
            } as IQuotationGrid;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }

      return items;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getAllQuotations) - ${JSON.stringify(err)}`,
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
export const getCurrentQuotationAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getCurrentQuotation`,
  async (QuotationId: string): Promise<IQuotationGrid> => {
    const sp = spfi(getSP());
    try {
      let items: IQuotationGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_REQUISITION)
          .items.top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              PartNumber: item.PartNumber,
              Qualifier: item.Qualifier,
              PartDescription: item.PartDescription,
              PartIssue: item.PartIssue,
              DrawingNo: item.DrawingNo_x002e_,
              Status: item.Status,
              OrderType: item.OrderType,
              MaterialUser: item.MaterialUser,
              Suffix: item.Suffix,
              Porg: item.Porg,
              HandlerId: item.Handler,
              BuyerName: item.BuyerName,
              PARMA: item.Parma,
              NamedPlace: item.NamedPlace,
              NamedPlaceDescription: item.NamedPlaceDescription,
              SurfaceTreatmentCode: item.SurfaceTreatmentCode,
              CountryOfOrigin: item.CountryofOrigin,
              OrderCoverageTime: item.OrderCoverageTime,
              FirstLot: item.FirstLot,
              SupplierPartNumber: item.SupplierPartNumber,
              Currency: item.Currency,
              UnitOfPrice: item.UOM,
              QuotedUnitPriceTtl: item.QuotedUnitPrice,
              OrderPriceStatusCode: item.PriceType,
              QuotedToolingPriceTtl: item.QuotedToolingPriceTtl,
              QuotedOneTimePaymentTtl: item.QuotedOneTimePaymentTtl,
              MaterialsCostsTtl: item.MaterialsCostsTtl,
              PurchasedPartsCostsTtl: item.PurchasedPartsCostsTtl,
              ProcessingCostsTtl: item.ProcessingCostsTtl,
              ToolingJigDeprCostTtl: item.ToolingJigDeprCostTtl,
              AdminExpProfit: item.AdminExp_x002f_Profit,
              PackingAndDistributionCosts: item.PackingandDistributionCosts,
              Other: item.Other,
              QuotedBasicUnitPriceTtl: item.QuotedBasicUnitPriceTtl,
              PaidProvPartsCost: item.PaidProvPartsCost,
              SuppliedMtrCost: item.SuppliedMtrCost,
              CommentHistory: item.CommentHistory,
              AnnualQty: item.AnnualQty,
              OrderQty: item.OrderQty,
            } as IQuotationGrid;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }
      return items.filter((item) => item.ID.toString() === QuotationId)[0];
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getCurrentQuotation) - ${JSON.stringify(err)}`,
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
export const getCurrentQuotationRFQAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getCurrentQuotationRFQ`,
  async (RFQId: string): Promise<IRFQGrid> => {
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
      return items.filter((item) => item.ID?.toString() === RFQId)[0];
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getCurrentQuotationRFQ) - ${JSON.stringify(
          err
        )}`,
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
export const updateQuotationAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/updateQuotation`,
  async (Quotation: IQuotationGrid): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+Quotation.ID!)
        .update({
          ID: Quotation.ID,
          PartNumber: Quotation.PartNumber,
          Qualifier: Quotation.Qualifier,
          PartDescription: Quotation.PartDescription,
          PartIssue: Quotation.PartIssue,
          DrawingNo_x002e_: Quotation.DrawingNo,
          Status: Quotation.Status,
          OrderType: Quotation.OrderType,
          MaterialUser: Quotation.MaterialUser,
          Suffix: Quotation.Suffix,
          Porg: Quotation.Porg,
          Handler: Quotation.HandlerId,
          BuyerName: Quotation.BuyerName,
          Parma: Quotation.PARMA,
          NamedPlace: Quotation.NamedPlace,
          NamedPlaceDescription: Quotation.NamedPlaceDescription,
          SurfaceTreatmentCode: Quotation.SurfaceTreatmentCode,
          CountryofOrigin: Quotation.CountryOfOrigin,
          OrderCoverageTime: Quotation.OrderCoverageTime,
          FirstLot: Quotation.FirstLot,
          SupplierPartNumber: Quotation.SupplierPartNumber,
          Currency: Quotation.Currency,
          UOM: Quotation.UnitOfPrice,
          QuotedUnitPrice: Quotation.QuotedUnitPriceTtl,
          PriceType: Quotation.OrderPriceStatusCode,
          QuotedToolingPriceTtl: Quotation.QuotedToolingPriceTtl,
          QuotedOneTimePaymentTtl: Quotation.QuotedOneTimePaymentTtl,
          MaterialsCostsTtl: Quotation.MaterialsCostsTtl,
          PurchasedPartsCostsTtl: Quotation.PurchasedPartsCostsTtl,
          ProcessingCostsTtl: Quotation.ProcessingCostsTtl,
          ToolingJigDeprCostTtl: Quotation.ToolingJigDeprCostTtl,
          AdminExp_x002f_Profit: Quotation.AdminExpProfit,
          PackingandDistributionCosts: Quotation.PackingAndDistributionCosts,
          Other: Quotation.Other,
          QuotedBasicUnitPriceTtl: Quotation.QuotedBasicUnitPriceTtl,
          PaidProvPartsCost: Quotation.PaidProvPartsCost,
          SuppliedMtrCost: Quotation.SuppliedMtrCost,
          CommentHistory: Quotation.CommentHistory,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateQuotaion) - ${JSON.stringify(err)}`,
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
export const getAllActionLogsAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getAllActionLogs`,
  async (): Promise<IActionLog[]> => {
    const sp = spfi(getSP());
    try {
      let items: IActionLog[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_ACTIONLOG)
          .items.top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              User: item.User,
              Date: item.Date,
              LogType: item.LogType,
              RFQId: item.RFQId,
              RequisitionId: item.RequisitionId,
            } as IActionLog;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }
      return items;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getAllActionLogs) - ${JSON.stringify(err)}`,
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
export const createActionLogAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/createActionLog`,
  async (log: IActionLog): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const addItemResult = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ACTIONLOG)
        .items.add({
          Title: log.LogType,
          User: log.User,
          Date: log.Date,
          LogType: log.LogType,
          RFQId: String(log.RFQId),
          RequisitionId: String(log.RequisitionId),
        });
      return addItemResult.ID;
    } catch (err) {
        console.error("Error creating action log:", err);
      Logger.write(
        `${CONST.LOG_SOURCE} (_createActionLog) - ${JSON.stringify(err)}`,
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
export const AcceptOrReturnAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/acceptOrReturn`,
  async (arg: {
    Action: string;
    QuotationId: string;
    Comment: string;
  }): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+arg.QuotationId)
        .update({
          ID: arg.QuotationId,
          IsReturned: arg.Action === "Returned" ? "True" : "",
          Status: arg.Action,
          CommentHistory: arg.Comment,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateRequisitionStatus) - ${JSON.stringify(
          err
        )}`,
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
//#endregion
//#region methods
//#endregion
