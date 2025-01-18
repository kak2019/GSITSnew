import { IDropdownOption } from "@fluentui/react";
import {
  IUDGSActionlogGridModel,
  IUDGSAttachmentGridModel,
  IUDGSCommentModel,
  IUDGSNegotiationPartGridModel,
  IUDGSQuotationGridModel,
  IUDGSRFQGridModel,
} from "../../../../model-v2";

interface IPCTextFieldPriceBreakdown {
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
export interface IPCFieldValidationModel {
  Field: keyof IUDGSQuotationGridModel;
  RowIndex: number;
  ColumnIndex: number;
}
export interface IPriceBreakdownInitiateDataModel {
  rfqValue: IUDGSRFQGridModel;
  partValue: IUDGSNegotiationPartGridModel;
  quotationValue: IUDGSQuotationGridModel;
  actionlogValue: IUDGSActionlogGridModel[];
  attachmentValue: IUDGSAttachmentGridModel[];
  commentHistoryValue: IUDGSCommentModel[];
}
export interface IPriceBreakdownModifiedModel {
  partModifiedDate: Date;
  quotationModifiedDate: Date;
  attachmentValue: IUDGSAttachmentGridModel[];
  quotationID?: number;
}
export interface IPCTextFieldRowPriceBreakdown {
  Fields: IPCTextFieldPriceBreakdown[];
  IsLastRow: boolean;
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
