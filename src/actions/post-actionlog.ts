import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSActionlogFormModel } from "../model-v2/udgs-actionlog-model";
import { getSP } from "../pnpjsConfig";

export async function postActionlog(
  actionlog: IUDGSActionlogFormModel
): Promise<number> {
  try {
    const sp = spfi(getSP());
    const addItemResult = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_ACTIONLOG)
      .items.add(actionlog);
    return addItemResult.ID;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_postActionlog) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.updateDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.updateDataFailed);
  }
}
