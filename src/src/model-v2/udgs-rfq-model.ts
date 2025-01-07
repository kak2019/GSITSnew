export interface IUDGSRFQGridModel {
  ID: number;
  Modified: Date;
  BuyerEmail: string;
  BuyerInfo: string;
  BuyerName: string;
  CommentHistory: string;
  EffectiveDateBuyer: Date;
  EffectiveDateSupplier: Date;
  HandlerName: string;
  IsSME: string;
  LatestQuoteDate: Date;
  OrderType: string;
  Parma: string;
  QuoteReceivedDate: string;
  ReasonOfRFQ: string;
  RFQDueDate: Date;
  RFQInstructionToSupplier: string;
  RFQNo: string;
  RFQStatus: string;
  RFQType: string;
  SectionInfo: string;
  SupplierContact: string;
  SupplierEmail: string;
  SupplierName: string;
  LastCommentBy: string;
  Created: Date;
}
export interface IUDGSRFQFormModel {
  ID?: number;
  Modified?: Date;
  BuyerEmail?: string;
  BuyerInfo?: string;
  BuyerName?: string;
  CommentHistory?: string;
  EffectiveDateBuyer?: Date;
  EffectiveDateSupplier?: Date;
  HandlerName?: string;
  IsSME?: string;
  LatestQuoteDate?: Date;
  OrderType?: string;
  Parma?: string;
  QuoteReceivedDate?: string;
  ReasonOfRFQ?: string;
  RFQDueDate?: Date;
  RFQInstructionToSupplier?: string;
  RFQNo?: string;
  RFQStatus?: string;
  RFQType?: string;
  SectionInfo?: string;
  SupplierContact?: string;
  SupplierEmail?: string;
  SupplierName?: string;
}
export interface IUDGSRFQCreteriaModel {
  RFQType?: string;
  RFQNo?: string;
  Buyer?: string;
  Section?: string;
  Status?: string[];
  ParmaAccurate?: string;
  ParmaBlur?: string;
  RFQReleaseDateFrom?: string;
  RFQReleaseDateTo?: string;
  RFQDueDateFrom?: string;
  RFQDueDateTo?: string;
}
