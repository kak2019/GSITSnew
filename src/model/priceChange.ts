export interface ISupplierRequestCreteriaModel {
  HostBuyer?: string;
  SupplierRequestStatus?: string[];
  ExpectedEffectiveDateFrom?: string;
  ExpectedEffectiveDateTo?: string;
  Parma?: string;
  ResponsibleBuyer?: string;
  IDS?: number[];
}

export interface ISupplierRequestFormModel {
  ID?: string;
  Parma?: string;
  HostBuyer?: string; // email
  HostBuyerName?: string;
  ExpectedEffectiveDateFrom?: Date;
  SupplierContact?: string;
  DetailedDescription?: string;
  CommentHistory?: string;
  SupplierRequestStatus?: string;
  RequestID?: string;
}

export interface ISupplierRequest {
  ID: string;
  CommentHistory?: string;
  DetailedDescription?: string;
  ExpectedEffectiveDateFrom?: Date;
  HostBuyer?: string;
  HostBuyerName?: string;
  IsReturned?: string;
  IsSenttoHostBuyer?: string;
  LastUpdateDate?: Date;
  Parma?: string;
  RequestID?: string;
  SupplierContact?: string;
  SupplierName?: string;
  SupplierRequestDate?: Date;
  SupplierRequestStatus?: string;
  CreatedDate?: Date;
  CreatedBy?: string;
  ModifiedDate?: Date;
  ModifiedBy?: string;
}

export interface ISupplierRequestSubItemCreteriaModel {
  Porg?: string;
  Handler?: number;
  HandlerName?: string;
  Section?: string;
  SupplierRequestSubitemStatus?: string[];
}

export interface ISupplierRequestSubItemFormModel {
  ID?: string;
  Porg?: string;
  Handler?: number;
  HandlerName?: string;
  Section?: string;
  RequestIDRef?: string;
  SupplierRequestSubitemStatus?: string;
}

export interface ISupplierRequestSubItem {
  ID: string;
  ExpectedEffectiveDateFrom?: Date;
  Handler?: number;
  HandlerName?: string;
  IsSenttoHostBuyer?: string;
  NotificationDate?: Date;
  Porg?: string;
  ResponsibleBuyer?: string;
  ReasonCode?: string;
  RequestIDRef?: string;
  Section?: string;
  SectionDescription?: string;
  SupplierRequestSubitemStatus?: string;
  CreatedDate?: Date;
  CreatedBy?: string;
  ModifiedDate?: Date;
  ModifiedBy?: string;
}
