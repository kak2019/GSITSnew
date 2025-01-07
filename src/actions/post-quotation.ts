import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSQuotationFormModel } from "../model-v2/udgs-quotation-model";
import { getSP } from "../pnpjsConfig";

export async function postQuotation(
  value: IUDGSQuotationFormModel
): Promise<number> {
  try {
    const sp = spfi(getSP());
    const quotationContentTypeID = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_QUOTATION)
      .contentTypes()
      .then((result) => {
        return result.filter((i) => i.Name === "Quotation")[0].Id.StringValue;
      });
    console.log(quotationContentTypeID);
    const newItem = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_QUOTATION)
      .items.add({ ...value });
    return newItem.ID;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_postQuotation) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.createDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.createDataFailed);
  }
}
