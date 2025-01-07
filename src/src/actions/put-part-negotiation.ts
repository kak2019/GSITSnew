import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSNegotiationPartFormModel } from "../model-v2/udgs-negotiation-model";
import { getSP } from "../pnpjsConfig";

export async function putPartNegotiation(
  value: IUDGSNegotiationPartFormModel
): Promise<Date> {
  try {
    const sp = spfi(getSP());
    const modifiedDate = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_PART)
      .items.getById(value.ID!)
      .update(value)
      .then(async () => {
        const result = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_PART)
          .items.getById(value.ID!)();
        return new Date(result["Modified."]);
      });
    return modifiedDate;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_putPart) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.updateDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.updateDataFailed);
  }
}
