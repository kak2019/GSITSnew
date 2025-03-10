export interface IUserMapping {
  UserEmail: string;
  SupplierId: string;
}

export interface IUserRole {
  RolePermission: string;
  RequisitionUpload: string;
  RequisitionforNewPartPriceInput: string;
  NewPartsRFQCreation: string;
  RFQQUOT: string;
  QuotationList: string;
  PartPriceBreakdown: string;
  OrderFiles: string;
  MasterData: string;
}

export interface IGPSUser {
  porg: string;
  role: string;
  name: string;
  sectionCode: string;
  handlercode: string;
}

export interface ISupplierHostBuyerMapping {
  PARMANbr: string;
  PARMANm: string;
  SupplierHostPorg: string;
  SupplierHostCd: string;
  SupplierHostName: string;
}