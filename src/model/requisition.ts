export interface IRequisitionGrid {
  ID: string; //SharePoint Item Id
  UniqueIdentifier: string; //Column "Title"
  IsSelected?: boolean; // For Grid View, No Corresponding SharePoint List Column
  RequisitionType: string; //Column "Requisition Type"
  Section: string; //Column "Section"
  Status: string; //Column "Status"
  PartNumber: string; //Column "Part Number"
  Qualifier: string; //Column "Qualifier"
  MaterialUser: string; //Column "Material User"
  Project?: string; //Column "Pproject"
  RequiredWeek?: string; //Column "Required Week"
  CreateDate?: string; //Column "Create Date"
  RfqNo?: string; //Column "RFQ Number"
  Parma?: string; //Column Parma
  PartDescription: string; //Column "Part Description"
  AnnualQty?: number; //Column "Annual Qty"
  OrderQty?: number; //Column "Order Qty"
  ReqBuyer: string; //Column "Requisition Buyer"
  Handler: string; //Column "Handler"
  HandlerName: string; //Column "Handler Name"
  BuyerFullInfo: string; //Column "Buyer Full Info" Used for Buyer filter
  SectionDescription: string; //Column "Section Description" Used for Section filter
  Porg: string; //Column "Porg"
}
export interface IRequisitionRFQGrid {
  ID: string;
  PartNumber: string; //Column "Part Number"
  Qualifier: string; //Column "Qualifier"
  PartDescription: string; //Column "Part Description"
  MaterialUser: string; //Column "Material User"
  PriceType: string; //Column "Price Type"
  AnnualQty?: number; //Column "Annual Qty"
  OrderQty?: number; //Column "Order Qty"
  QuotedUnitPrice?: number; //Column "Quoted Unit Price"
  Currency?: string; //Column "Currency"
  UOP?: string; //Column "UOP"
  EffectiveDate?: Date; //Column "Effective Date"
  PartStatus?: string; //Column "Status"
  LastCommentBy?: string; //Get Data From Column "Comment History"
}
