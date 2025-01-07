export interface IUDGSSupplierRequestGridModel {
  ID: number;
  Modified: Date;
  CommentHistory: string;
  DetailedDescription: string;
  ExpectedEffectiveDate: Date;
  HostBuyer: string;
  HostBuyerName: string;
  LastUpdateDate: Date;
  Parma: string;
  RequestID: string;
  SupplierContact: string;
  SupplierName: string;
  SupplierRequestDate: Date;
  SupplierRequestStatus: string;
}
export interface IUDGSSupplierRequestFormModel {
  ID?: number;
  CommentHistory?: string;
  DetailedDescription?: string;
  ExpectedEffectiveDate?: Date;
  HostBuyer?: string;
  HostBuyerName?: string;
  IsReturned?: string;
  LastUpdateDate?: Date;
  Parma?: string;
  RequestID?: string;
  SupplierContact?: string;
  SupplierName?: string;
  SupplierRequestDate?: Date;
  SupplierRequestStatus?: string;
}
