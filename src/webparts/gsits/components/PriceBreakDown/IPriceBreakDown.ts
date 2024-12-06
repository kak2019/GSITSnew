import { IQuotationGrid } from "../../../../model/requisition";

export interface ITextFieldPriceBreakdown {
  FieldType: "Text" | "Number" | "Choice" | "Blank";
  Label?: string;
  Key?: keyof IQuotationGrid;
  Choice?: IOption[];
  MaxLength?: number;
  MaxValue?: number;
  MinValue?: number;
  AdditionalIcon?: string;
}
export interface IOption {
  Text: string;
  Value: string;
}
