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
  LIST_NAME_REQUISITION: "Requisitions",
  LIST_NAME_RFQ: "RFQs",
  LIST_NAME_USERMAPPING: "UserSupplierMapping",
  LIST_NAME_USERROLE: "User Role",
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
  PARMAS: "PARMAS",
  BUYERS: "BUYERS",
  RFQS: "RFQS",
  QUOTATIONS: "QUOTATIONS",
  DOCUMENTS: "DOCUMENTS",
  REQUISITIONS: "REQUISITIONS",
  USERROLES: "USERROLES",
} as const;
export { CONST, FeatureKey };
