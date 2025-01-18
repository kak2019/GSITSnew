import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import { AppInsightsService } from "../../config/AppInsightsService";
import { IUserMapping, IUserRole } from "../../model/user";

//#region actions
export const getSupplierIdByUserEmailAction = createAsyncThunk(
  `${FeatureKey.USERROLES}/getSupplierIdByUserEmail`,
  async (email: string): Promise<string> => {
    const sp = spfi(getSP());
    try {
      let items: IUserMapping[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_USERMAPPING)
          .items.select("UserEmail", "SupplierId")
          .top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              UserEmail: item.UserEmail,
              SupplierId: item.SupplierId,
            } as IUserMapping;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }
      return items.filter((item) => item.UserEmail === email)[0].SupplierId;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSupplierId) - ${JSON.stringify(err)}`,
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
export const getUserRoleAction = createAsyncThunk(
  `${FeatureKey.USERROLES}/getUserRole`,
  async (): Promise<IUserRole[]> => {
    const sp = spfi(getSP());
    try {
      let items: IUserRole[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_USERROLE)
          .items.top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              RolePermission: item.Role_x002f_Permission,
              RequisitionUpload: item.RequisitionUpload,
              RequisitionforNewPartPriceInput: item.RequisitionforNewPartPrice,
              NewPartsRFQCreation: item.NewPartsRFQCreation,
              RFQQUOT: item.RFQQUOT,
              QuotationList: item.QuotationList,
              PartPriceBreakdown: item.PartPriceBreakdown,
              OrderFiles: item.OrderFiles,
              MasterData: item.MasterData,
            } as IUserRole;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }
      return items;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSupplierId) - ${JSON.stringify(err)}`,
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
//#endregion
//#region methods
//#endregion
