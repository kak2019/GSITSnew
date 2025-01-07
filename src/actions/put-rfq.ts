import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSRFQFormModel } from "../model-v2/udgs-rfq-model";
import { getSP } from "../pnpjsConfig";

export async function putRFQ(value: IUDGSRFQFormModel): Promise<Date> {
  try {
    const sp = spfi(getSP());
    const modifiedDate = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_RFQLIST)
      .items.getById(value.ID!)
      .update(value)
      .then(async () => {
        const result = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_RFQ)
          .items.getById(value.ID!)();
        return new Date(result.Modified);
      });
    return modifiedDate;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_putRFQ) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.updateDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.updateDataFailed);
  }
}
