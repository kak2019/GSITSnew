declare let azureFunctionBaseUrl: string;
declare let aadClientId: string;
declare let appInsightsKey: string;
declare let SiteUrl:string;
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
  private static getGroupName(role: string): string {
    const env = SiteUrl.endsWith('dev') ? 'DEV' :
                SiteUrl.endsWith('test') ? 'TEST' :
                SiteUrl.endsWith('qa') ? 'QA' : 'PROD';
    return `UD-AZ-61000287-UDGS-${role}_${env}`;
  }

  public static get ADGroupName_SUPPLIER(): string {
    return this.getGroupName('SUPPLIER');
  }

  public static get ADGroupName_MANAGER(): string {
    return this.getGroupName('MANAGER');
  }

  public static get ADGroupName_BUYER(): string {
    return this.getGroupName('BUYER');
  }

  public static get ADGroupName_RPA_USER(): string {
    return this.getGroupName('RPA_USER');
  }

  public static get ADGroupName_BUSINESS_ADMIN(): string {
    return this.getGroupName('BUSINESS_ADMIN');
  }

  public static get ADGroupName_SYSTEM_ADMIN(): string {
    return this.getGroupName('SYSTEM_ADMIN');
  }
}
const CONST = {
  LIST_NAME_MAILTRIGGER: "MailTrigger",
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
  LIST_NAME_SUPPLIERHOSTBUYERMAPPING: "SupplierHostBuyerMapping",
  CONFIGLIB_Name: "SiteAssets",
  SPLITTER: "; ",
  LOG_SOURCE: "🔶gsits",
  LIBRARY_NAME: "Documents",
  LIBRARY_RFQATTACHMENTS_NAME: "RFQ Attachments",
  LIBRARY_QUOTATIONATTACHMENTS_NAME: "Quotation Attachments",
  LIBRARY_NAME_SUPPLIERREQUESTATTACHMENTS: "Supplier Request Attachments",
  azureFunctionBaseUrl: HostSettings.AzureHost,
  aadClientId: HostSettings.AadClientId,
  appInsightsKey: HostSettings.AppInsightsKey,
  RFQTypePart:"New Part Price",
  RFQTypePrice:"Price Change",
  GROUP_NAME_BUSINESS_ADMIN:HostSettings.ADGroupName_BUSINESS_ADMIN,
  GROUP_NAME_SUPPLIER: HostSettings.ADGroupName_SUPPLIER,
  GROUP_NAME_BUYER:HostSettings.ADGroupName_BUYER,
  GROUP_NAME_MANAGER:HostSettings.ADGroupName_MANAGER,
  GROUP_NAME_RPA_USER:HostSettings.ADGroupName_RPA_USER,
  GROUP_NAME_SYSTEM_ADMIN:HostSettings.ADGroupName_SYSTEM_ADMIN
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

const ROLE_TYPE = {
  BUYER: "Buyer",
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

const REASON_CODE_OPTIONS = [
  {
    key: REASON_CODE.C.CODE,
    text: REASON_CODE.C.DESC,
    title: REASON_CODE.C.DESC,
  },
  {
    key: REASON_CODE.O.CODE,
    text: REASON_CODE.O.DESC,
    title: REASON_CODE.O.DESC,
  },
  {
    key: REASON_CODE.C.CODE,
    text: REASON_CODE.R.DESC,
    title: REASON_CODE.R.DESC,
  },
  {
    key: REASON_CODE.C.CODE,
    text: REASON_CODE.S.DESC,
    title: REASON_CODE.S.DESC,
  },
  {
    key: REASON_CODE.C.CODE,
    text: REASON_CODE.T.DESC,
    title: REASON_CODE.T.DESC,
  },
  {
    key: REASON_CODE.C.CODE,
    text: REASON_CODE.W.DESC,
    title: REASON_CODE.W.DESC,
  },
  {
    key: REASON_CODE["0"].CODE,
    text: REASON_CODE["0"].DESC,
    title: REASON_CODE["0"].DESC,
  },
  {
    key: REASON_CODE["1"].CODE,
    text: REASON_CODE["1"].DESC,
    title: REASON_CODE["1"].DESC,
  },
  {
    key: REASON_CODE["2"].CODE,
    text: REASON_CODE["2"].DESC,
    title: REASON_CODE["2"].DESC,
  },
  {
    key: REASON_CODE["3"].CODE,
    text: REASON_CODE["3"].DESC,
    title: REASON_CODE["3"].DESC,
  },
  {
    key: REASON_CODE["4"].CODE,
    text: REASON_CODE["4"].DESC,
    title: REASON_CODE["4"].DESC,
  },
  {
    key: REASON_CODE["6"].CODE,
    text: REASON_CODE["6"].DESC,
    title: REASON_CODE["6"].DESC,
  },
  {
    key: REASON_CODE["7"].CODE,
    text: REASON_CODE["7"].DESC,
    title: REASON_CODE["7"].DESC,
  },
  {
    key: REASON_CODE["8"].CODE,
    text: REASON_CODE["8"].DESC,
    title: REASON_CODE["8"].DESC,
  },
  {
    key: REASON_CODE["9"].CODE,
    text: REASON_CODE["9"].DESC,
    title: REASON_CODE["9"].DESC,
  },
];

export {
  CONST,
  FeatureKey,
  STATUS,
  USER_TYPE,
  ROLE_TYPE,
  REASON_CODE,
  REASON_CODE_OPTIONS,
};
