import { IDropdownOption } from "@fluentui/react";
import { IColumn } from "@fluentui/react";
import { IUDGSQuotationGridModel } from "../../../../model-v2/udgs-quotation-model";
import { IUDGSRFQGridModel } from "../../../../model-v2/udgs-rfq-model";
import { IUDGSNegotiationPartGridModel } from "../../../../model-v2/udgs-negotiation-model";

//#region model
export interface IPCTextFieldPriceBreakdown {
  FieldType?: "Text" | "Number" | "Choice" | "Blank";
  Align?: "start" | "center" | "end";
  AdditionalIcon?: boolean;
  ShowMandatoryIcon?: boolean;
  DataSource?: "Part" | "RFQ" | "Quotation";
  Label?: string;
  Key?:
    | keyof IUDGSRFQGridModel
    | keyof IUDGSNegotiationPartGridModel
    | keyof IUDGSQuotationGridModel;
  ShowCurrent?: boolean;
  ErrorMessage?: string;
  Choice?: IDropdownOption[];
  MaxLength?: number;
  MaxValue?: number;
  MinValue?: number;
  ReadOnly?: boolean;
  IsDate?: boolean;
}
export interface IPCTextFieldRowPriceBreakdown {
  Fields: IPCTextFieldPriceBreakdown[];
  IsLastRow: boolean;
}
interface IPCFieldValidationModel {
  Field: keyof IUDGSQuotationGridModel;
  RowIndex: number;
  ColumnIndex: number;
}
export interface IPCMasterData {
  role: "Buyer" | "Supplier";
  rfqID: number;
  partID: number;
  quotationID: number;
  supplierId?: string;
  userName?: string;
  userEmail?: string;
  isSME?: boolean;
  countryCode?: string;
}
export interface IPCDialogValue {
  IsOpen: boolean;
  Title: string;
  Tip: string;
  ActionType: "Cancel" | "Accepted" | "Returned" | "Close" | "Message";
}
//#endregion
//#region options
export const PCSurfaceTreatmentOptions: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "0", text: "0 - According to drawing" },
  { key: "1", text: "1 - No surface treatment" },
  { key: "2", text: "2 - Primer, undercoats or corr. finish" },
  { key: "3", text: "3 - Rust proof, PARTS' Y700/3" },
  { key: "4", text: "4 - Top coat" },
  { key: "5", text: "5 - Zinc-plating" },
  { key: "6", text: "6 - Hot zink coat" },
  { key: "9", text: "9 - Preparation acc. to separate notes" },
  { key: "14", text: "14 - Top coat, black semi gloss STD 1708" },
  { key: "15", text: "15 - Top coat, black high gloss STD 1701" },
  { key: "20", text: "20 - Light oiled" },
  { key: "21", text: "21 - Primed" },
  { key: "22", text: "22 - Surface class 1 Grey" },
  { key: "23", text: "23 - Surface class 1 Yellow" },
  { key: "24", text: "24 - Surface class 1 Black" },
  { key: "25", text: "25 - Surface class 2 Grey" },
  { key: "26", text: "26 - Surface class 2 Yellow" },
  { key: "27", text: "27 - Surface class 2 Black" },
  { key: "28", text: "28 - Surface class 3 Grey" },
  { key: "29", text: "29 - Surface class 3 Yellow" },
  { key: "30", text: "30 - Surface class 3 Black" },
  { key: "31", text: "31 - Electrozincplated 12 My Yellow" },
  { key: "32", text: "32 - Electrozincplated 12 My Black" },
  { key: "33", text: "33 - Electrozincplated 20 My Yellow" },
  { key: "34", text: "34 - Electrozincplated 25 My Yellow" },
  { key: "35", text: "35 - Electrozincplated 25 My White" },
  { key: "36", text: "36 - Electrozincplated 5 My Yellow" },
  { key: "37", text: "37 - Electrozincplated 8 My Yellow" },
  { key: "38", text: "38 - Electrozincplated 8 My Black" },
  { key: "39", text: "39 - Electrozincplated 8 My White" },
  { key: "40", text: "40 - Electrozincplated 12 My Yellow" },
  { key: "41", text: "41 - Electrozincplated 12 My Black" },
  { key: "42", text: "42 - Electrozincplated 12 My White" },
  { key: "43", text: "43 - Special packing protection - PARTS" },
];
export const PCCountryOfOriginOptions: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "AL", text: "Albania" },
  { key: "DZ", text: "Algeria" },
  { key: "AR", text: "Argentina" },
  { key: "AW", text: "Aruba" },
  { key: "AU", text: "Australia" },
  { key: "AT", text: "Austria" },
  { key: "BH", text: "BAHRAIN" },
  { key: "BB", text: "Barbados" },
  { key: "BE", text: "Belgium" },
  { key: "BM", text: "Bermuda" },
  { key: "BA", text: "Bosnia-Herzegovina" },
  { key: "BR", text: "Brazil" },
  { key: "BG", text: "Bulgaria" },
  { key: "CA", text: "Canada" },
  { key: "CN", text: "China" },
  { key: "CO", text: "COLOMBIA" },
  { key: "HR", text: "Croatia" },
  { key: "CY", text: "Cyprus" },
  { key: "CZ", text: "Czech Republic" },
  { key: "DK", text: "Denmark" },
  { key: "DO", text: "Dominican Republic" },
  { key: "DD", text: "East Germany" },
  { key: "EC", text: "Ecuador" },
  { key: "EE", text: "Estonia" },
  { key: "FI", text: "Finland" },
  { key: "CS", text: "FormerCzechoslovakia" },
  { key: "FR", text: "France" },
  { key: "GE", text: "Georgia" },
  { key: "DE", text: "Germany" },
  { key: "GI", text: "Gibraltar" },
  { key: "GR", text: "Greece" },
  { key: "HK", text: "Hong Kong" },
  { key: "HU", text: "Hungary" },
  { key: "IS", text: "Iceland" },
  { key: "IN", text: "India" },
  { key: "ID", text: "Indonesia" },
  { key: "IR", text: "Iran" },
  { key: "IE", text: "Ireland" },
  { key: "IL", text: "Israel" },
  { key: "IT", text: "Italy" },
  { key: "JP", text: "Japan" },
  { key: "JO", text: "Jordan" },
  { key: "KR", text: "Korea, Republic of" },
  { key: "KW", text: "Kuwait" },
  { key: "LV", text: "Latvia" },
  { key: "LB", text: "Lebanon" },
  { key: "LI", text: "Liechtenstein" },
  { key: "LT", text: "Lithuania" },
  { key: "LU", text: "Luxembourg" },
  { key: "MY", text: "Malaysia" },
  { key: "MT", text: "Malta" },
  { key: "MX", text: "Mexico" },
  { key: "MC", text: "Monaco" },
  { key: "MA", text: "Morocco" },
  { key: "NA", text: "Namibia" },
  { key: "NL", text: "Netherlands" },
  { key: "AN", text: "Netherlands Antilles" },
  { key: "NZ", text: "New Zeeland" },
  { key: "NO", text: "Norway" },
  { key: "OM", text: "OMAN" },
  { key: "PK", text: "Pakistan" },
  { key: "PE", text: "Peru" },
  { key: "PH", text: "PHILIPPINES" },
  { key: "PL", text: "Poland" },
  { key: "PT", text: "Portugal" },
  { key: "RO", text: "Romania" },
  { key: "RU", text: "Russian Federation" },
  { key: "XS", text: "RVC NO TARGET" },
  { key: "XX", text: "RVC TARGET" },
  { key: "SA", text: "Saudi Arabia" },
  { key: "RS", text: "Serbia" },
  { key: "SG", text: "Singapore" },
  { key: "SK", text: "Slovakia" },
  { key: "SI", text: "Slovenia" },
  { key: "ZA", text: "South Africa" },
  { key: "ES", text: "Spain" },
  { key: "LK", text: "SRI LANKA" },
  { key: "SE", text: "Sweden" },
  { key: "CH", text: "Switzerland" },
  { key: "TW", text: "Taiwan" },
  { key: "TH", text: "Thailand" },
  { key: "TN", text: "Tunisia" },
  { key: "TR", text: "Turkey" },
  { key: "UA", text: "Ukraine" },
  { key: "AE", text: "United Arab Emirates" },
  { key: "GB", text: "United Kingdom" },
  { key: "US", text: "United States" },
  { key: "UY", text: "URUGUAY" },
  { key: "VE", text: "Venezuela, B Rep of" },
  { key: "VN", text: "Vietnam" },
  { key: "YU", text: "Yugoslavia" },
];
export const PCCurrencyCodeOptions: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "SEK", text: "SEK" },
  { key: "AUD", text: "AUD" },
  { key: "BRL", text: "BRL" },
  { key: "CAD", text: "CAD" },
  { key: "CHF", text: "CHF" },
  { key: "DKK", text: "DKK" },
  { key: "EUR", text: "EUR" },
  { key: "GBP", text: "GBP" },
  { key: "JPY", text: "JPY" },
  { key: "MXN", text: "MXN" },
  { key: "NOK", text: "NOK" },
  { key: "PLN", text: "PLN" },
  { key: "USD", text: "USD" },
  { key: "CNY", text: "CNY" },
  { key: "CZK", text: "CZK" },
  { key: "HUF", text: "HUF" },
  { key: "INR", text: "INR" },
  { key: "KRW", text: "KRW" },
  { key: "MYR", text: "MYR" },
  { key: "THB", text: "THB" },
  { key: "ZAR", text: "ZAR" },
];
export const PCUnitOfPriceOptions: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "MTR", text: "MTR - Per metre" },
  { key: "MTR2", text: "MTR2 - Per hundred metres" },
  { key: "MTR3", text: "MTR3 - Per thousand metres" },
  { key: "PCE", text: "PCE - Per piece" },
  { key: "PCE2", text: "PCE2 - Per hundred pieces" },
  { key: "PCE3", text: "PCE3 - Per thousand pieces" },
  { key: "DMQ", text: "DMQ - Per litre" },
  { key: "GRM", text: "GRM - Per gram" },
  { key: "KGM", text: "KGM - Per kilogram" },
  { key: "KGM3", text: "KGM3 - Per 1000 kilograms" },
];
export const PCOrderPriceStatusCodeOptionsSME: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "N", text: "N-Negotiated" },
];
export const PCOrderPriceStatusCodeOptionsCommon: IDropdownOption[] = [
  { key: "", text: "" },
  { key: "N", text: "N-Negotiated" },
  { key: "E", text: "E-Estimated" },
];
//#endregion
//#region autoCaculation
export const PCAutoSumQuotedBasicUnitPriceTtlFields: (keyof IUDGSQuotationGridModel)[] =
  [
    "MaterialsCostsTtl",
    "PurchasedPartsCostsTtl",
    "ProcessingCostsTtl",
    "ToolingJigDeprCostTtl",
    "AdminExpProfit",
    "PackingAndDistributionCosts",
    "Other",
  ];
export const PCAutoSumQuotedUnitPriceTtlFields: (keyof IUDGSQuotationGridModel)[] =
  [
    "PaidProvPartsCost",
    "SuppliedMtrCost",
    "MaterialsCostsTtl",
    "PurchasedPartsCostsTtl",
    "ProcessingCostsTtl",
    "ToolingJigDeprCostTtl",
    "AdminExpProfit",
    "PackingAndDistributionCosts",
    "Other",
  ];
//#endregion
//#region validations
export const PCNumberValidationFields: IPCFieldValidationModel[] = [
  { Field: "QuotedToolingPriceTtl", RowIndex: 4, ColumnIndex: 0 },
  { Field: "QuotedOneTimePaymentTtl", RowIndex: 5, ColumnIndex: 0 },
  { Field: "MaterialsCostsTtl", RowIndex: 0, ColumnIndex: 1 },
  { Field: "PurchasedPartsCostsTtl", RowIndex: 1, ColumnIndex: 1 },
  { Field: "ProcessingCostsTtl", RowIndex: 2, ColumnIndex: 1 },
  { Field: "ToolingJigDeprCostTtl", RowIndex: 3, ColumnIndex: 1 },
  { Field: "AdminExpProfit", RowIndex: 4, ColumnIndex: 1 },
  { Field: "PackingAndDistributionCosts", RowIndex: 5, ColumnIndex: 1 },
  { Field: "Other", RowIndex: 6, ColumnIndex: 1 },
  { Field: "PaidProvPartsCost", RowIndex: 0, ColumnIndex: 2 },
  { Field: "SuppliedMtrCost", RowIndex: 1, ColumnIndex: 2 },
];
export const PCMandatoryValidationFieldsOne: IPCFieldValidationModel[] = [
  { Field: "NamedPlace", RowIndex: 0, ColumnIndex: 0 },
  { Field: "CountryOfOrigin", RowIndex: 1, ColumnIndex: 0 },
  { Field: "OrderCoverageTime", RowIndex: 2, ColumnIndex: 0 },
  { Field: "FirstLot", RowIndex: 2, ColumnIndex: 1 },
];
export const PCMandatoryValidationFieldsTwo: IPCFieldValidationModel[] = [
  { Field: "Currency", RowIndex: 0, ColumnIndex: 0 },
  { Field: "QuotedUnitPriceTtl", RowIndex: 1, ColumnIndex: 0 },
  { Field: "UOP", RowIndex: 2, ColumnIndex: 0 },
  { Field: "OrderPriceStatusCode", RowIndex: 3, ColumnIndex: 0 },
];
export const PCNonDoubleBytesValidationFields: IPCFieldValidationModel[] = [
  { Field: "NamedPlaceDescription", RowIndex: 0, ColumnIndex: 1 },
];
export const PCDecimalRegex: string = "^-?\\d+(\\.\\d{1,3})?$";
//#endregion
//#region listColumns
export const IPCActionLogColumn: IColumn[] = [
  {
    key: "Date",
    name: "Date",
    fieldName: "Date",
    minWidth: 100,
    isResizable: true,
  },
  {
    key: "User",
    name: "User",
    fieldName: "User",
    minWidth: 200,
    isResizable: true,
  },
  {
    key: "LogType",
    name: "Action",
    fieldName: "LogType",
    minWidth: 150,
    isResizable: true,
  },
];
export const IPCDialogListColumn: IColumn[] = [
  {
    key: "PartNumber",
    name: "Part No.",
    fieldName: "PartNumber",
    minWidth: 100,
  },
  {
    key: "Qualifier",
    name: "Qualifier",
    fieldName: "Qualifier",
    minWidth: 100,
  },
  {
    key: "PartDescription",
    name: "Part Description",
    fieldName: "PartDescription",
    minWidth: 150,
  },
  {
    key: "MaterialUser",
    name: "Material User",
    fieldName: "MaterialUser",
    minWidth: 100,
  },
  {
    key: "QuotedUnitPriceTtl",
    name: "Quoted Unit Price",
    fieldName: "QuotedUnitPriceTtl",
    minWidth: 150,
  },
];
//#endregion
//#region infoFields
const PCBasicInfoRowOne: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Part Number",
      Key: "PartNumber",
      DataSource: "Part",
      Align: "start",
    },
    {
      Label: "Qualifier",
      Key: "Qualifier",
      DataSource: "Part",
      Align: "center",
    },
    {
      Label: "Part Description",
      Key: "PartDescription",
      DataSource: "Part",
      Align: "end",
    },
  ],
  IsLastRow: false,
};
const PCBasicInfoRowTwo: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    { Label: "RFQ No.", Key: "RFQNo", DataSource: "RFQ", Align: "start" },
    {
      Label: "RFQ Due Date",
      Key: "RFQDueDate",
      DataSource: "RFQ",
      Align: "center",
      IsDate: true,
    },
    { Label: "Status", Key: "RFQStatus", DataSource: "RFQ", Align: "end" },
  ],
  IsLastRow: false,
};
const PCBasicInfoRowThree: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Material User",
      Key: "MaterialUser",
      DataSource: "Part",
      Align: "start",
    },
    { Label: "Porg", Key: "Porg", DataSource: "Part", Align: "center" },
    { Label: "Handler ID", Key: "Porg", DataSource: "Part", Align: "end" },
  ],
  IsLastRow: false,
};
const PCBasicInfoRowFour: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Buyer Name",
      Key: "HandlerName",
      DataSource: "Part",
      Align: "start",
    },
    { Label: "PARMA", Key: "Parma", DataSource: "RFQ", Align: "center" },
    {
      Label: "Supplier Name",
      Key: "SupplierName",
      DataSource: "RFQ",
      Align: "end",
    },
  ],
  IsLastRow: true,
};
export const PCBasicInfo: IPCTextFieldRowPriceBreakdown[] = [
  PCBasicInfoRowOne,
  PCBasicInfoRowTwo,
  PCBasicInfoRowThree,
  PCBasicInfoRowFour,
];
const PCQuoteBreakdownInfoViewRowOne: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    { Label: "Currency", Key: "Currency", DataSource: "Quotation" },
    {
      Label: "Materials Costs Ttl",
      Key: "MaterialsCostsTtl",
      DataSource: "Quotation",
    },
    {
      Label: "Paid Prov Parts Cost",
      Key: "PaidProvPartsCost",
      DataSource: "Quotation",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowTwo: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Quoted Unit Price Ttl",
      Key: "QuotedUnitPriceTtl",
      DataSource: "Quotation",
    },
    {
      Label: "Purchased Parts Costs Ttl",
      Key: "PurchasedPartsCostsTtl",
      DataSource: "Quotation",
    },
    {
      Label: "Supplied Mtr Cost",
      Key: "SuppliedMtrCost",
      DataSource: "Quotation",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowThree: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    { Label: "Unit of Price", Key: "UOP", DataSource: "Quotation" },
    {
      Label: "Processing Costs Total",
      Key: "ProcessingCostsTtl",
      DataSource: "Quotation",
    },
    { Label: "Blank" },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowFour: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Order Price Status Code",
      Key: "OrderPriceStatusCode",
      DataSource: "Quotation",
    },
    {
      Label: "Tooling Jig Depr Costs Ttl",
      Key: "ToolingJigDeprCostTtl",
      DataSource: "Quotation",
    },
    { Label: "Blank" },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowFive: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Quoted Tooling Price Ttl",
      Key: "QuotedToolingPriceTtl",
      DataSource: "Quotation",
    },
    {
      Label: "Admin Exp/Profit",
      Key: "AdminExpProfit",
      DataSource: "Quotation",
    },
    { Label: "Blank" },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowSix: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      Label: "Quoted One Time Payment Ttl",
      Key: "QuotedOneTimePaymentTtl",
      DataSource: "Quotation",
    },
    {
      Label: "Packing and Distribution Costs",
      Key: "PackingAndDistributionCosts",
      DataSource: "Quotation",
    },
    { Label: "Blank" },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowSeven: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    { Label: "Blank" },
    { Label: "Other", Key: "Other", DataSource: "Quotation" },
    { Label: "Blank" },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoViewRowEight: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    { Label: "Blank" },
    {
      Label: "Quoted Basic Unit Price Ttl",
      Key: "QuotedBasicUnitPriceTtl",
      DataSource: "Quotation",
    },
    { Label: "Blank" },
  ],
  IsLastRow: true,
};
export const PCQuoteBreakdownInfoView: IPCTextFieldRowPriceBreakdown[] = [
  PCQuoteBreakdownInfoViewRowOne,
  PCQuoteBreakdownInfoViewRowTwo,
  PCQuoteBreakdownInfoViewRowThree,
  PCQuoteBreakdownInfoViewRowFour,
  PCQuoteBreakdownInfoViewRowFive,
  PCQuoteBreakdownInfoViewRowSix,
  PCQuoteBreakdownInfoViewRowSeven,
  PCQuoteBreakdownInfoViewRowEight,
];
const PCQuoteBreakdownInfoEditRowOne: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Choice",
      Align: "start",
      Label: "Currency",
      Key: "Currency",
      DataSource: "Quotation",
      Choice: PCCurrencyCodeOptions,
      AdditionalIcon: true,
      ShowMandatoryIcon: true,
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Materials Costs Ttl",
      Key: "MaterialsCostsTtl",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Number",
      Align: "end",
      Label: "Paid Prov Parts Cost",
      Key: "PaidProvPartsCost",
      DataSource: "Quotation",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowTwo: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Number",
      Align: "start",
      Label: "Quoted Unit Price Ttl",
      Key: "QuotedUnitPriceTtl",
      DataSource: "Quotation",
      ShowMandatoryIcon: true,
      ReadOnly: true,
      ShowCurrent: true,
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Purchased Parts Costs Ttl",
      Key: "PurchasedPartsCostsTtl",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Number",
      Align: "end",
      Label: "Supplied Mtr Cost",
      Key: "SuppliedMtrCost",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowThree: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Choice",
      Align: "start",
      Label: "Unit of Price",
      Key: "UOP",
      DataSource: "Quotation",
      Choice: PCUnitOfPriceOptions,
      AdditionalIcon: true,
      ShowMandatoryIcon: true,
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Processing Costs Total",
      Key: "ProcessingCostsTtl",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Blank",
      Align: "end",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowFour = (
  masterData: IPCMasterData
): IPCTextFieldRowPriceBreakdown => {
  return {
    Fields: [
      {
        FieldType: "Choice",
        Align: "start",
        Label: "Order Price Status Code",
        Key: "OrderPriceStatusCode",
        DataSource: "Quotation",
        Choice: masterData.isSME
          ? PCOrderPriceStatusCodeOptionsSME
          : PCOrderPriceStatusCodeOptionsCommon,
        ShowMandatoryIcon: true,
      },
      {
        FieldType: "Number",
        Align: "center",
        Label: "Tooling Jig Depr Cost Ttl",
        Key: "ToolingJigDeprCostTtl",
        DataSource: "Quotation",
        ShowCurrent: true,
      },
      {
        FieldType: "Blank",
        Align: "end",
      },
    ],
    IsLastRow: false,
  } as IPCTextFieldRowPriceBreakdown;
};
const PCQuoteBreakdownInfoEditRowFive: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Number",
      Align: "start",
      Label: "Quoted Tooling Price Ttl",
      Key: "QuotedToolingPriceTtl",
      DataSource: "Quotation",
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Admin Exp/Profit",
      Key: "AdminExpProfit",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Blank",
      Align: "end",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowSix: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Number",
      Align: "start",
      Label: "Quoted One Time Payment Ttl",
      Key: "QuotedOneTimePaymentTtl",
      DataSource: "Quotation",
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Packing and Distribution Costs",
      Key: "PackingAndDistributionCosts",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Blank",
      Align: "end",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowSeven: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Blank",
      Align: "end",
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Other",
      Key: "Other",
      DataSource: "Quotation",
      ShowCurrent: true,
    },
    {
      FieldType: "Blank",
      Align: "end",
    },
  ],
  IsLastRow: false,
};
const PCQuoteBreakdownInfoEditRowEight: IPCTextFieldRowPriceBreakdown = {
  Fields: [
    {
      FieldType: "Blank",
      Align: "end",
    },
    {
      FieldType: "Number",
      Align: "center",
      Label: "Quoted Basic Unit Price Ttl",
      Key: "QuotedBasicUnitPriceTtl",
      DataSource: "Quotation",
      ReadOnly: true,
      ShowCurrent: true,
    },
    {
      FieldType: "Blank",
      Align: "end",
    },
  ],
  IsLastRow: true,
};
export const PCQuoteBreakdownInfoEdit = (
  masterData: IPCMasterData
): IPCTextFieldRowPriceBreakdown[] => [
  PCQuoteBreakdownInfoEditRowOne,
  PCQuoteBreakdownInfoEditRowTwo,
  PCQuoteBreakdownInfoEditRowThree,
  PCQuoteBreakdownInfoEditRowFour(masterData),
  PCQuoteBreakdownInfoEditRowFive,
  PCQuoteBreakdownInfoEditRowSix,
  PCQuoteBreakdownInfoEditRowSeven,
  PCQuoteBreakdownInfoEditRowEight,
];
//#endregion
