export interface IBaseCreteriaModel {
  ID?: number;
}
export interface IActionlogCreteriaModel extends IBaseCreteriaModel {
  PartID?: number;
  RFQID?: number;
}
export interface IRequisitionPartCreteriaModel extends IBaseCreteriaModel {}
export interface INegotiationPartCreteriaModel extends IBaseCreteriaModel {}
export interface IRFQCreteriaModel extends IBaseCreteriaModel {}
export interface IQuotationCreteriaModel extends IBaseCreteriaModel {}
