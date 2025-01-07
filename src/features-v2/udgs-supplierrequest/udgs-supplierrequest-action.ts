import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { camlEqNumber } from "../../common/camlHelper";
import { AppInsightsService } from "../../config/AppInsightsService";
import { FeatureKey, CONST } from "../../config/const";
import { MESSAGE } from "../../config/message";
import { getSP } from "../../pnpjsConfig";
import {
  IUDGSSupplierRequestFormModel,
  IUDGSSupplierRequestGridModel,
} from "../../model-v2/udgs-supplierrequest-model";

//#region actions
export const getSupplierRequestByIDAction = createAsyncThunk(
  `${FeatureKey.SUPPLIERREQUEST}/getSupplierRequestByID`,
  async (supplierRequestID: number): Promise<IUDGSSupplierRequestGridModel> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(supplierRequestID, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const supplierRequest = {
        ID: response.Row[0].ID,
        Modified: response.Row[0].Modified,
      } as IUDGSSupplierRequestGridModel;
      return supplierRequest;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSupplierRequestByID) - ${JSON.stringify(
          err
        )}`,
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
export const postSupplierRequestAction = createAsyncThunk(
  `${FeatureKey.SUPPLIERREQUEST}/postSupplierRequest`,
  async (supplierRequest: IUDGSSupplierRequestFormModel): Promise<number> => {
    const sp = spfi(getSP());
    try {
      const addItemResult = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .items.add(supplierRequest);
      return addItemResult.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_postSupplierRequest) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.createDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.createDataFailed);
    }
  }
);
export const putSupplierRequestAction = createAsyncThunk(
  `${FeatureKey.SUPPLIERREQUEST}/putSupplierRequest`,
  async (supplierRequest: IUDGSSupplierRequestFormModel): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .items.getById(supplierRequest.ID!)
        .update(supplierRequest);
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_putSupplierRequest) - ${JSON.stringify(err)}`,
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
