import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import {
  IRequisitionGrid,
  IRequisitionQueryModel,
} from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";
import {
  camlAndFinal,
  camlChoiceMultipleText,
  camlContainsText,
  camlEqChoice,
  camlEqNumber,
  camlGeqText,
  camlLeqText,
  camlOr,
} from "../../common/camlHelper";

//#region actions
export const getAllRequisitionsAction = createAsyncThunk(
  `${FeatureKey.REQUISITIONS}/getAllRequisitions`,
  async (): Promise<IRequisitionGrid[]> => {
    const sp = spfi(getSP());

    try {
      let items: IRequisitionGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await sp.web.lists
          .getByTitle(CONST.LIST_NAME_REQUISITION)
          .items.select(
            "Title",
            "ID",
            "RequisitionType",
            "Section",
            "Status",
            "PartNumber",
            "Qualifier",
            "MaterialUser",
            "Pproject",
            "RFQNumber",
            "Parma",
            "PartDescription",
            "AnnualQty",
            "OrderQty",
            "RequiredWeek",
            "CreateDate",
            "RequisitionBuyer",
            "Handler",
            "HandlerName",
            "BuyerFullInfo",
            "SectionDescription",
            "Porg"
          )
          .top(5000)
          .skip(pageIndex * 5000)();
        items = items.concat(
          response.map((item) => {
            return {
              ID: item.ID,
              UniqueIdentifier: item.Title,
              IsSelected: false,
              RequisitionType: item.RequisitionType,
              Section: item.Section,
              Status: item.Status,
              PartNumber: item.PartNumber,
              Qualifier: item.Qualifier,
              MaterialUser: item.MaterialUser,
              Project: item.Pproject,
              RequiredWeek: item.RequiredWeek,
              CreateDate: item.CreateDate,
              RfqNo: item.RFQNumber,
              Parma: item.Parma,
              PartDescription: item.PartDescription,
              AnnualQty: item.AnnualQty,
              OrderQty: item.OrderQty,
              ReqBuyer: item.RequisitionBuyer,
              Handler: item.Handler,
              HandlerName: item.HandlerName,
              BuyerFullInfo: item.BuyerFullInfo,
              SectionDescription: item.SectionDescription,
              Porg: item.Porg,
            } as IRequisitionGrid;
          })
        );
        hasNext = response.length === 5000;
        pageIndex += 1;
      }

      return items;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getAllRequisitions) - ${JSON.stringify(err)}`,
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
export const updateRequisitionAction = createAsyncThunk(
  `${FeatureKey.REQUISITIONS}/updateRequisition`,
  async (Requisition: IRequisitionGrid): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .items.getById(+Requisition.ID!)
        .update({
          ID: Requisition.ID,
          Title: Requisition.UniqueIdentifier,
          RequisitionType: Requisition.RequisitionType,
          Section: Requisition.Section,
          Status: Requisition.Status,
          PartNumber: Requisition.PartNumber,
          Qualifier: Requisition.Qualifier,
          MaterialUser: Requisition.MaterialUser,
          Pproject: Requisition.Project,
          RFQNumber: Requisition.RfqNo,
          Parma: Requisition.Parma,
          PartDescription: Requisition.PartDescription,
          AnnualQty: Requisition.AnnualQty,
          OrderQty: Requisition.OrderQty,
          RequiredWeek: Requisition.RequiredWeek,
          CreateDate: Requisition.CreateDate,
          RequisitionBuyer: Requisition.ReqBuyer,
          Handler: Requisition.Handler,
          HandlerName: Requisition.HandlerName,
          BuyerFullInfo: Requisition.BuyerFullInfo,
        });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateRequisition) - ${JSON.stringify(err)}`,
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
export const queryRequisitionsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/queryRequisitions`,
  async (Query: IRequisitionQueryModel): Promise<IRequisitionGrid[]> => {
    const sp = spfi(getSP());
    try {
      const queryXml = GetQueryInfo(Query);
      const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_REQUISITION)
        .renderListDataAsStream({
          ViewXml: `<View>
        <RowLimit Paged="TRUE">200</RowLimit>
        <Query>
        ${queryXml}
        <OrderBy>
          <FieldRef Name="RequiredWeek" Ascending="FALSE" />
        </OrderBy>
        </Query>
        </View>`,
        });
      const result = response.Row.map((item) => {
        return {
          ID: item.ID,
          UniqueIdentifier: item.Title,
          IsSelected: false,
          RequisitionType: item.RequisitionType,
          Section: item.Section,
          Status: item.Status,
          PartNumber: item.PartNumber,
          Qualifier: item.Qualifier,
          MaterialUser: item.MaterialUser,
          Project: item.Pproject,
          RequiredWeek: item.RequiredWeek,
          CreateDate: item.CreateDate,
          RfqNo: item.RFQNumber,
          Parma: item.Parma,
          PartDescription: item.PartDescription,
          AnnualQty: item.AnnualQty,
          OrderQty: item.OrderQty,
          ReqBuyer: item.RequisitionBuyer,
          Handler: item.Handler,
          HandlerName: item.HandlerName,
          BuyerFullInfo: item.BuyerFullInfo,
          SectionDescription: item.SectionDescription,
          Porg: item.Porg,
        } as IRequisitionGrid;
      });
      const sortedResult = result.sort((a, b) => Number(b.ID) - Number(a.ID));
      return sortedResult;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_queryRequisitions) - ${JSON.stringify(err)}`,
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
function GetQueryInfo(queryCreteria: IRequisitionQueryModel): string {
  const creterias: string[] = [];
  if (queryCreteria.RequisitionType) {
    if (queryCreteria.RequisitionType.length > 0) {
      creterias.push(
        camlChoiceMultipleText("RequisitionType", queryCreteria.RequisitionType)
      );
    }
  }
  if (queryCreteria.Buyer) {
    creterias.push(
      camlOr(
        camlContainsText(queryCreteria.Buyer, "RequisitionBuyer"),
        camlContainsText(queryCreteria.Buyer, "HandlerName")
      )
    );
  }
  if (queryCreteria.Parma) {
    creterias.push(camlContainsText(queryCreteria.Parma, "Parma"));
  }
  if (queryCreteria.Section) {
    creterias.push(camlContainsText(queryCreteria.Section, "Section"));
  }
  if (queryCreteria.Status) {
    if (queryCreteria.Status.length > 0) {
      creterias.push(camlChoiceMultipleText("Status", queryCreteria.Status));
    }
  }
  if (queryCreteria.PartNumber) {
    creterias.push(camlContainsText(queryCreteria.PartNumber, "PartNumber"));
  }
  if (queryCreteria.Qualifier) {
    creterias.push(camlEqChoice(queryCreteria.Qualifier, "Qualifier"));
  }
  if (queryCreteria.Project) {
    creterias.push(camlContainsText(queryCreteria.Project, "Pproject"));
  }
  if (queryCreteria.MaterialUser) {
    creterias.push(camlEqNumber(queryCreteria.MaterialUser, "MaterialUser"));
  }
  if (queryCreteria.RFQNumber) {
    creterias.push(camlContainsText(queryCreteria.RFQNumber, "RFQNumber"));
  }
  if (queryCreteria.RequiredWeekFrom) {
    creterias.push(camlGeqText(queryCreteria.RequiredWeekFrom, "RequiredWeek"));
  }
  if (queryCreteria.RequiredWeekTo) {
    creterias.push(camlLeqText(queryCreteria.RequiredWeekTo, "RequiredWeek"));
  }
  if (queryCreteria.CreatedDateFrom) {
    creterias.push(camlGeqText(queryCreteria.CreatedDateFrom, "CreateDate"));
  }
  if (queryCreteria.CreatedDateTo) {
    creterias.push(camlLeqText(queryCreteria.CreatedDateTo, "CreateDate"));
  }
  return camlAndFinal(creterias);
}
//#endregion
