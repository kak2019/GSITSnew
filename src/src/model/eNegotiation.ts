export interface IENegotiationRequestCreteriaModel {
  Buyer?: string;
  Status?: string[];
  ExpectedEffectiveDateFrom?: string;
  ExpectedEffectiveDateTo?: string;
  Parma?: string;
  SupplierRequestID?: string;
  RFQNo?: string;
}

export interface IENegotiationRequestFormModel {
  ID?: string;
  RequestID?: string;
  Parma?: string;
  SupplierContact?: string;
  Porg?: string;
  Handler?: string;
  ExpectedEffectiveDateFrom?: Date;
  ReasonCode?: string;
  Status?: string;
}

export interface IENegotiationRequest {
  ID: string;
  RequestID?: string;
  SupplierRequestIDRef?: string;
  Parma?: string;
  SupplierName?: string;
  SupplierContact?: string;
  Porg?: string;
  Handler?: string;
  ExpectedEffectiveDateFrom?: Date;
  ReasonCode?: string;
  RFQNo?: string;
  RFQIDRef?: string;
  NegotiationNo?: string;
  Status?: string;
  RFQStatus?: string;
  CreatedDate?: Date;
  CreatedBy?: string;
  ModifiedDate?: Date;
  ModifiedBy?: string;
}
