import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  camlAndFinal,
  camlChoiceMultipleText,
  camlContainsText,
  camlEqChoice,
  camlEqNumber,
  camlEqText,
  camlGeqDate,
  camlGeqNumber,
  camlInNumber,
  camlLeqNumber,
  camlLtDate,
  camlOr,
} from "../../common/camlHelper";
import { AppInsightsService } from "../../config/AppInsightsService";
import { FeatureKey, CONST } from "../../config/const";
import { MESSAGE } from "../../config/message";
import { getSP } from "../../pnpjsConfig";
import {
  IUDGSAcceptReturnModel,
  IUDGSNewPartCreteriaModel,
  IUDGSNewPartFormModel,
  IUDGSNewPartGridModel,
  IUDGSNewPartQuotationGridModel,
} from "../../model-v2/udgs-part-model";
import { IUDGSCommentModel } from "../../model-v2/udgs-comment-model";
import {
  deepCopy,
  getLastCommentBy,
  parseNumberFixedDigit,
} from "../../common/commonHelper";

//#region actions
export const queryPartsAction = createAsyncThunk(
  `${FeatureKey.PARTS}/queryParts`,
  async (
    creteria: IUDGSNewPartCreteriaModel
  ): Promise<IUDGSNewPartGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const queryXmlArray = GetPartQueryInfo(creteria);
      const rfqQueryInfo = GetRFQQueryInfo(creteria);
      if (rfqQueryInfo) {
        const parmaQuery = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_RFQLIST)
          .renderListDataAsStream({
            ViewXml: `<View>
        <Query>
        ${rfqQueryInfo}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
          });
        const RFQIDs = parmaQuery.Row.map((row) => row.ID);
        queryXmlArray.push(camlInNumber(RFQIDs, "RFQIDRef"));
      }
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_PART)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        ${camlAndFinal(queryXmlArray)}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      let parts = response.Row.map((item) => {
        return {
          ID: item.ID,
          Modified: new Date(item["Modified."]),
          Account: item.Account,
          AnnualQty: item.AnnualQty,
          ArrivedWeek: item.ArrivedWeek,
          BuyerBasePrice: item.BuyerBasePrice,
          BuyerFullInfo: item.BuyerFullInfo,
          BuyerName: item.BuyerName,
          CostCenter: item.CostCenter,
          CRExists: item.CRExists,
          CreateDate: item.CreateDate,
          DCNENO: item.DCNENO,
          Dep: item.Dep,
          DrawingNo: item.DrawingNo,
          UDGSSuffix: item.UDGSSuffix,
          UDGSNotes: item.UDGSNotes,
          Handler: item.Handler,
          HandlerName: item.HandlerName,
          InitiatedWeek: item.InitiatedWeek,
          Issuer: item.Issuer,
          LifetimeQty: item.LifetimeQty,
          MaterialUser: item.MaterialUser,
          OrderQty: item.OrderQty,
          OrderType: item.OrderType,
          Originator: item.Originator,
          PartDescription: item.PartDescription,
          PartIssue: item.PartIssue,
          PartNumber: item.PartNumber,
          PartStatus: item.PartStatus,
          Porg: item.Porg,
          Pproject: item.Pproject,
          Prio: item.Prio,
          Qualifier: item.Qualifier,
          ReqNo: item.ReqNo,
          RequiredWeek: item.RequiredWeek,
          RequisitionBuyer: item.RequisitionBuyer,
          RequisitionControl: item.RequisitionControl,
          RequisitionType: item.RequisitionType,
          RFQIDRef: item.RFQIDRef,
          RFQNo: item.RFQNo,
          Section: item.Section,
          SectionDescription: item.SectionDescription,
          UOM: item.UOM,
          WBS: item.WBS,
        } as IUDGSNewPartGridModel;
      });
      const rfqIDs = parts.map((part) => part.RFQIDRef);
      const rfqResponse = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        ${camlInNumber(rfqIDs, "ID")}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const rfqs = rfqResponse.Row.map((item) => {
        return {
          ID: item.ID,
          Parma: item.Parma,
        };
      });
      parts = parts.map((item) => {
        const currentRFQ = rfqs.find((rfq) => rfq.ID === item.RFQIDRef);
        return {
          ...item,
          Parma: currentRFQ?.Parma,
        };
      });
      return parts;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_queryParts) - ${JSON.stringify(err)}`,
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
export const getPartWithQuotationByRFQIDAction = createAsyncThunk(
  `${FeatureKey.PARTS}/getPartWithQuotationByRFQID`,
  async (rfqID: number): Promise<IUDGSNewPartQuotationGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const responsePart = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_PART)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(rfqID, "RFQIDRef")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const parts = responsePart.Row.map((item) => {
        return {
          ID: item.ID,
          Modified: new Date(item["Modified."]),
          Account: item.Account,
          AnnualQty: item.AnnualQty,
          ArrivedWeek: item.ArrivedWeek,
          BuyerBasePrice: item.BuyerBasePrice,
          BuyerFullInfo: item.BuyerFullInfo,
          BuyerName: item.BuyerName,
          CostCenter: item.CostCenter,
          CRExists: item.CRExists,
          CreateDate: item.CreateDate,
          DCNENO: item.DCNENO,
          Dep: item.Dep,
          DrawingNo: item.DrawingNo,
          UDGSSuffix: item.UDGSSuffix,
          UDGSNotes: item.UDGSNotes,
          Handler: item.Handler,
          HandlerName: item.HandlerName,
          InitiatedWeek: item.InitiatedWeek,
          Issuer: item.Issuer,
          LifetimeQty: item.LifetimeQty,
          MaterialUser: item.MaterialUser,
          OrderQty: item.OrderQty,
          OrderType: item.OrderType,
          Originator: item.Originator,
          PartDescription: item.PartDescription,
          PartIssue: item.PartIssue,
          PartNumber: item.PartNumber,
          PartStatus: item.PartStatus,
          Porg: item.Porg,
          Pproject: item.Pproject,
          Prio: item.Prio,
          Qualifier: item.Qualifier,
          ReqNo: item.ReqNo,
          RequiredWeek: item.RequiredWeek,
          RequisitionBuyer: item.RequisitionBuyer,
          RequisitionControl: item.RequisitionControl,
          RequisitionType: item.RequisitionType,
          RFQIDRef: item.RFQIDRef,
          RFQNo: item.RFQNo,
          Section: item.Section,
          SectionDescription: item.SectionDescription,
          UOM: item.UOM,
          WBS: item.WBS,
          //Parma:item.Parma
        } as IUDGSNewPartGridModel;
      });
      const partIDs = parts.map((item) => item.ID);
      const responseQuotation = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlInNumber(partIDs, "PartIDRef")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const partWithQuotation = parts.map((partData) => {
        const quotationData = responseQuotation.Row.find(
          (x) => x.PartIDRef === partData.ID
        );
        return {
          ...partData,
          QuotationModified: quotationData ? quotationData["Modified."] : null,
          QuotationID: quotationData ? quotationData.ID : 0,
          PriceType: quotationData ? quotationData.OrderPriceStatusCode : "",
          QuotedUnitPriceTtl: quotationData
            ? parseNumberFixedDigit(quotationData["QuotedUnitPriceTtl."], 3)
            : "",
          Currency: quotationData ? quotationData.Currency : "",
          UOP: quotationData ? quotationData.UOP : "",
          CommentHistory: quotationData ? quotationData.CommentHistory : "",
          LastCommentBy: quotationData
            ? getLastCommentBy(quotationData.CommentHistory)
            : "",
          StandardOrderText1: quotationData
            ? quotationData.StandardOrderText1
            : "",
          StandardOrderText2: quotationData
            ? quotationData.StandardOrderText2
            : "",
          StandardOrderText3: quotationData
            ? quotationData.StandardOrderText3
            : "",
          FreePartText: quotationData ? quotationData.FreePartText : "",
          NamedPlace: quotationData ? quotationData.NamedPlace : "",
          NamedPlaceDescription: quotationData
            ? quotationData.NamedPlaceDescription
            : "",
          CountryofOrigin: quotationData ? quotationData.CountryOfOrigin : "",
          OrderCoverageTime: quotationData
            ? quotationData.OrderCoverageTime
            : "",
          FirstLot: quotationData ? quotationData.FirstLot : "",
          SupplierPartNumber: quotationData
            ? quotationData.SupplierPartNumber
            : "",
          QuotedToolingPriceTtl: quotationData
            ? parseNumberFixedDigit(quotationData["QuotedToolingPriceTtl."], 3)
            : "",
          QuotedOneTimePaymentTtl: quotationData
            ? parseNumberFixedDigit(
                quotationData["QuotedOneTimePaymentTtl."],
                3
              )
            : "",
          MaterialsCostsTtl: quotationData
            ? parseNumberFixedDigit(quotationData["MaterialsCostsTtl."], 3)
            : "",
          PurchasedPartsCostsTtl: quotationData
            ? parseNumberFixedDigit(quotationData["PurchasedPartsCostsTtl."], 3)
            : "",
          ProcessingCostsTtl: quotationData
            ? parseNumberFixedDigit(quotationData["ProcessingCostsTtl."], 3)
            : "",
          ToolingJigDeprCostTtl: quotationData
            ? parseNumberFixedDigit(quotationData["ToolingJigDeprCostTtl."], 3)
            : "",
          AdminExpProfit: quotationData
            ? parseNumberFixedDigit(quotationData["AdminExpProfit."], 3)
            : "",
          Other: quotationData
            ? parseNumberFixedDigit(quotationData["Other."], 3)
            : "",
          QuotedBasicUnitPriceTtl: quotationData
            ? parseNumberFixedDigit(
                quotationData["QuotedBasicUnitPriceTtl."],
                3
              )
            : "",
          PaidProvPartsCost: quotationData
            ? parseNumberFixedDigit(quotationData["PaidProvPartsCost."], 3)
            : "",
          SuppliedMtrCost: quotationData
            ? parseNumberFixedDigit(quotationData["SuppliedMtrCost."], 3)
            : "",
          PackingandDistributionCosts: quotationData
            ? parseNumberFixedDigit(
                quotationData["PackingAndDistributionCosts."],
                3
              )
            : "",
          SurfaceTreatmentCode: quotationData
            ? quotationData.SurfaceTreatmentCode
            : "",
          OrderPriceStatusCode: quotationData
            ? quotationData.OrderPriceStatusCode
            : "",
          OrderNumber: quotationData ? quotationData.OrderNumber : "",
        } as IUDGSNewPartQuotationGridModel;
      });
      return partWithQuotation;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getPartWithQuotationByRFQID) - ${JSON.stringify(
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
export const getPartByIDAction = createAsyncThunk(
  `${FeatureKey.PARTS}/getPartByID`,
  async (partID: number): Promise<IUDGSNewPartGridModel> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_PART)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(partID, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const part = {
        ID: response.Row[0].ID,
        Modified: new Date(response.Row[0]["Modified."]),
        Account: response.Row[0].Account,
        AnnualQty: Number(response.Row[0]["AnnualQty."]),
        ArrivedWeek: response.Row[0].ArrivedWeek,
        BuyerBasePrice: response.Row[0].BuyerBasePrice,
        BuyerFullInfo: response.Row[0].BuyerFullInfo,
        BuyerName: response.Row[0].BuyerName,
        CostCenter: response.Row[0].CostCenter,
        CRExists: response.Row[0].CRExists,
        CreateDate: response.Row[0].CreateDate,
        DCNENO: response.Row[0].DCNENO,
        Dep: response.Row[0].Dep,
        DrawingNo: response.Row[0].DrawingNo,
        UDGSSuffix: Number(response.Row[0]["UDGSSuffix."]),
        UDGSNotes: response.Row[0].UDGSNotes,
        Handler: response.Row[0].Handler,
        HandlerName: response.Row[0].HandlerName,
        InitiatedWeek: response.Row[0].InitiatedWeek,
        Issuer: response.Row[0].Issuer,
        LifetimeQty: response.Row[0].LifetimeQty,
        MaterialUser: Number(response.Row[0]["MaterialUser."]),
        OrderQty: Number(response.Row[0]["OrderQty."]),
        OrderType: response.Row[0].OrderType,
        Originator: response.Row[0].Originator,
        PartDescription: response.Row[0].PartDescription,
        PartIssue: response.Row[0].PartIssue,
        PartNumber: response.Row[0].PartNumber,
        PartStatus: response.Row[0].PartStatus,
        Porg: response.Row[0].Porg,
        Pproject: response.Row[0].Pproject,
        Prio: response.Row[0].Prio,
        Qualifier: response.Row[0].Qualifier,
        ReqNo: response.Row[0].ReqNo,
        RequiredWeek: Number(response.Row[0]["RequiredWeek."]),
        RequisitionBuyer: response.Row[0].RequisitionBuyer,
        RequisitionControl: response.Row[0].RequisitionControl,
        RequisitionType: response.Row[0].RequisitionType,
        RFQIDRef: response.Row[0].RFQIDRef,
        RFQNo: response.Row[0].RFQNo,
        Section: response.Row[0].Section,
        SectionDescription: response.Row[0].SectionDescription,
        UOM: response.Row[0].UOM,
        WBS: response.Row[0].WBS,
      } as IUDGSNewPartGridModel;
      return part;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getPartByID) - ${JSON.stringify(err)}`,
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
export const getPartsByRFQIDAction = createAsyncThunk(
  `${FeatureKey.PARTS}/getPartByRFQID`,
  async (rfqID: number): Promise<IUDGSNewPartGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_PART)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(rfqID, "RFQIDRef")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const parts = response.Row.map((item) => {
        return {
          ID: item.ID,
          Modified: new Date(item["Modified."]),
          Account: item.Account,
          AnnualQty: item.AnnualQty,
          ArrivedWeek: item.ArrivedWeek,
          BuyerBasePrice: item.BuyerBasePrice,
          BuyerFullInfo: item.BuyerFullInfo,
          BuyerName: item.BuyerName,
          CostCenter: item.CostCenter,
          CRExists: item.CRExists,
          CreateDate: item.CreateDate,
          DCNENO: item.DCNENO,
          Dep: item.Dep,
          DrawingNo: item.DrawingNo,
          UDGSSuffix: Number(item["UDGSSuffix."]),
          UDGSNotes: item.UDGSNotes,
          Handler: item.Handler,
          HandlerName: item.HandlerName,
          InitiatedWeek: item.InitiatedWeek,
          Issuer: item.Issuer,
          LifetimeQty: item.LifetimeQty,
          MaterialUser: item.MaterialUser,
          OrderQty: item.OrderQty,
          OrderType: item.OrderType,
          Originator: item.Originator,
          PartDescription: item.PartDescription,
          PartIssue: item.PartIssue,
          PartNumber: item.PartNumber,
          PartStatus: item.PartStatus,
          Porg: item.Porg,
          Pproject: item.Pproject,
          Prio: item.Prio,
          Qualifier: item.Qualifier,
          ReqNo: item.ReqNo,
          RequiredWeek: item.RequiredWeek,
          RequisitionBuyer: item.RequisitionBuyer,
          RequisitionControl: item.RequisitionControl,
          RequisitionType: item.RequisitionType,
          RFQIDRef: item.RFQIDRef,
          RFQNo: item.RFQNo,
          Section: item.Section,
          SectionDescription: item.SectionDescription,
          UOM: item.UOM,
          WBS: item.WBS,
        } as IUDGSNewPartGridModel;
      });
      return parts;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getPartByRFQID) - ${JSON.stringify(err)}`,
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
export const putPartAction = createAsyncThunk(
  `${FeatureKey.PARTS}/putParts`,
  async (part: IUDGSNewPartFormModel): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_PART)
        .items.getById(part.ID!)
        .update(part);
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_putPart) - ${JSON.stringify(err)}`,
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
export const acceptReturnAction = createAsyncThunk(
  `${FeatureKey.PARTS}/acceptReturn`,
  async (arg: IUDGSAcceptReturnModel[]): Promise<void> => {
    const sp = spfi(getSP());
    try {
      const spQuotationItems = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlInNumber(
          arg.map((x) => x.QuotationID),
          "ID"
        )}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      arg.forEach(async (item) => {
        await sp.web.lists
          .getByTitle(CONST.LIST_NAME_PART)
          .items.getById(item.PartID)
          .update({
            ID: item.PartID,
            IsReturned: item.Action === "Returned" ? "True" : "",
            PartStatus: item.Action,
          });
        if (item.Action === "Returned") {
          const spQuotationItem = deepCopy(
            spQuotationItems.Row.find((x) => x.ID === item.QuotationID)
          );
          let commentHistoryDup: IUDGSCommentModel[];
          if (
            spQuotationItem.CommentHistory === undefined ||
            !spQuotationItem.CommentHistory
          ) {
            commentHistoryDup = [] as IUDGSCommentModel[];
          } else {
            commentHistoryDup = JSON.parse(spQuotationItem.CommentHistory);
          }
          commentHistoryDup.push(item.Comment);
          await sp.web.lists
            .getByTitle(CONST.LIST_NAME_QUOTATION)
            .items.getById(item.QuotationID)
            .update({
              ID: item.QuotationID,
              CommentHistory: JSON.stringify(commentHistoryDup),
            });
        }
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_acceptReturn) - ${JSON.stringify(err)}`,
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
function GetRFQQueryInfo(creteria: IUDGSNewPartCreteriaModel): string {
  const queryXmls = [];
  if (creteria.Parma) {
    queryXmls.push(camlEqText(creteria.Parma, "Parma"));
  }
  if (creteria.RFQNumber) {
    queryXmls.push(camlContainsText(creteria.RFQNumber, "RFQNo"));
  }
  return camlAndFinal(queryXmls);
}
function GetPartQueryInfo(creteria: IUDGSNewPartCreteriaModel): string[] {
  const creterias = [];
  if (creteria.RequisitionType) {
    if (creteria.RequisitionType.length > 0) {
      creterias.push(
        camlChoiceMultipleText("RequisitionType", creteria.RequisitionType)
      );
    }
  }
  if (creteria.Buyer) {
    creterias.push(
      camlOr(
        camlContainsText(creteria.Buyer, "RequisitionBuyer"),
        camlContainsText(creteria.Buyer, "Handler")
      )
    );
  }
  if (creteria.Section) {
    //creterias.push(camlContainsText(creteria.Section, "SectionDescription"));
    creterias.push(camlContainsText(creteria.Section, "Section"));
  }
  if (creteria.Status) {
    if (creteria.Status.length > 0) {
      creterias.push(camlChoiceMultipleText("PartStatus", creteria.Status));
    }
  }
  if (creteria.PartNumber) {
    creterias.push(camlContainsText(creteria.PartNumber, "PartNumber"));
  }
  if (creteria.Qualifier) {
    creterias.push(camlEqChoice(creteria.Qualifier, "Qualifier"));
  }
  if (creteria.Project) {
    creterias.push(camlContainsText(creteria.Project, "Pproject"));
  }
  if (creteria.MaterialUser) {
    creterias.push(camlEqNumber(creteria.MaterialUser, "MaterialUser"));
  }
  if (creteria.RequiredWeekFrom) {
    creterias.push(camlGeqNumber(creteria.RequiredWeekFrom, "RequiredWeek"));
  }
  if (creteria.RequiredWeekTo) {
    creterias.push(camlLeqNumber(creteria.RequiredWeekTo, "RequiredWeek"));
  }
  if (creteria.CreatedDateFrom) {
    creterias.push(camlGeqDate(creteria.CreatedDateFrom, "CreateDate"));
  }
  if (creteria.CreatedDateTo) {
    creterias.push(camlLtDate(creteria.CreatedDateTo, "CreateDate"));
  }
  return creterias;
}
//#endregion
