import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { parseNumberFixedDigit } from "../common/commonHelper";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IQuotationCreteriaModel } from "../model-v2/udgs-creteria-model";
import { IUDGSQuotationGridModel } from "../model-v2/udgs-quotation-model";
import { getSP } from "../pnpjsConfig";
import { camlAndFinal, camlEqNumber } from "../common/camlHelper";

export async function getQuotation(
  creteria: IQuotationCreteriaModel
): Promise<IUDGSQuotationGridModel> {
  try {
    const sp = spfi(getSP());
    const response = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_QUOTATION)
      .renderListDataAsStream({
        ViewXml: `<View>
        <Query>
        ${getFilterString(creteria)}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
      });
    const quotations = response.Row.map((item) => {
      return {
        ID: item.ID,
        Modified: new Date(item["Modified."]),
        PriceType: item.PriceType,
        QuotedUnitPriceTtl: parseNumberFixedDigit(
          item["QuotedUnitPriceTtl."],
          3
        ),
        Currency: item.Currency,
        UOP: item.UOP,
        EffectiveDate: item.EffectiveDate,
        CommentHistory: item.CommentHistory,
        StandardOrderText1: item.StandardOrderText1,
        StandardOrderText2: item.StandardOrderText2,
        StandardOrderText3: item.StandardOrderText3,
        FreePartText: item.FreePartText,
        NamedPlace: item.NamedPlace,
        NamedPlaceDescription: item.NamedPlaceDescription,
        CountryOfOrigin: item.CountryOfOrigin,
        OrderCoverageTime: Number(item["OrderCoverageTime."]),
        FirstLot: item.FirstLot,
        SupplierPartNumber: item.SupplierPartNumber,
        QuotedToolingPriceTtl: parseNumberFixedDigit(
          item["QuotedToolingPriceTtl."],
          3
        ),
        QuotedOneTimePaymentTtl: parseNumberFixedDigit(
          item["QuotedOneTimePaymentTtl."],
          3
        ),
        MaterialsCostsTtl: parseNumberFixedDigit(item["MaterialsCostsTtl."], 3),
        PurchasedPartsCostsTtl: parseNumberFixedDigit(
          item["PurchasedPartsCostsTtl."],
          3
        ),
        ProcessingCostsTtl: parseNumberFixedDigit(
          item["ProcessingCostsTtl."],
          3
        ),
        ToolingJigDeprCostTtl: parseNumberFixedDigit(
          item["ToolingJigDeprCostTtl."],
          3
        ),
        AdminExpProfit: parseNumberFixedDigit(item["AdminExpProfit."], 3),
        Other: parseNumberFixedDigit(item.Other, 3),
        QuotedBasicUnitPriceTtl: parseNumberFixedDigit(
          item["QuotedBasicUnitPriceTtl."],
          3
        ),
        PaidProvPartsCost: parseNumberFixedDigit(item["PaidProvPartsCost."], 3),
        SuppliedMtrCost: parseNumberFixedDigit(item["SuppliedMtrCost."], 3),
        PackingAndDistributionCosts: parseNumberFixedDigit(
          item["PackingAndDistributionCosts."],
          3
        ),
        SurfaceTreatmentCode: item.SurfaceTreatmentCode,
        OrderPriceStatusCode: item.OrderPriceStatusCode,
        OrderNumber: item.OrderNumber,
      } as IUDGSQuotationGridModel;
    });
    return quotations[0];
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
function getFilterString(creteria: IQuotationCreteriaModel): string {
  if (creteria.ID) {
    return camlAndFinal([camlEqNumber(creteria.ID, "ID")]);
  }
  return "";
}
