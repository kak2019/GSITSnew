import { IUDGSCommentModel } from "./udgs-comment-model";

export interface IUDGSNewPartGridModel {
  ID: number;
  Modified: Date;
  Account: string;
  AnnualQty: number;
  ArrivedWeek: number;
  BuyerBasePrice: number;
  BuyerFullInfo: string;
  BuyerName: string;
  CostCenter: string;
  CRExists: string;
  CreateDate: Date;
  DCNENO: string;
  Dep: string;
  DrawingNo: string;
  UDGSSuffix: number;
  UDGSNotes: string;
  Handler: number;
  HandlerName: string;
  InitiatedWeek: number;
  Issuer: string;
  LifetimeQty: number;
  MaterialUser: number;
  OrderQty: number;
  OrderType: string;
  Originator: string;
  PartDescription: string;
  PartIssue: string;
  PartNumber: string;
  PartStatus: string;
  Porg: string;
  Pproject: string;
  Prio: string;
  Qualifier?: string;
  ReqNo: string;
  RequiredWeek: number;
  RequisitionBuyer: string;
  RequisitionControl: string;
  RequisitionType: string;
  RFQIDRef: number;
  RFQNo: string;
  Section: string;
  SectionDescription: string;
  UOM: string;
  WBS: string;
  Parma?: string;
}
export interface IUDGSNewPartQuotationGridModel extends IUDGSNewPartGridModel {
  QuotationID: number;
  QuotationModified: Date;
  PriceType: string;
  QuotedUnitPriceTtl: string;
  Currency: string;
  UOP: string;
  EffectiveDate: Date;
  CommentHistory: string;
  LastCommentBy: string;
  StandardOrderText1: string;
  StandardOrderText2: string;
  StandardOrderText3: string;
  FreePartText: string;
  NamedPlace: string;
  NamedPlaceDescription: string;
  CountryofOrigin: string;
  OrderCoverageTime: number;
  FirstLot: string;
  SupplierPartNumber: string;
  QuotedToolingPriceTtl: string;
  QuotedOneTimePaymentTtl: string;
  MaterialsCostsTtl: string;
  PurchasedPartsCostsTtl: string;
  ProcessingCostsTtl: string;
  ToolingJigDeprCostTtl: string;
  AdminExpProfit: string;
  Other: string;
  QuotedBasicUnitPriceTtl: string;
  PaidProvPartsCost: string;
  SuppliedMtrCost: string;
  PackingandDistributionCosts: string;
  SurfaceTreatmentCode: string;
  OrderPriceStatusCode: string;
  OrderNumber: string;
  PartNumber: string;
  Qualifier?: string;
  ID: number;
  Parma?:string;
}
export interface IUDGSPricePartQuotationGridModel extends IUDGSNewPartGridModel {
  QuotationID: number;
  QuotationModified: Date;
  PriceType: string;
  QuotedUnitPriceTtl: string;
  Currency: string;
  UOP: string;
  EffectiveDate?: Date;
  CommentHistory: string;
  LastCommentBy: string;
  StandardOrderText1: string;
  StandardOrderText2: string;
  StandardOrderText3: string;
  FreePartText: string;
  NamedPlace: string;
  NamedPlaceDescription: string;
  CountryofOrigin: string;
  OrderCoverageTime: number;
  FirstLot: string;
  SupplierPartNumber: string;
  QuotedToolingPriceTtl: string;
  QuotedOneTimePaymentTtl: string;
  MaterialsCostsTtl: string;
  PurchasedPartsCostsTtl: string;
  ProcessingCostsTtl: string;
  ToolingJigDeprCostTtl: string;
  AdminExpProfit: string;
  Other: string;
  QuotedBasicUnitPriceTtl: string;
  PaidProvPartsCost: string;
  SuppliedMtrCost: string;
  PackingandDistributionCosts: string;
  SurfaceTreatmentCode: string;
  OrderPriceStatusCode: string;
  OrderNumber: string;
  PartNumber: string;
  Qualifier?: string;
  ID: number;
  Parma?:string;
}

export interface IUDGSNewPartFormModel {
  ID?: number;
  Modified?: Date;
  ContentTypeId?: string;
  Account?: string;
  AnnualQty?: number;
  ArrivedWeek?: number;
  BuyerBasePrice?: number;
  BuyerFullInfo?: string;
  BuyerName?: string;
  CostCenter?: string;
  CRExists?: string;
  CreateDate?: Date;
  DCNENO?: string;
  Dep?: string;
  DrawingNo?: string;
  UDGSSuffix?: number;
  UDGSNotes?: string;
  Handler?: number;
  HandlerName?: string;
  InitiatedWeek?: number;
  Issuer?: string;
  LifetimeQty?: number;
  MaterialUser?: number;
  OrderQty?: number;
  OrderType?: string;
  Originator?: string;
  PartDescription?: string;
  PartIssue?: string;
  PartNumber?: string;
  PartStatus?: string;
  Porg?: string;
  Pproject?: string;
  Prio?: string;
  Qualifier?: string;
  ReqNo?: string;
  RequiredWeek?: number;
  RequisitionBuyer?: string;
  RequisitionControl?: string;
  RequisitionType?: string;
  RFQIDRef?: number;
  RFQNo?: string;
  Section?: string;
  SectionDescription?: string;
  UOM?: string;
  WBS?: string;
  IsQuoted?: string;
}
export interface IUDGSNewPartCreteriaModel {
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
  RequiredWeekFrom?: number;
  RequiredWeekTo?: number;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
}
export interface IUDGSAcceptReturnModel {
  Action: "Accepted" | "Returned";
  PartID: number;
  QuotationID: number;
  QuotationModified: Date;
  Comment: IUDGSCommentModel;
}
