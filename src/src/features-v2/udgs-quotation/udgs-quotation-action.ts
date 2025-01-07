import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import "@pnp/sp/content-types";
import { camlEqNumber } from "../../common/camlHelper";
import { AppInsightsService } from "../../config/AppInsightsService";
import { FeatureKey, CONST } from "../../config/const";
import { MESSAGE } from "../../config/message";
import {
  IUDGSQuotationFormModel,
  IUDGSQuotationGridModel,
} from "../../model-v2/udgs-quotation-model";
import { getSP } from "../../pnpjsConfig";
import { parseNumberFixedDigit } from "../../common/commonHelper";

//#region actions
export const getQuotationByIDAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getQuotationByID`,
  async (quotationID: number): Promise<IUDGSQuotationGridModel> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(quotationID, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const quotation = {
        ID: response.Row[0].ID,
        Modified: new Date(response.Row[0]["Modified."]),
        PriceType: response.Row[0].PriceType,
        QuotedUnitPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedUnitPriceTtl."],
          3
        ),
        Currency: response.Row[0].Currency,
        UOP: response.Row[0].UOP,
        EffectiveDate: response.Row[0].EffectiveDate,
        CommentHistory: response.Row[0].CommentHistory,
        StandardOrderText1: response.Row[0].StandardOrderText1,
        StandardOrderText2: response.Row[0].StandardOrderText2,
        StandardOrderText3: response.Row[0].StandardOrderText3,
        FreePartText: response.Row[0].FreePartText,
        NamedPlace: response.Row[0].NamedPlace,
        NamedPlaceDescription: response.Row[0].NamedPlaceDescription,
        CountryOfOrigin: response.Row[0].CountryOfOrigin,
        OrderCoverageTime: Number(response.Row[0]["OrderCoverageTime."]),
        FirstLot: response.Row[0].FirstLot,
        SupplierPartNumber: response.Row[0].SupplierPartNumber,
        QuotedToolingPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedToolingPriceTtl."],
          3
        ),
        QuotedOneTimePaymentTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedOneTimePaymentTtl."],
          3
        ),
        MaterialsCostsTtl: parseNumberFixedDigit(
          response.Row[0]["MaterialsCostsTtl."],
          3
        ),
        PurchasedPartsCostsTtl: parseNumberFixedDigit(
          response.Row[0]["PurchasedPartsCostsTtl."],
          3
        ),
        ProcessingCostsTtl: parseNumberFixedDigit(
          response.Row[0]["ProcessingCostsTtl."],
          3
        ),
        ToolingJigDeprCostTtl: parseNumberFixedDigit(
          response.Row[0]["ToolingJigDeprCostTtl."],
          3
        ),
        AdminExpProfit: parseNumberFixedDigit(
          response.Row[0]["AdminExpProfit."],
          3
        ),
        Other: parseNumberFixedDigit(response.Row[0].Other, 3),
        QuotedBasicUnitPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedBasicUnitPriceTtl."],
          3
        ),
        PaidProvPartsCost: parseNumberFixedDigit(
          response.Row[0]["PaidProvPartsCost."],
          3
        ),
        SuppliedMtrCost: parseNumberFixedDigit(
          response.Row[0]["SuppliedMtrCost."],
          3
        ),
        PackingAndDistributionCosts: parseNumberFixedDigit(
          response.Row[0]["PackingAndDistributionCosts."],
          3
        ),
        SurfaceTreatmentCode: response.Row[0].SurfaceTreatmentCode,
        OrderPriceStatusCode: response.Row[0].OrderPriceStatusCode,
        OrderNumber: response.Row[0].OrderNumber,
      } as IUDGSQuotationGridModel;
      return quotation;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getQuotationByID) - ${JSON.stringify(err)}`,
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
export const getQuotationByPartIDAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/getQuotationByPartID`,
  async (partID: number): Promise<IUDGSQuotationGridModel> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(partID, "PartIDRef")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const quotation = {
        ID: response.Row[0].ID,
        Modified: new Date(response.Row[0]["Modified."]),
        PriceType: response.Row[0].PriceType,
        QuotedUnitPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedUnitPriceTtl."],
          3
        ),
        Currency: response.Row[0].Currency,
        UOP: response.Row[0].UOP,
        EffectiveDate: response.Row[0].EffectiveDate,
        CommentHistory: response.Row[0].CommentHistory,
        StandardOrderText1: response.Row[0].StandardOrderText1,
        StandardOrderText2: response.Row[0].StandardOrderText2,
        StandardOrderText3: response.Row[0].StandardOrderText3,
        FreePartText: response.Row[0].FreePartText,
        NamedPlace: response.Row[0].NamedPlace,
        NamedPlaceDescription: response.Row[0].NamedPlaceDescription,
        CountryOfOrigin: response.Row[0].CountryOfOrigin,
        OrderCoverageTime: Number(response.Row[0]["OrderCoverageTime."]),
        FirstLot: response.Row[0].FirstLot,
        SupplierPartNumber: response.Row[0].SupplierPartNumber,
        QuotedToolingPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedToolingPriceTtl."],
          3
        ),
        QuotedOneTimePaymentTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedOneTimePaymentTtl."],
          3
        ),
        MaterialsCostsTtl: parseNumberFixedDigit(
          response.Row[0]["MaterialsCostsTtl."],
          3
        ),
        PurchasedPartsCostsTtl: parseNumberFixedDigit(
          response.Row[0]["PurchasedPartsCostsTtl."],
          3
        ),
        ProcessingCostsTtl: parseNumberFixedDigit(
          response.Row[0]["ProcessingCostsTtl."],
          3
        ),
        ToolingJigDeprCostTtl: parseNumberFixedDigit(
          response.Row[0]["ToolingJigDeprCostTtl."],
          3
        ),
        AdminExpProfit: parseNumberFixedDigit(
          response.Row[0]["AdminExpProfit."],
          3
        ),
        Other: parseNumberFixedDigit(response.Row[0].Other, 3),
        QuotedBasicUnitPriceTtl: parseNumberFixedDigit(
          response.Row[0]["QuotedBasicUnitPriceTtl."],
          3
        ),
        PaidProvPartsCost: parseNumberFixedDigit(
          response.Row[0]["PaidProvPartsCost."],
          3
        ),
        SuppliedMtrCost: parseNumberFixedDigit(
          response.Row[0]["SuppliedMtrCost."],
          3
        ),
        PackingAndDistributionCosts: parseNumberFixedDigit(
          response.Row[0]["PackingAndDistributionCosts."],
          3
        ),
        SurfaceTreatmentCode: response.Row[0].SurfaceTreatmentCode,
        OrderPriceStatusCode: response.Row[0].OrderPriceStatusCode,
        OrderNumber: response.Row[0].OrderNumber,
      } as IUDGSQuotationGridModel;
      return quotation;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getQuotationByPartID) - ${JSON.stringify(err)}`,
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
export const postQuotationAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/postQuotation`,
  async (quotation: IUDGSQuotationFormModel): Promise<number> => {
    const sp = spfi(getSP());
    try {
      const quotationContentTypeID = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .contentTypes()
        .then((result) => {
          return result.filter((i) => i.Name === "Quotation")[0].Id.StringValue;
        });
      console.log(quotationContentTypeID);
      const addItemResult = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .items.add({ ...quotation });
      return addItemResult.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_postQuotation) - ${JSON.stringify(err)}`,
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
export const putQuotationAction = createAsyncThunk(
  `${FeatureKey.QUOTATIONS}/putQuotation`,
  async (quotation: IUDGSQuotationFormModel): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const spQuotationItem = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(quotation.ID!, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const spModified = new Date(spQuotationItem.Row[0]["Modified."]);
      const itemModified = new Date(quotation.Modified!);
      if (spModified.getTime() !== itemModified.getTime()) {
        Logger.write(
          `${CONST.LOG_SOURCE} (_putQuotation) - ${JSON.stringify(
            "Item version unmatch"
          )}`,
          LogLevel.Error
        );
        AppInsightsService.aiInstance.trackEvent({
          name: MESSAGE.updateDataFailed,
          properties: { error: "Item version unmatch" },
        });
        return Promise.reject(MESSAGE.updateDataFailed);
      }
      const result = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_QUOTATION)
        .items.getById(quotation.ID!)
        .update(quotation)
        .then(async () => {
          const responseTemp = await sp.web.lists
            .getByTitle(CONST.LIST_NAME_QUOTATION)
            .items.getById(quotation.ID!)();
          return new Date(responseTemp.Modified).toISOString();
        });
      return result;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_putQuotation) - ${JSON.stringify(err)}`,
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
