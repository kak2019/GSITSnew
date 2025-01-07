import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSQuotationFormModel } from "../model-v2/udgs-quotation-model";
import { getSP } from "../pnpjsConfig";

export async function putQuotation(
  value: IUDGSQuotationFormModel
): Promise<Date> {
  try {
    const sp = spfi(getSP());
    const modifiedDate = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_QUOTATION)
      .items.getById(value.ID!)
      .update(value)
      .then(async () => {
        const result = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_QUOTATION)
          .items.getById(value.ID!)();
        return new Date(result["Modified."]);
      });
    return modifiedDate;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_putQuotation) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.updateDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.updateDataFailed);
  }
}
