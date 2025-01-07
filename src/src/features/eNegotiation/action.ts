/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
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
  IENegotiationRequestCreteriaModel,
  IENegotiationRequestFormModel,
  IENegotiationRequest,
} from "../../model/eNegotiation";

export const getENegotiationRequestListAction = createAsyncThunk(
  `${FeatureKey.ENEGOTIATIONREQUESTS}/getENegotiationRequestList`,
  async (
    Query: IENegotiationRequestCreteriaModel
  ): Promise<IENegotiationRequest[]> => {
    const sp = spfi(getSP());
    try {
      const queryXml = GetQueryInfo(Query);
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ENEGOTIATIONREQUESTS)
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
          SupplierRequestIDRef: item.SupplierRequestIDRef,
          ExpectedEffectiveDateFrom: item.ExpectedEffectiveDateFrom,
          Porg: item.Porg,
          Handler: item.Handler,
          ReasonCode: item.ReasonCode,
          RFQNo: item.RFQNo,
          RFQIDRef: item.RFQIDRef,
          NegotiationNo: item.NegotiationNo,
          Parma: item.Parma,
          RequestID: item.RequestID,
          SupplierContact: item.SupplierContact,
          SupplierName: item.SupplierName,
          Status: item.Status,
          RFQStatus: item.RFQStatus,
          CreatedDate: item.Created,
          CreatedBy: item.Author && item.Author[0] ? item.Author[0].title : "",
          ModifiedDate: item.Modified,
          ModifiedBy: item.Editor && item.Editor[0] ? item.Editor[0].title : "",
        } as IENegotiationRequest;
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getENegotiationRequestList) - ${JSON.stringify(
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
export const getENegotiationRequestAction = createAsyncThunk(
  `${FeatureKey.ENEGOTIATIONREQUESTS}/getENegotiationRequest`,
  async (id: string): Promise<IENegotiationRequest> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ENEGOTIATIONREQUESTS)
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
        SupplierRequestIDRef: response.Row[0].SupplierRequestIDRef,
        ExpectedEffectiveDateFrom: response.Row[0].ExpectedEffectiveDateFrom,
        Porg: response.Row[0].Porg,
        Handler: response.Row[0].Handler,
        ReasonCode: response.Row[0].ReasonCode,
        RFQNo: response.Row[0].RFQNo,
        RFQIDRef: response.Row[0].RFQIDRef,
        NegotiationNo: response.Row[0].NegotiationNo,
        Parma: response.Row[0].Parma,
        RequestID: response.Row[0].RequestID,
        SupplierContact: response.Row[0].SupplierContact,
        SupplierName: response.Row[0].SupplierName,
        Status: response.Row[0].Status,
        RFQStatus: response.Row[0].RFQStatus,
        CreatedDate: response.Row[0].Created,
        CreatedBy:
          response.Row[0].Author && response.Row[0].Author[0]
            ? response.Row[0].Author[0].title
            : "",
        ModifiedDate: response.Row[0].Modified,
        ModifiedBy:
          response.Row[0].Editor && response.Row[0].Editor[0]
            ? response.Row[0].Editor[0].title
            : "",
      } as IENegotiationRequest;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getENegotiationRequest) - ${JSON.stringify(
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
export const createENegotiationRequestAction = createAsyncThunk(
  `${FeatureKey.ENEGOTIATIONREQUESTS}/createENegotiationRequest`,
  async (form: IENegotiationRequestFormModel): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const result = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ENEGOTIATIONREQUESTS)
        .items.add(form);
      return result.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_createENegotiationRequest) - ${JSON.stringify(
          err
        )}`,
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
export const updateENegotiationRequestAction = createAsyncThunk(
  `${FeatureKey.ENEGOTIATIONREQUESTS}/updateENegotiationRequest`,
  async (form: IENegotiationRequestFormModel): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_ENEGOTIATIONREQUESTS)
        .items.getById(+form.ID!)
        .update({
          ID: form.ID,
          Parma: form.Parma,
          SupplierContact: form.SupplierContact,
          ExpectedEffectiveDateFrom: form.ExpectedEffectiveDateFrom,
          ReasonCode: form.ReasonCode,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateENegotiationRequest) - ${JSON.stringify(
          err
        )}`,
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

function GetQueryInfo(
  queryCreteria: IENegotiationRequestCreteriaModel
): string {
  const creterias: string[] = [];
  // 得拆成porg和handler
  if (queryCreteria.Buyer) {
    creterias.push(camlContainsText(queryCreteria.Buyer, "Buyer"));
  }
  if (queryCreteria.Status && queryCreteria.Status.length) {
    creterias.push(camlChoiceMultipleText("Status", queryCreteria.Status));
  }
  if (queryCreteria.RFQNo) {
    creterias.push(camlContainsText(queryCreteria.RFQNo, "RFQ No."));
  }
  if (queryCreteria.SupplierRequestID) {
    creterias.push(
      camlContainsText(
        queryCreteria.SupplierRequestID,
        "Supplier Request ID Ref"
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
