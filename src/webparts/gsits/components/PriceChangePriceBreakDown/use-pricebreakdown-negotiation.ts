import {
  getDecimalPlace,
  parseNumberOptional,
} from "../../../../common/commonHelper";
import {
  IUDGSQuotationFormModel,
  IUDGSQuotationGridModel,
} from "../../../../model-v2";
import {
  PCAutoSumQuotedBasicUnitPriceTtlFields,
  PCAutoSumQuotedUnitPriceTtlFields,
} from "./const";

type UsePriceBreakdownNegotiation = {
  quotationCalculation: (
    quotation: IUDGSQuotationGridModel
  ) => Promise<IUDGSQuotationGridModel>;
  quotationGridToForm: (
    quotation: IUDGSQuotationGridModel,
    partID: number
  ) => Promise<IUDGSQuotationFormModel>;
};
export function usePriceBreakdownNegotiation(): UsePriceBreakdownNegotiation {
  async function quotationCalculation(
    quotation: IUDGSQuotationGridModel
  ): Promise<IUDGSQuotationGridModel> {
    try {
      const factorNumber = getDecimalFactor(quotation);
      let resultQBUPT: number = 0;
      PCAutoSumQuotedBasicUnitPriceTtlFields.forEach((fieldName) => {
        resultQBUPT += calculateField(quotation, fieldName, factorNumber);
      });
      quotation.QuotedBasicUnitPriceTtl = (resultQBUPT / factorNumber).toFixed(
        3
      );
      let resultQUPT: number = 0;
      PCAutoSumQuotedUnitPriceTtlFields.forEach((fieldName) => {
        resultQUPT += calculateField(quotation, fieldName, factorNumber);
      });
      quotation.QuotedUnitPriceTtl = (resultQUPT / factorNumber).toFixed(3);
      return quotation;
    } catch (err) {
      throw new Error(err);
    }
  }
  async function quotationGridToForm(
    quotation: IUDGSQuotationGridModel,
    partID: number
  ): Promise<IUDGSQuotationFormModel> {
    try {
      return {
        ID: quotation.ID,
        Modified: quotation.Modified,
        ContentTypeId: quotation.ContentTypeId,
        NamedPlace: quotation.NamedPlace,
        NamedPlaceDescription: quotation.NamedPlaceDescription,
        SurfaceTreatmentCode: quotation.SurfaceTreatmentCode,
        CountryOfOrigin: quotation.CountryOfOrigin,
        OrderCoverageTime: parseNumberOptional(
          quotation.OrderCoverageTime.toString()
        ),
        FirstLot: quotation.FirstLot,
        SupplierPartNumber: quotation.SupplierPartNumber,
        Currency: quotation.Currency,
        MaterialsCostsTtl: parseNumberOptional(quotation.MaterialsCostsTtl),
        PaidProvPartsCost: parseNumberOptional(quotation.PaidProvPartsCost),
        QuotedUnitPriceTtl: parseNumberOptional(quotation.QuotedUnitPriceTtl),
        PurchasedPartsCostsTtl: parseNumberOptional(
          quotation.PurchasedPartsCostsTtl
        ),
        SuppliedMtrCost: parseNumberOptional(quotation.SuppliedMtrCost),
        UOP: quotation.UOP,
        ProcessingCostsTtl: parseNumberOptional(quotation.ProcessingCostsTtl),
        OrderPriceStatusCode: quotation.OrderPriceStatusCode,
        ToolingJigDeprCostTtl: parseNumberOptional(
          quotation.ToolingJigDeprCostTtl
        ),
        QuotedToolingPriceTtl: parseNumberOptional(
          quotation.QuotedToolingPriceTtl
        ),
        AdminExpProfit: parseNumberOptional(quotation.AdminExpProfit),
        QuotedOneTimePaymentTtl: parseNumberOptional(
          quotation.QuotedOneTimePaymentTtl
        ),
        PackingAndDistributionCosts: parseNumberOptional(
          quotation.PackingAndDistributionCosts
        ),
        Other: parseNumberOptional(quotation.Other),
        QuotedBasicUnitPriceTtl: parseNumberOptional(
          quotation.QuotedBasicUnitPriceTtl
        ),
        PartIDRef: partID,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  return {
    quotationCalculation,
    quotationGridToForm,
  };
}
//#region methods
function getDecimalFactor(NewValue: IUDGSQuotationGridModel): number {
  const decimalPlaces = PCAutoSumQuotedUnitPriceTtlFields.map((field) =>
    getDecimalPlace(NewValue[field].toString())
  );
  return decimalPlaces.length > 0 ? 10 ** Math.max(...decimalPlaces) : 1;
}
function calculateField(
  newValue: IUDGSQuotationGridModel,
  fieldName: keyof IUDGSQuotationGridModel,
  factor: number
): number {
  return newValue[fieldName] ? Number(newValue[fieldName]) * factor : 0;
}
//#endregion
