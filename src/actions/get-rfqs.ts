import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { camlAndFinal, camlChoiceMultipleText } from "../common/camlHelper";
import { getLastCommentBy } from "../common/commonHelper";
import { AppInsightsService } from "../config/AppInsightsService";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IRFQCreteriaModel } from "../model-v2/udgs-creteria-model";
import { IUDGSRFQGridModel } from "../model-v2/udgs-rfq-model";
import { getSP } from "../pnpjsConfig";

export async function getRFQs(
  creteria: IRFQCreteriaModel
): Promise<IUDGSRFQGridModel[]> {
  const sp = spfi(getSP());
  try {
    const response = await sp.web.lists
      .getByTitle(CONST.LIST_NAME_RFQLIST)
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
    const rfqs = response.Row.map((item) => {
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
        Created: item["Created."],
      } as IUDGSRFQGridModel;
    });
    return rfqs;
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_getRFQs) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    AppInsightsService.aiInstance.trackEvent({
      name: MESSAGE.retrieveDataFailed,
      properties: { error: err },
    });
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
}
function getFilterString(creteria: IRFQCreteriaModel): string {
  const creterias: string[] = [];
  if (creteria.RFQStatus) {
    creterias.push(camlChoiceMultipleText("RFQStatus", creteria.RFQStatus));
  }
  return camlAndFinal(creterias);
}
