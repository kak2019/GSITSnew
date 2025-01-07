import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { camlEqNumber } from "../../common/camlHelper";
import { AppInsightsService } from "../../config/AppInsightsService";
import { FeatureKey, CONST } from "../../config/const";
import { MESSAGE } from "../../config/message";
import { getSP } from "../../pnpjsConfig";
import {
  IUDGSActionlogFormModel,
  IUDGSActionlogGridModel,
} from "../../model-v2/udgs-actionlog-model";

//#region actions
export const getActionlogsByPartIDAction = createAsyncThunk(
  `${FeatureKey.ACTIONLOGS}/getActionlogsByPartID`,
  async (partID: number): Promise<IUDGSActionlogGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ACTIONLOG)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(partID, "PartIDRef")}
        </Where>
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
        `${CONST.LOG_SOURCE} (_getActionlogsByPartID) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.retrieveDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const getActionlogsByRFQIDAction = createAsyncThunk(
  `${FeatureKey.ACTIONLOGS}/getActionlogsByRFQID`,
  async (rfqID: number): Promise<IUDGSActionlogGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ACTIONLOG)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(rfqID, "RFQIDRef")}
        </Where>
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
        `${CONST.LOG_SOURCE} (_getActionlogsByRFQID) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.retrieveDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const postActionlogAction = createAsyncThunk(
  `${FeatureKey.ACTIONLOGS}/postActionlog`,
  async (actionlog: IUDGSActionlogFormModel): Promise<number> => {
    const sp = spfi(getSP());
    try {
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
);
//#endregion
//#region methods
//#endregion
