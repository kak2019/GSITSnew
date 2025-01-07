import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSActionlogGridModel } from "../model-v2/udgs-actionlog-model";
import { getSP } from "../pnpjsConfig";
import { IActionlogCreteriaModel } from "../model-v2/udgs-creteria-model";
import { camlAndFinal, camlEqNumber } from "../common/camlHelper";

export async function getActionlogs(
  creteria: IActionlogCreteriaModel
): Promise<IUDGSActionlogGridModel[]> {
  try {
    const sp = spfi(getSP());
    const response = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_ACTIONLOG)
      .renderListDataAsStream({
        ViewXml: `<View>
        <Query>
        ${getFilterString(creteria)}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
      });
    const actionlogs = response.Row.map((item) => {
      return {
        User: item.User,
        Date: item.Date,
        LogType: item.LogType,
        RFQIDRef: item.RFQIDRef,
        PartIDRef: item.PartIDRef,
      } as IUDGSActionlogGridModel;
    });
    return actionlogs;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_getActionlogs) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.retrieveDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
}
function getFilterString(creteria: IActionlogCreteriaModel): string {
  if (creteria.PartID) {
    return camlAndFinal([camlEqNumber(creteria.PartID, "PartIDRef")]);
  }
  if (creteria.RFQID) {
    return camlAndFinal([camlEqNumber(creteria.RFQID, "RFQIDRef")]);
  }
  return "";
}
