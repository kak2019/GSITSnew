import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import { getSP } from "../../pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";
import { IRequisitionGrid } from "../../model/requisition";
import { AppInsightsService } from "../../config/AppInsightsService";

//#region actions
export const getAllRequisitionsAction = createAsyncThunk(
  `${FeatureKey.REQUISITIONS}/getAllRequisitions`,
  async (): Promise<IRequisitionGrid[]> => {
    const sp = spfi(getSP());
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      let items: IRequisitionGrid[] = [];
      let hasNext = true;
      let pageIndex = 0;
      while (hasNext) {
        const response = await spCache.web.lists
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
    const spCache = sp.using(Caching({ store: "session" }));
    try {
      await spCache.web.lists
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
//#endregion
//#region methods
//#endregion
