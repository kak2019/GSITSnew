import { Logger, LogLevel } from "@pnp/logging";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { spfi } from "@pnp/sp";
import { getSP } from "../pnpjsConfig";
import { INegotiationPartCreteriaModel } from "../model-v2/udgs-creteria-model";
import { IUDGSNegotiationPartGridModel } from "../model-v2/udgs-negotiation-model";
import { camlAndFinal, camlEqNumber, camlEqText } from "../common/camlHelper";

export async function getPartNegotiation(
  creteria: INegotiationPartCreteriaModel
): Promise<IUDGSNegotiationPartGridModel[]> {
  try {
    const sp = spfi(getSP());
    const response = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_PART)
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
    const parts = response.Row.map((item) => {
      return {
        ID: item.ID,
        Modified: new Date(item["Modified."]),
        BuyerBasePrice: Number(item["BuyerBasePrice."]),
        BuyerName: item.BuyerName,
        CreateDate: new Date(item["CreateDate."]),
        Currency: item.Currency,
        CurrentBasePrice: Number(item["CurrentBasePrice."]),
        ForecastQuantity: Number(item["ForecastQuantity."]),
        MaterialUser: Number(item["MaterialUser."]),
        MaterialUserName: item.MaterialUserName,
        NegotiationBuyer: item.NegotiationBuyer,
        NegotiationRefNo: item.NegotiationRefNo,
        NegotiationUopDetailNbr: Number(item["NegotiationUopDetailNbr."]),
        Parma: item.Parma,
        PartDescription: item.PartDescription,
        PartNumber: item.PartNumber,
        Porg: item.Porg,
        Qualifier: item.Qualifier,
        RequisitionBuyer: item.RequisitionBuyer,
        RFQIDRef: Number(item["RFQIDRef."]),
        RFQNo: item.RFQNo,
        SupplierBasePrice: Number(item["SupplierBasePrice."]),
        SupplierName: item.SupplierName,
        SupplierPartNumber: item.SupplierPartNumber,
        SystemPartID: item.SystemPartID,
        //Unit: Number(item["Unit."]),
        Unit: item.Unit,
        Ver: Number(item["Ver."]),
        Handler:item.Handler
      } as IUDGSNegotiationPartGridModel;
    });
    return parts;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_getNegotiationPart) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.retrieveDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
}
function getFilterString(creteria: INegotiationPartCreteriaModel): string {
  if (creteria.ID) {
    return camlAndFinal([camlEqNumber(creteria.ID, "ID")]);
  }
  if (creteria.NegotiationRefNo) {
    return camlAndFinal([
      camlEqText(creteria.NegotiationRefNo, "NegotiationRefNo"),
    ]);
  }
  if (creteria.RfqID) {
    return camlAndFinal([
      camlEqNumber(creteria.RfqID, "RFQIDRef"),
    ]);
  }
  return "";
}
