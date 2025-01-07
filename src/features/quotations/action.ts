import { createAsyncThunk } from "@reduxjs/toolkit";
import { spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from "../../pnpjsConfig";
import { MESSAGE } from "../../config/message";
import { IProceedToPoFields, IQuotationGrid } from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";
import { IRFQGrid } from "../../model/rfq";
import { CONST, FeatureKey } from "../../config/const";
import { IActionLog } from "../../model/actionLog";
import { camlEqNumber, camlEqText } from "../../common/camlHelper";
import { IAttachments } from "../../model/documents";

//#region properties
const numberFields: string[] = [
  "MaterialUser",
  "Handler",
  "OrderCoverageTime",
  "QuotedUnitPrice",
  "QuotedToolingPriceTtl",
  "QuotedOneTimePaymentTtl",
  "MaterialsCostsTtl",
  "PurchasedPartsCostsTtl",
  "ProcessingCostsTtl",
  "ToolingJigDeprCostTtl",
  "AdminExp_x002f_Profit",
  "PackingandDistributionCosts",
  "Other",
  "QuotedBasicUnitPriceTtl",
  "PaidProvPartsCost",
  "SuppliedMtrCost",
];
//#endregion
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
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
          <Where>
            ${camlEqNumber(Number(QuotationId), "ID")}
          </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const result = response.Row.map((item) => {
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
          HandlerName: item.HandlerName,
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
          UnitOfPrice: item.UOP,
          UOM: item.UOM,
          QuotedUnitPriceTtl: item.QuotedUnitPrice
            ? Number(item.QuotedUnitPrice).toFixed(3)
            : "",
          OrderPriceStatusCode: item.PriceType,
          QuotedToolingPriceTtl: item.QuotedToolingPriceTtl
            ? Number(item.QuotedToolingPriceTtl).toFixed(3)
            : "",
          QuotedOneTimePaymentTtl: item.QuotedOneTimePaymentTtl
            ? Number(item.QuotedOneTimePaymentTtl).toFixed(3)
            : "",
          MaterialsCostsTtl: item.MaterialsCostsTtl
            ? Number(item.MaterialsCostsTtl).toFixed(3)
            : "",
          PurchasedPartsCostsTtl: item.PurchasedPartsCostsTtl
            ? Number(item.PurchasedPartsCostsTtl).toFixed(3)
            : "",
          ProcessingCostsTtl: item.ProcessingCostsTtl
            ? Number(item.ProcessingCostsTtl).toFixed(3)
            : "",
          ToolingJigDeprCostTtl: item.ToolingJigDeprCostTtl
            ? Number(item.ToolingJigDeprCostTtl).toFixed(3)
            : "",
          AdminExpProfit: item.AdminExp_x002f_Profit
            ? Number(item.AdminExp_x002f_Profit).toFixed(3)
            : "",
          PackingAndDistributionCosts: item.PackingandDistributionCosts
            ? Number(item.PackingandDistributionCosts).toFixed(3)
            : "",
          Other: item.Other ? Number(item.Other).toFixed(3) : "",
          QuotedBasicUnitPriceTtl: item.QuotedBasicUnitPriceTtl
            ? Number(item.QuotedBasicUnitPriceTtl).toFixed(3)
            : "",
          PaidProvPartsCost: item.PaidProvPartsCost
            ? Number(item.PaidProvPartsCost).toFixed(3)
            : "",
          SuppliedMtrCost: item.SuppliedMtrCost
            ? Number(item.SuppliedMtrCost).toFixed(3)
            : "",
          CommentHistory: item.CommentHistory,
          AnnualQty: item.AnnualQty,
          OrderQty: item.OrderQty,
          RequiredWeek: item.RequiredWeek,
          RequisitionType: item.RequisitionType,
        } as IQuotationGrid;
      });
      return result[0];
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
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQ)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
          <Where>
            ${camlEqNumber(Number(RFQId), "ID")}
          </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const result = response.Row.map((item) => {
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
          SupplierName: item.SupplierName,
        } as IRFQGrid;
      });
      return result[0];
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
export const postCommentAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/postComment`,
  async (arg: {
    CommentHistory: string;
    QuotationId: string;
  }): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+arg.QuotationId)
        .update({
          CommentHistory: arg.CommentHistory,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_postCommentQuotation) - ${JSON.stringify(err)}`,
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
export const updateQuotationAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/updateQuotation`,
  async (Quotation: IQuotationGrid): Promise<void> => {
    const sp = spfi(getSP());
    try {
      const updatedData = {
        ID: Quotation.ID,
        PartNumber: Quotation.PartNumber,
        Qualifier: Quotation.Qualifier,
        PartDescription: Quotation.PartDescription,
        PartIssue: Quotation.PartIssue,
        DrawingNo_x002e_: Quotation.DrawingNo,
        Status: Quotation.Status,
        IsQuoted: Quotation.Status === "Quoted" ? "Yes" : null,
        OrderType: Quotation.OrderType,
        MaterialUser: parseNumber(Quotation.MaterialUser),
        Suffix: Quotation.Suffix,
        Porg: Quotation.Porg,
        Handler: parseNumber(Quotation.HandlerId),
        BuyerName: Quotation.BuyerName,
        Parma: Quotation.PARMA,
        NamedPlace: Quotation.NamedPlace,
        NamedPlaceDescription: Quotation.NamedPlaceDescription,
        SurfaceTreatmentCode: Quotation.SurfaceTreatmentCode,
        CountryofOrigin: Quotation.CountryOfOrigin,
        OrderCoverageTime: parseNumber(Quotation.OrderCoverageTime),
        FirstLot: Quotation.FirstLot,
        SupplierPartNumber: Quotation.SupplierPartNumber,
        Currency: Quotation.Currency,
        UOM: Quotation.UnitOfPrice,
        QuotedUnitPrice: parseNumber(Quotation.QuotedUnitPriceTtl),
        PriceType: Quotation.OrderPriceStatusCode,
        QuotedToolingPriceTtl: parseNumber(Quotation.QuotedToolingPriceTtl),
        QuotedOneTimePaymentTtl: parseNumber(Quotation.QuotedOneTimePaymentTtl),
        MaterialsCostsTtl: parseNumber(Quotation.MaterialsCostsTtl),
        PurchasedPartsCostsTtl: parseNumber(Quotation.PurchasedPartsCostsTtl),
        ProcessingCostsTtl: parseNumber(Quotation.ProcessingCostsTtl),
        ToolingJigDeprCostTtl: parseNumber(Quotation.ToolingJigDeprCostTtl),
        AdminExp_x002f_Profit: parseNumber(Quotation.AdminExpProfit),
        PackingandDistributionCosts: parseNumber(
          Quotation.PackingAndDistributionCosts
        ),
        Other: parseNumber(Quotation.Other),
        QuotedBasicUnitPriceTtl: parseNumber(Quotation.QuotedBasicUnitPriceTtl),
        PaidProvPartsCost: parseNumber(Quotation.PaidProvPartsCost),
        SuppliedMtrCost: parseNumber(Quotation.SuppliedMtrCost),
        CommentHistory: Quotation.CommentHistory,
        UOP: Quotation.UnitOfPrice,
      };
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+Quotation.ID!)
        .update(removeEmptyFields(updatedData));
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
export const getActionLogsAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getAllActionLogs`,
  async (arg: {
    Term: "ByRFQId" | "ByRequisitionId";
    RFQId?: string;
    RequisitionId?: string;
  }): Promise<IActionLog[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ACTIONLOG)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
          <Where>
            ${
              arg.Term === "ByRFQId"
                ? camlEqText(arg.RFQId!, "RFQId")
                : camlEqText(arg.RequisitionId!, "RequisitionId")
            }
          </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const result = response.Row.map((item) => {
        return {
          User: item.User,
          Date: item.Date,
          LogType: item.LogType,
          RFQId: item.RFQId,
          RequisitionId: item.RequisitionId,
        } as IActionLog;
      });
      return result;
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
export const UploadQuotationAttachmentsAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/uploadQuotationAttachments`,
  async (arg: {
    Attachments: File[];
    QuotationId: string;
    RemoveItemIds: string[];
  }): Promise<void> => {
    const sp = spfi(getSP());
    try {
      const folderPath = `${CONST.LIBRARY_QUOTATIONATTACHMENTS_NAME}/${arg.QuotationId}`;
      const folder = await sp.web
        .getFolderByServerRelativePath(folderPath)
        .select("Exists")();
      if (!folder.Exists) {
        await sp.web.folders.addUsingPath(folderPath);
      }
      arg.Attachments.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          await sp.web
            .getFolderByServerRelativePath(folderPath)
            .files.addUsingPath(file.name, arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
      });
      arg.RemoveItemIds.forEach(async (ItemId) => {
        await sp.web.getFileById(ItemId).recycle();
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_uploadQuotationAttachments) - ${JSON.stringify(
          err
        )}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const getQuotationAttachmentsAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getQuotationAttachments`,
  async (QuotationId: string): Promise<IAttachments[]> => {
    const sp = spfi(getSP());
    try {
      const folderPath = `${CONST.LIBRARY_QUOTATIONATTACHMENTS_NAME}/${QuotationId}`;
      const folderExists = async (path: string): Promise<boolean> => {
        const folder = await sp.web
          .getFolderByServerRelativePath(path)
          .select("Exists")();
        return folder.Exists;
      };
      if (!folderExists) {
        return [];
      }
      const siteUrl = window.location.origin;
      const filesInfo = await sp.web
        .getFolderByServerRelativePath(folderPath)
        .files();
      const files = await Promise.all(
        filesInfo.map(async (fileInfo) => {
          const file = await sp.web
            .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
            .getBlob();
          return {
            File: new File([file], fileInfo.Name, { type: file.type }),
            Url: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
            ID: fileInfo.UniqueId,
          };
        })
      );
      return files;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getQuotationAttachments) - ${JSON.stringify(
          err
        )}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const ProceedToPoAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/proceedToPo`,
  async (Requisition: IProceedToPoFields): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+Requisition.ID!)
        .update({
          ID: Requisition.ID,
          Status: Requisition.Status,
          StandardOrderText1: Requisition.StandardOrderText1,
          StandardOrderText2: Requisition.StandardOrderText2,
          StandardOrderText3: Requisition.StandardOrderText3,
          FreePartText: Requisition.FreePartText,
          CommentHistory: Requisition.CommentHistory,
          OrderNumber: Requisition.OrderNumber,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_proceedToPo) - ${JSON.stringify(err)}`,
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeEmptyFields(obj: any): any {
  for (const key in obj) {
    if (!obj[key] && numberFields.indexOf(key) !== -1) {
      delete obj[key];
    }
  }
  return obj;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseNumber(data: any): number | undefined {
  if (data) {
    return Number(data);
  }
  return undefined;
}
//#endregion
