declare let azureFunctionBaseUrl: string;
declare let aadClientId: string;
declare let appInsightsKey: string;
export class HostSettings {
  public static get AzureHost(): string {
    return azureFunctionBaseUrl;
  }
  public static get AadClientId(): string {
    return aadClientId;
  }
  public static get AppInsightsKey(): string {
    return appInsightsKey;
  }
}
const CONST = {
  LIST_NAME_ACTIONLOG: "Action Log",
  LIST_NAME_PART: "Parts",
  LIST_NAME_QUOTATION: "Quotations",
  LIST_NAME_REQUISITION: "Requisitions",
  LIST_NAME_RFQ: "RFQs",
  LIST_NAME_RFQLIST: "RFQ List",
  LIST_NAME_SECTIONDATA: "Section Data",
  LIST_NAME_USERMAPPING: "UserSupplierMapping",
  LIST_NAME_USERROLE: "User Role",
  LIST_NAME_SUPPLIERREQUESTS: "Supplier Requests",
  LIST_NAME_SUPPLIERREQUESTSUBITEMS: "Supplier Request SubItems",
  LIST_NAME_ENEGOTIATIONREQUESTS: "e-Negotiation Requests",
  CONFIGLIB_Name: "SiteAssets",
  SPLITTER: "; ",
  LOG_SOURCE: "🔶gsits",
  LIBRARY_NAME: "Documents",
  LIBRARY_RFQATTACHMENTS_NAME: "RFQ Attachments",
  LIBRARY_QUOTATIONATTACHMENTS_NAME: "Quotation Attachments",
  azureFunctionBaseUrl: HostSettings.AzureHost,
  aadClientId: HostSettings.AadClientId,
  appInsightsKey: HostSettings.AppInsightsKey,
};
/**
 * State feature key (prefix of action name)
 */
const FeatureKey = {
  ACTIONLOGS: "ACTIONLOGS",
  ATTACHMENTS: "ATTACHMENTS",
  PARMAS: "PARMAS",
  PARTS: "PARTS",
  BUYERS: "BUYERS",
  RFQS: "RFQS",
  QUOTATIONS: "QUOTATIONS",
  DOCUMENTS: "DOCUMENTS",
  REQUISITIONS: "REQUISITIONS",
  USERS: "USERS",
  USERROLES: "USERROLES",
  GSITSRFQS: "GSITSRFQS",
  PRICECHANGE: "PRICECHANGE",
  SUPPLIERREQUEST: "SUPPLIERREQUEST",
  ENEGOTIATIONREQUESTS: "ENEGOTIATIONREQUESTS",
} as const;

const STATUS = {
  NEW: "New",
  REQUESTED: "Requested",
  INPROGRESS: "In Progress",
  RETURNED: "Returned",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
  SENTTOGPS: "Sent to GPS",
};

const USER_TYPE = {
  GUEST: "Guest",
  MEMBER: "Member",
};

const REASON_CODE = {
  C: { CODE: "C", DESC: "C - Commercial, within Cost Reduction Project" },
  O: { CODE: "O", DESC: "O - Supplier switch" },
  R: { CODE: "R", DESC: "R - Raw Material without agreement" },
  S: { CODE: "S", DESC: "S - Special Commercial Tracking" },
  T: { CODE: "T", DESC: "T - Technical, within Cost Reduction Project" },
  W: { CODE: "W", DESC: "W - Currency" },
  "0": { CODE: "0", DESC: "0 - Special research" },
  "1": { CODE: "1", DESC: "1 - Non-Performance related price change" },
  "2": { CODE: "2", DESC: "2 - Commercial negotiation" },
  "3": { CODE: "3", DESC: "3 - Raw Material with agreement" },
  "4": { CODE: "4", DESC: "4 - Packaging" },
  "6": { CODE: "6", DESC: "6 - Technical changes" },
  "7": { CODE: "7", DESC: "7 - Phased out production to AM" },
  "8": { CODE: "8", DESC: "8 - Insourcing / Outsourcing" },
  "9": { CODE: "9", DESC: "9 - Freight / Transportation" },
};

export { CONST, FeatureKey, STATUS, USER_TYPE, REASON_CODE };
