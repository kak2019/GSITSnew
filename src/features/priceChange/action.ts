/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import { AppInsightsService } from "../../config/AppInsightsService";
import {
  camlAndFinal,
  camlChoiceMultipleText,
  camlContainsText,
  camlEqNumber,
  camlEqText,
  camlGeqDate,
  camlLtDate,
} from "../../common/camlHelper";
import {
  ISupplierRequestCreteriaModel,
  ISupplierRequestFormModel,
  ISupplierRequest,
  ISupplierRequestSubItemFormModel,
  ISupplierRequestSubItem,
} from "../../model/priceChange";
import { setCurrentPriceChangeRequest } from "./reducer";

// 异步操作
export const getSupplierRequestListAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/getSupplierRequestList`,
  async (Query: ISupplierRequestCreteriaModel): Promise<ISupplierRequest[]> => {
    const sp = spfi(getSP());
    try {
      const queryXml = GetQueryInfo(Query);
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        ${queryXml}
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      return response.Row.map((item) => {
        return {
          ID: item.ID,
          CommentHistory: item.CommentHistory,
          DetailedDescription: item.DetailedDescription,
          ExpectedEffectiveDateFrom: item.ExpectedEffectiveDateFrom,
          HostBuyer: item.HostBuyer,
          HostBuyerName: item.HostBuyerName,
          IsReturned: item.IsReturned,
          IsSenttoHostBuyer: item.IsSenttoHostBuyer,
          LastUpdateDate: item.LastUpdateDate,
          Parma: item.Parma,
          RequestID: item.RequestID,
          SupplierContact: item.SupplierContact,
          SupplierName: item.SupplierName,
          SupplierRequestDate: item.SupplierRequestDate,
          SupplierRequestStatus: item.SupplierRequestStatus,
          CreatedDate: item.Created,
          CreatedBy: item.Author && item.Author[0] ? item.Author[0].title : "",
          ModifiedDate: item.Modified,
          ModifiedBy: item.Editor && item.Editor[0] ? item.Editor[0].title : "",
        } as ISupplierRequest;
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSupplierRequestList) - ${JSON.stringify(
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
export const getSupplierRequestAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/getSupplierRequest`,
  async (id: string): Promise<ISupplierRequest> => {
    const sp = spfi(getSP());
    try {
      // 这种方式缺一些字段
      // const response = await sp.web.lists
      //   .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
      //   .items.getById(Number(id))();
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(Number(id), "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      return {
        ID: response.Row[0].ID,
        CommentHistory: response.Row[0].CommentHistory || "",
        DetailedDescription: response.Row[0].DetailedDescription,
        ExpectedEffectiveDateFrom: response.Row[0].ExpectedEffectiveDateFrom,
        HostBuyer: response.Row[0].HostBuyer,
        HostBuyerName: response.Row[0].HostBuyerName,
        LastUpdateDate: response.Row[0].ModifiedDate,
        Parma: response.Row[0].Parma,
        RequestID: response.Row[0].RequestID,
        SupplierContact: response.Row[0].SupplierContact,
        SupplierName: response.Row[0].SupplierName,
        SupplierRequestDate: response.Row[0].SupplierRequestDate,
        SupplierRequestStatus: response.Row[0].SupplierRequestStatus,
        CreatedDate: response.Row[0].Created,
        CreatedBy:
          response.Row[0].Author && response.Row[0].Author[0]
            ? response.Row[0].Author[0].email
            : "",
        ModifiedDate: response.Row[0].Modified,
        ModifiedBy:
          response.Row[0].Editor && response.Row[0].Editor[0]
            ? response.Row[0].Editor[0].title
            : "",
      } as ISupplierRequest;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getSupplierRequest) - ${JSON.stringify(err)}`,
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
export const createSupplierRequestAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/createSupplierRequest`,
  async (form: ISupplierRequestFormModel): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const result = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .items.add(form);
      return result.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_createSupplierRequest) - ${JSON.stringify(err)}`,
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
export const updateSupplierRequestAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/updateSupplierRequest`,
  async (form: ISupplierRequestFormModel): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTS)
        .items.getById(+form.ID!)
        .update({
          ID: form.ID,
          ExpectedEffectiveDateFrom: form.ExpectedEffectiveDateFrom,
          SupplierContact: form.SupplierContact,
          DetailedDescription: form.DetailedDescription,
          // comment传参需要提前拼接好历史记录
          CommentHistory: form.CommentHistory,
        });
      // host buyer更新request的responsible buyers，应该是创建subitems，然后通过Request ID关联上
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateSupplierRequest) - ${JSON.stringify(err)}`,
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
export const getSupplierRequestSubitemListAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/getSupplierRequestSubitemList`,
  async (id: string): Promise<ISupplierRequestSubItem[]> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERREQUESTSUBITEMS)
        .renderListDataAsStream({
          ViewXml: `<View>
          <Query>
          ${camlEqNumber(Number(id), "Request ID Ref")}
          <OrderBy>
            <FieldRef Name="ID" Ascending="FALSE" />
          </OrderBy>
          </Query>
          </View>`,
        });
      return response.Row.map((item) => {
        return {
          ID: item.ID,
          ExpectedEffectiveDateFrom: item.ExpectedEffectiveDateFrom,
          Handler: item.Handler,
          HandlerName: item.HandlerName,
          IsSenttoHostBuyer: item.IsSenttoHostBuyer,
          NotificationDate: item.NotificationDate,
          Porg: item.Porg,
          ResponsibleBuyer: `${item.Porg} ${item.Handler}`,
          ReasonCode: item.ReasonCode,
          RequestIDRef: item.RequestIDRef,
          Section: item.Section,
          SectionDescription: item.SectionDescription,
          SupplierRequestSubitemStatus: item.SupplierRequestSubitemStatus,
          CreatedDate: item.Created,
          CreatedBy: item.Author && item.Author[0] ? item.Author[0].title : "",
          ModifiedDate: item.Modified,
          ModifiedBy: item.Editor && item.Editor[0] ? item.Editor[0].title : "",
        } as ISupplierRequestSubItem;
      });
    } catch (err) {
      Logger.write(
        `${
          CONST.LOG_SOURCE
        } (_getSupplierRequestSubitemList) - ${JSON.stringify(err)}`,
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
export const createSupplierRequestSubitemsAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/createSupplierRequestSubitems`,
  async (forms: ISupplierRequestSubItemFormModel[]): Promise<string[]> => {
    const sp = spfi(getSP());
    const [batchedSP, execute] = sp.batched();
    const list = batchedSP.web.lists.getByTitle(
      CONST.LIST_NAME_SUPPLIERREQUESTSUBITEMS
    );
    const result: any[] = [];
    try {
      forms.forEach(async (form) => {
        const res = await list.items.add(form);
        result.push(res);
      });
      await execute();
      return result.map((item) => item.ID);
    } catch (err) {
      Logger.write(
        `${
          CONST.LOG_SOURCE
        } (_createSupplierRequestSubitems) - ${JSON.stringify(err)}`,
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
export const updateSupplierRequestSubitemsAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/updateSupplierRequestSubitems`,
  async (forms: ISupplierRequestSubItemFormModel[]): Promise<void> => {
    const sp = spfi(getSP());
    const [batchedSP, execute] = sp.batched();
    const list = batchedSP.web.lists.getByTitle(
      CONST.LIST_NAME_SUPPLIERREQUESTSUBITEMS
    );
    try {
      forms.forEach(async (form) => {
        await list.items.getById(+form.ID!).update({
          ID: form.ID,
          Porg: form.Porg,
          Handler: form.Handler,
          Section: form.Section,
          RequestIDRef: form.RequestIDRef,
          SupplierRequestSubitemStatus: form.SupplierRequestSubitemStatus,
        });
      });
      await execute();
    } catch (err) {
      Logger.write(
        `${
          CONST.LOG_SOURCE
        } (_updateSupplierRequestSubitems) - ${JSON.stringify(err)}`,
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
export const deleteSupplierRequestSubitemsAction = createAsyncThunk(
  `${FeatureKey.PRICECHANGE}/deleteSupplierRequestSubitems`,
  async (ids: string[]): Promise<void> => {
    const sp = spfi(getSP());
    const [batchedSP, execute] = sp.batched();
    const list = batchedSP.web.lists.getByTitle(
      CONST.LIST_NAME_SUPPLIERREQUESTSUBITEMS
    );
    try {
      ids.forEach(async (id) => {
        await list.items.getById(+id).delete();
      });
      await execute();
    } catch (err) {
      Logger.write(
        `${
          CONST.LOG_SOURCE
        } (_deleteSupplierRequestSubitems) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      AppInsightsService.aiInstance.trackEvent({
        name: MESSAGE.deleteDataFailed,
        properties: { error: err },
      });
      return Promise.reject(MESSAGE.deleteDataFailed);
    }
  }
);

// 同步操作
export const setCurrentPriceChangeRequestAction = createAction(
  `${FeatureKey.PRICECHANGE}/setCurrentPriceChangeRequest`,
  setCurrentPriceChangeRequest
);

function GetQueryInfo(queryCreteria: ISupplierRequestCreteriaModel): string {
  const creterias: string[] = [];
  if (queryCreteria.HostBuyer) {
    creterias.push(camlContainsText(queryCreteria.HostBuyer, "HostBuyer"));
  }
  if (queryCreteria.ResponsibleBuyer) {
    creterias.push(
      camlContainsText(queryCreteria.ResponsibleBuyer, "ResponsibleBuyer")
    );
  }
  if (
    queryCreteria.SupplierRequestStatus &&
    queryCreteria.SupplierRequestStatus.length
  ) {
    creterias.push(
      camlChoiceMultipleText(
        "SupplierRequestStatus",
        queryCreteria.SupplierRequestStatus
      )
    );
  }
  if (queryCreteria.Parma) {
    creterias.push(camlEqText(queryCreteria.Parma, "Parma"));
  }

  if (queryCreteria.ExpectedEffectiveDateFrom) {
    creterias.push(
      camlGeqDate(queryCreteria.ExpectedEffectiveDateFrom, "Created")
    );
  }
  if (queryCreteria.ExpectedEffectiveDateTo) {
    creterias.push(
      camlLtDate(queryCreteria.ExpectedEffectiveDateTo, "Created")
    );
  }

  return camlAndFinal(creterias);
}
