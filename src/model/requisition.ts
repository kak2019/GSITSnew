export interface IRequisitionGrid {
  ID: string; //SharePoint Item Id
  UniqueIdentifier: string; //Column "Title"
  IsSelected?: boolean; // For Grid View, No Corresponding SharePoint List Column
  RequisitionType: string; //Column "Requisition Type"
  Section: string; //Column "Section"
  Status: string; //Column "Status"
  PartNumber: string; //Column "Part Number"
  Qualifier: string; //Column "Qualifier"
  MaterialUser: number; //Column "Material User"
  Project?: string; //Column "Pproject"
  RequiredWeek?: string; //Column "Required Week"
  CreateDate?: string; //Column "Create Date"
  RfqNo?: string; //Column "RFQ Number"
  Parma?: string; //Column Parma
  PartDescription: string; //Column "Part Description"
  AnnualQty?: number; //Column "Annual Qty"
  OrderQty?: number; //Column "Order Qty"
  ReqBuyer?: string; //Column "Requisition Buyer"
  Handler?: number; //Column "Handler"
  HandlerName?: string; //Column "Handler Name"
  BuyerFullInfo?: string; //Column "Buyer Full Info" Used for Buyer filter
  SectionDescription?: string; //Column "Section Description" Used for Section filter
  Porg?: string; //Column "Porg"
  StandardOrderText1?: string;
  StandardOrderText2?: string;
  StandardOrderText3?: string;
  FreePartText?: string;
  OrderNumber?: string;
}
export interface IRequisitionRFQGrid {
  ID: string;
  Porg?: string; //Column "Porg"
  PartNumber: string; //Column "Part Number"
  Qualifier: string; //Column "Qualifier"
  PartDescription: string; //Column "Part Description"
  MaterialUser: number; //Column "Material User"
  AnnualQty?: number; //Column "Annual Qty"
  OrderQty?: number; //Column "Order Qty"
  QuotedUnitPrice?: number; //Column "Quoted Unit Price"
  Currency?: string; //Column "Currency"
  UOP?: string; //Column "UOP"
  EffectiveDate?: Date; //Column "Effective Date"
  PartStatus?: string; //Column "Status"
  LastCommentBy?: string; //Get Data From Column "Comment History"
  BuyerName?: string; //Column "Buyer Name"
  Suffix?: string; //Column "Suffix"
  OrderCoverageTime?: number; //Column "Order Coverage Time"
  NamedPlace?: string; //Column "Named Place"
  NamedPlaceDescription?: string; //Column "Named Place Description"
  FirstLot?: string; //Column "First Lot"
  CountryOfOrigin?: string; //Column "Country of Origin"
  QuotedBasicUnitPriceTtl?: string; //Column "Quoted Basic Unit PriceTtl"
  OrderPriceStatusCode?: string; //Column "Price Type"
  MaterialsCostsTtl?: number; //Column "Materials Costs Ttl"
  PurchasedPartsCostsTtl?: number; //Column "Purchased Parts Costs Ttl"
  ProcessingCostsTtl?: number; //Column "Processing Costs Ttl"
  ToolingJigDeprCostTtl?: number; //Column "Tooling Jig Depr Costs Ttl"
  AdminExpProfit?: number; //Column "Admin Exp/Profit"
  PackingAndDistributionCosts?: number; //Column "Packing and Distribution Costs"
  Other?: number; //Column "Other"
  PaidProvPartsCost?: number; //Column "Paid Prov Parts Cost"
  SuppliedMtrCost?: number; //Column "Supplied Mtr Cost"
  PartIssue?: string; //Column "Part Issue"
  SurfaceTreatmentCode?: string; //Column "Surface Treatment Code"
  DrawingNo?: string; //Column "Drawing No."
  Handler?: number; //Column "Handler",
  StandardOrderText1?: string;
  StandardOrderText2?: string;
  StandardOrderText3?: string;
  FreePartText?: string;
  OrderNumber?: string;
}

export interface IQuotationGrid {
  ID: string; //SharePoint Item Id
  PartNumber?: string; //Column "Part Number"
  Qualifier?: string; //Column "Qualifier"
  PartDescription?: string; //Column "Part Description"
  PartIssue?: string; //Column "Part Issue"
  DrawingNo?: string; //Column "Drawing No."
  Status?: string; //Column "Status"
  OrderType?: string; //Column "Order Type"
  MaterialUser?: number; //Column "Material User"
  Suffix?: string; //Column "Suffix"
  Porg?: string; //Column "Porg"
  HandlerId?: number; //Column "Handler"
  BuyerName?: string; //Column "Buyer Name"
  PARMA?: string; //Column "Parma"
  NamedPlace?: string; //Column "Named Place"
  NamedPlaceDescription?: string; //Column "Named Place Description"
  SurfaceTreatmentCode?: string; //Column "Surface Treatment Code"
  CountryOfOrigin?: string; //Column "Country of Origin"
  OrderCoverageTime?: number; //Column "Order Coverage Time"
  FirstLot?: string; //Column "First Lot"
  SupplierPartNumber?: string; //Column "Supplier Part Number"
  Currency?: string; //Column "Currency"
  UnitOfPrice?: string; //Column "UOM"
  QuotedUnitPriceTtl?: string; //Column "Quoted Unit Price"
  OrderPriceStatusCode?: string; //Column "Price Type"
  QuotedToolingPriceTtl?: string; //Column "Quoted Tooling Price Ttl"
  QuotedOneTimePaymentTtl?: string; //Column "Quoted One Time Payment Ttl"
  MaterialsCostsTtl?: string; //Column "Materials Costs Ttl"
  PurchasedPartsCostsTtl?: string; //Column "Purchased Parts Costs Ttl"
  ProcessingCostsTtl?: string; //Column "Processing Costs Ttl"
  ToolingJigDeprCostTtl?: string; //Column "Tooling Jig Depr Costs Ttl"
  AdminExpProfit?: string; //Column "Admin Exp/Profit"
  PackingAndDistributionCosts?: string; //Column "Packing and Distribution Costs"
  Other?: string; //Column "Other"
  QuotedBasicUnitPriceTtl?: string; //Column "Quoted Basic Unit PriceTtl"
  PaidProvPartsCost?: string; //Column "Paid Prov Parts Cost"
  SuppliedMtrCost?: string; //Column "Supplied Mtr Cost"
  CommentHistory?: string; //Column "Comment History"
  AnnualQty?: string; //Column "Annual Qty"
  OrderQty?: string; //Column "Order Qty"
  RequiredWeek?: string; //Column "Required Week"
}
export interface IProceedToPoFields {
  ID?: string;
  Status?: string;
  StandardOrderText1?: string;
  StandardOrderText2?: string;
  StandardOrderText3?: string;
  FreePartText?: string;
  CommentHistory?: string;
  OrderNumber?: string;
}
export interface IRequisitionQueryModel {
  RequisitionType?: string[];
  Buyer?: string;
  Parma?: string;
  Section?: string;
  Status?: string[];
  PartNumber?: string;
  Qualifier?: string;
  Project?: string;
  MaterialUser?: number;
  RFQNumber?: string;
  RequiredWeekFrom?: string;
  RequiredWeekTo?: string;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
}
