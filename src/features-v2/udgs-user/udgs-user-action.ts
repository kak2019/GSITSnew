import { createAsyncThunk } from "@reduxjs/toolkit";
import { spfi } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { CONST, FeatureKey } from "../../config/const";
import { getSP } from "../../pnpjsConfig";
import { MESSAGE } from "../../config/message";
import { AppInsightsService } from "../../config/AppInsightsService";
import { camlEqText } from "../../common/camlHelper";
import {
  IUDGSSectionModel,
  IUDGSUserRoleModel,
} from "../../model-v2/udgs-user-model";

//#region actions
export const getSupplierIdAction = createAsyncThunk(
  `${FeatureKey.USERS}/getSupplierId`,
  async (email: string): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_USERMAPPING)
        .renderListDataAsStream({
          ViewXml: `<View>
                  <Query>
                  <Where>
                  ${camlEqText(email, "UserEmail")}
                  </Where>
                  <OrderBy>
                    <FieldRef Name="ID" Ascending="FALSE" />
                  </OrderBy>
                  </Query>
                  </View>`,
        });
      return response.Row.length > 0 ? response.Row[0].SupplierId : "";
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
export const getRolesAction = createAsyncThunk(
  `${FeatureKey.USERS}/getRoles`,
  async (): Promise<IUDGSUserRoleModel[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_USERROLE)
        .renderListDataAsStream({
          ViewXml: `<View>
                  <Query>
                  <OrderBy>
                    <FieldRef Name="ID" Ascending="FALSE" />
                  </OrderBy>
                  </Query>
                  </View>`,
        });
      const roles = response.Row.map((item) => {
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
        } as IUDGSUserRoleModel;
      });
      return roles;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getRoles) - ${JSON.stringify(err)}`,
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
export const getSectionsAction = createAsyncThunk(
  `${FeatureKey.USERS}/getSections`,
  async (): Promise<IUDGSSectionModel[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SECTIONDATA)
        .renderListDataAsStream({
          ViewXml: `<View>
                  <Query>
                  <OrderBy>
                    <FieldRef Name="ID" Ascending="FALSE" />
                  </OrderBy>
                  </Query>
                  </View>`,
        });
      const sections = response.Row.map((item) => {
        return {
          SectionCode: item.SectionCode.trim(),
          SectionDescription: item.SectionDescription.trim(),
        } as IUDGSSectionModel;
      });
      return sections;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSections) - ${JSON.stringify(err)}`,
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
