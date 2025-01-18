export interface IBaseCreteriaModel {
  ID?: number;
}
export interface IActionlogCreteriaModel extends IBaseCreteriaModel {
  PartID?: number;
  RFQID?: number;
}
export interface IRequisitionPartCreteriaModel extends IBaseCreteriaModel {}
export interface INegotiationPartCreteriaModel extends IBaseCreteriaModel {
  NegotiationRefNo?: string;
  RfqID?: number;
}
export interface IRFQCreteriaModel extends IBaseCreteriaModel {
  RFQStatus?: string[];
}
export interface IQuotationCreteriaModel extends IBaseCreteriaModel {
  PartIDs?: number[];
}
