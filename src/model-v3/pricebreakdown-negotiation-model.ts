import { IUDGSActionlogGridModel } from "../model-v2/udgs-actionlog-model";
import { IUDGSAttachmentGridModel } from "../model-v2/udgs-attachment-model";
import { IUDGSNegotiationPartGridModel } from "../model-v2/udgs-negotiation-model";
import { IUDGSQuotationGridModel } from "../model-v2/udgs-quotation-model";
import { IUDGSRFQGridModel } from "../model-v2/udgs-rfq-model";

export interface IPriceBreakdownInitiateDataModel {
  rfqValue: IUDGSRFQGridModel;
  partValue: IUDGSNegotiationPartGridModel;
  quotationValue: IUDGSQuotationGridModel;
  actionlogValue: IUDGSActionlogGridModel[];
  attachmentValue: IUDGSAttachmentGridModel[];
}
export interface IPriceBreakdownModifiedModel {
  partModifiedDate: Date;
  quotationModifiedDate: Date;
  rfqModifiedDate?: Date;
}
