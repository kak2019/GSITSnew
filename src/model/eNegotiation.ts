export interface IENegotiationRequestCreteriaModel {
  Buyer?: string;
  Porg?: string;
  Handler?: number;
  RFQNo?: string;
  ExpectedEffectiveDateFrom?: string;
  ExpectedEffectiveDateTo?: string;
  Parma?: string;
  SupplierRequestID?: string;
  RFQStatus?: string[];
  RFQIDRefs?: number[];
}

export interface IENegotiationRequestFormModel {
  ID?: string;
  RequestID?: string;
  Parma?: string;
  SupplierContact?: string;
  Porg?: string;
  Handler?: number;
  ExpectedEffectiveDateFrom?: Date;
  ReasonCode?: string;
  RFQNo?: string;
  RFQIDRef?: number;
  SupplierRequestIDRef?: string;
}

export interface IENegotiationRequest {
  ID: string;
  RequestID?: string;
  SupplierRequestIDRef?: string;
  Parma?: string;
  SupplierName?: string;
  SupplierContact?: string;
  Porg?: string;
  Handler?: number;
  ExpectedEffectiveDateFrom?: Date;
  ReasonCode?: string;
  RFQNo?: string;
  RFQIDRef?: number;
  NegotiationNo?: string;
  RFQStatus?: string;
  Buyer?: string;
  CreatedDate?: Date;
  CreatedBy?: string;
  ModifiedDate?: Date;
  ModifiedBy?: string;
}
