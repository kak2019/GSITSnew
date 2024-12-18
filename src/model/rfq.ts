import { IRequisitionRFQGrid } from "./requisition";

export interface IRFQGrid {
  ID?: string; //SharePoint Item Id
  RFQNo?: string; //Column "RFQ No."
  Created?: Date; //SharePoint Item Create Date Used for RFQ Release Date filter.
  Parma?: string; //Column "Parma"
  RFQDueDate?: Date; //Column "RFQ Due Date"
  OrderType?: string; //Column "Order Type"
  SupplierContact?: string; //Column "Supplier Contact"
  RFQInstructionToSupplier?: string; //Column "RFQ Instruction To Supplier"
  RFQStatus?: string; //Column "RFQ Status" Used for Status filter
  LatestQuoteDate?: Date; //Column "Latest Quote Date"
  CommentHistory?: string; //Column "Comment History"
  RequisitionIds?: string; //Column "Requisition Ids"
  Title?: string; //Column "Title"
  BuyerInfo?: string; //Column "Buyer Info" Used for Buyer filter
  SectionInfo?: string; //Column "Section Info" Used for Section filter
  QuoteReceivedDate?: Date; //Column "Quote Received Date"
  ReasonOfRFQ?: string; //Column "Reason of RFQ"
  EffectiveDateRequest?: Date; //Column "Effective Date Request"
  HandlerName?: string; //Column "Handler Name"
  RFQType?: string; //Column "RFQ Type"
  BuyerName?: string;
  BuyerEmail?: string;
  LastCommentBy?: string; //The last comment from column "Comment History"
  SupplierName?: string; //Column "Supplier Name"
}
export interface IRFQRequisition {
  RFQ: IRFQGrid;
  Requisitions: IRequisitionRFQGrid[];
}
export interface IRFQQueryModel {
  RfqType?: string;
  RfqNo?: string;
  Buyer?: string;
  Section?: string;
  Status?: string[];
  ParmaAccurate?: string;
  ParmaBlur?: string;
  RfqReleaseDateFrom?: string;
  RfqReleaseDateTo?: string;
  RfqDueDateFrom?: string;
  RfqDueDateTo?: string;
  LastItemId?: string;
}
