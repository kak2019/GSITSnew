import { createAsyncThunk } from "@reduxjs/toolkit";
import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { CONST, FeatureKey } from "../../config/const";
import { getSP } from "../../pnpjsConfig";
import { MESSAGE } from "../../config/message";
import { AppInsightsService } from "../../config/AppInsightsService";
import {
  camlAndFinal,
  camlChoiceMultipleText,
  camlContainsText,
  camlEqChoice,
  camlEqNumber,
  camlEqText,
  camlGeqDate,
  camlLtDate,
} from "../../common/camlHelper";
import {
  IUDGSRFQCreteriaModel,
  IUDGSRFQFormModel,
  IUDGSRFQGridModel,
} from "../../model-v2/udgs-rfq-model";
import { getLastCommentBy } from "../../common/commonHelper";

//#region actions
export const queryRFQsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/queryRFQs`,
  async (creteria: IUDGSRFQCreteriaModel): Promise<IUDGSRFQGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const queryXml = GetRFQQueryInfo(creteria);
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
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
          Modified: new Date(item["Modified."]),
          BuyerEmail: item.BuyerEmail,
          BuyerInfo: item.BuyerInfo,
          BuyerName: item.BuyerName,
          CommentHistory: item.CommentHistory,
          EffectiveDateBuyer: item.EffectiveDateBuyer,
          EffectiveDateSupplier: item.EffectiveDateSupplier,
          HandlerName: item.HandlerName,
          IsSME: item.IsSME,
          LatestQuoteDate: item.LatestQuoteDate,
          OrderType: item.OrderType,
          Parma: item.Parma,
          QuoteReceivedDate: item.QuoteReceivedDate,
          ReasonOfRFQ: item.ReasonOfRFQ,
          RFQDueDate: item.RFQDueDate,
          RFQInstructionToSupplier: item.RFQInstructionToSupplier,
          RFQNo: item.RFQNo,
          RFQStatus: item.RFQStatus,
          RFQType: item.RFQType,
          SectionInfo: item.SectionInfo,
          SupplierContact: item.SupplierContact,
          SupplierEmail: item.SupplierEmail,
          SupplierName: item.SupplierName,
          LastCommentBy: getLastCommentBy(item.CommentHistory),
          Created: item.Created,
        } as IUDGSRFQGridModel;
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_queryRFQs) - ${JSON.stringify(err)}`,
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
export const getRFQByIDAction = createAsyncThunk(
  `${FeatureKey.RFQS}/getRFQByID`,
  async (rfqID: number): Promise<IUDGSRFQGridModel> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(rfqID, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const rfq = {
        ID: response.Row[0].ID,
        Modified: new Date(response.Row[0]["Modified."]),
        BuyerEmail: response.Row[0].BuyerEmail,
        BuyerInfo: response.Row[0].BuyerInfo,
        BuyerName: response.Row[0].BuyerName,
        CommentHistory: response.Row[0].CommentHistory,
        EffectiveDateBuyer: response.Row[0].EffectiveDateBuyer,
        EffectiveDateSupplier: response.Row[0].EffectiveDateSupplier,
        HandlerName: response.Row[0].HandlerName,
        IsSME: response.Row[0].IsSME,
        LatestQuoteDate: response.Row[0].LatestQuoteDate,
        OrderType: response.Row[0].OrderType,
        Parma: response.Row[0].Parma,
        QuoteReceivedDate: response.Row[0].QuoteReceivedDate,
        ReasonOfRFQ: response.Row[0].ReasonOfRFQ,
        RFQDueDate: response.Row[0].RFQDueDate,
        RFQInstructionToSupplier: response.Row[0].RFQInstructionToSupplier,
        RFQNo: response.Row[0].RFQNo,
        RFQStatus: response.Row[0].RFQStatus,
        RFQType: response.Row[0].RFQType,
        SectionInfo: response.Row[0].SectionInfo,
        SupplierContact: response.Row[0].SupplierContact,
        SupplierEmail: response.Row[0].SupplierEmail,
        SupplierName: response.Row[0].SupplierName,
        LastCommentBy: getLastCommentBy(response.Row[0].CommentHistory),
        Created: response.Row[0]["Created."],
      } as IUDGSRFQGridModel;
      return rfq;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getRFQ) - ${JSON.stringify(err)}`,
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
export const postRFQAction = createAsyncThunk(
  `${FeatureKey.RFQS}/postRFQ`,
  async (rfq: IUDGSRFQFormModel): Promise<number> => {
    const sp = spfi(getSP());
    try {
      const addItemResult = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
        .items.add(rfq);
      return addItemResult.ID;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_postRFQ) - ${JSON.stringify(err)}`,
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
export const putRFQAction = createAsyncThunk(
  `${FeatureKey.RFQS}/putRFQ`,
  async (rfq: IUDGSRFQFormModel): Promise<string> => {
    const sp = spfi(getSP());
    try {
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
        .renderListDataAsStream({
          ViewXml: `<View>
        <Query>
        <Where>
        ${camlEqNumber(rfq.ID!, "ID")}
        </Where>
        <OrderBy>
          <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const spModified = new Date(response.Row[0]["Modified."]);
      const itemModified = new Date(rfq.Modified!);
      if (spModified.getTime() !== itemModified.getTime()) {
        Logger.write(
          `${CONST.LOG_SOURCE} (_putRFQ) - ${JSON.stringify(
            "Item Version Unmatch"
          )}`,
          LogLevel.Error
        );
        AppInsightsService.aiInstance.trackEvent({
          name: MESSAGE.updateDataFailed,
          properties: { error: "Item Version Unmatch" },
        });
        return Promise.reject(MESSAGE.updateDataFailed);
      }
      const result = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_RFQLIST)
        .items.getById(rfq.ID!)
        .update(rfq)
        .then(async () => {
          const responseTemp = await sp.web.lists
            .getByTitle(CONST.LIST_NAME_RFQ)
            .items.getById(rfq.ID!)();
          return new Date(responseTemp.Modified).toISOString();
        });
      return result;
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
);
//#endregion
//#region methods
function GetRFQQueryInfo(queryCreteria: IUDGSRFQCreteriaModel): string {
  const creterias: string[] = [];
  if (queryCreteria.RFQType) {
    if (queryCreteria.RFQType.length > 0) {
      creterias.push(camlEqChoice(queryCreteria.RFQType, "RFQType"));
    }
  }
  if (queryCreteria.RFQNo) {
    creterias.push(camlContainsText(queryCreteria.RFQNo, "RFQNo"));
  }
  if (queryCreteria.Buyer) {
    creterias.push(camlContainsText(queryCreteria.Buyer, "BuyerInfo"));
  }
  if (queryCreteria.Section) {
    creterias.push(camlContainsText(queryCreteria.Section, "SectionInfo"));
  }
  if (queryCreteria.Status) {
    if (queryCreteria.Status.length > 0) {
      creterias.push(camlChoiceMultipleText("RFQStatus", queryCreteria.Status));
    }
  }
  if (queryCreteria.ParmaAccurate) {
    creterias.push(camlEqText(queryCreteria.ParmaAccurate, "Parma"));
  }
  if (queryCreteria.ParmaBlur) {
    creterias.push(camlContainsText(queryCreteria.ParmaBlur, "Parma"));
  }
  if (queryCreteria.RFQReleaseDateFrom) {
    creterias.push(camlGeqDate(queryCreteria.RFQReleaseDateFrom, "Created"));
  }
  if (queryCreteria.RFQReleaseDateTo) {
    creterias.push(camlLtDate(queryCreteria.RFQReleaseDateTo, "Created"));
  }
  if (queryCreteria.RFQDueDateFrom) {
    creterias.push(camlGeqDate(queryCreteria.RFQDueDateFrom, "RFQDueDate"));
  }
  if (queryCreteria.RFQDueDateTo) {
    creterias.push(camlLtDate(queryCreteria.RFQDueDateTo, "RFQDueDate"));
  }
  return camlAndFinal(creterias);
}
//#endregion
