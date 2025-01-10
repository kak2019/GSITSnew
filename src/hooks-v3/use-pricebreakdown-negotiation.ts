import { getActionlogs } from "../actions/get-actionlogs";
import { getAttachments } from "../actions/get-attachments";
import { getPartNegotiation } from "../actions/get-part-negotiation";
import { getQuotation } from "../actions/get-quotation";
import { getRFQ } from "../actions/get-rfq";
import { postAttachments } from "../actions/post-attachments";
import { postQuotation } from "../actions/post-quotation";
import { putPartNegotiation } from "../actions/put-part-negotiation";
import { putQuotation } from "../actions/put-quotation";
import {
  IUDGSAttachmentFormModel,
  IUDGSAttachmentGridModel,
} from "../model-v2/udgs-attachment-model";
import { IUDGSCommentModel } from "../model-v2/udgs-comment-model";
import {
  IActionlogCreteriaModel,
  INegotiationPartCreteriaModel,
  IQuotationCreteriaModel,
  IRFQCreteriaModel,
} from "../model-v2/udgs-creteria-model";
import { IUDGSNegotiationPartFormModel } from "../model-v2/udgs-negotiation-model";
import { IUDGSQuotationFormModel } from "../model-v2/udgs-quotation-model";
import {
  IPriceBreakdownInitiateDataModel,
  IPriceBreakdownModifiedModel,
} from "../model-v3/pricebreakdown-negotiation-model";

type UsePriceBreakdownNegotiation = {
  getInitiateData: (
    rfqID: number,
    partID: number,
    quotationID: number
  ) => Promise<IPriceBreakdownInitiateDataModel>;
  saveData: (
    quotationValue: IUDGSQuotationFormModel,
    partValue: IUDGSNegotiationPartFormModel,
    attachmentsValue: IUDGSAttachmentGridModel[],
    removeAttachmentIDs: string[]
  ) => Promise<IPriceBreakdownModifiedModel>;
  postComment: (
    partID: number,
    quotationID: number,
    modified: Date,
    commentValue: IUDGSCommentModel[]
  ) => Promise<IPriceBreakdownModifiedModel>;
};
export function usePriceBreakdownNegotiation(): UsePriceBreakdownNegotiation {
  async function getInitiateData(
    rfqID: number,
    partID: number,
    quotationID: number
  ): Promise<IPriceBreakdownInitiateDataModel> {
    try {
      const rfqValue = await getRFQ({ ID: rfqID } as IRFQCreteriaModel);
      const partValue = await getPartNegotiation({
        ID: partID,
      } as INegotiationPartCreteriaModel);
      const quotationValue = await getQuotation({
        ID: quotationID,
      } as IQuotationCreteriaModel);
      const actionlogValue = await getActionlogs({
        PartID: partID,
      } as IActionlogCreteriaModel);
      const attachmentValue = await getAttachments(
        "Quotation Attachments",
        quotationID.toString(),
        true
      );
      return {
        rfqValue: rfqValue,
        partValue: partValue,
        quotationValue: quotationValue,
        actionlogValue: actionlogValue,
        attachmentValue: attachmentValue,
      } as IPriceBreakdownInitiateDataModel;
    } catch (err) {
      throw new Error(err);
    }
  }
  async function saveData(
    quotationValue: IUDGSQuotationFormModel,
    partValue: IUDGSNegotiationPartFormModel,
    attachmentsValue: IUDGSAttachmentGridModel[],
    removeAttachmentIDs: string[]
  ): Promise<IPriceBreakdownModifiedModel> {
    try {
      let quotationModifiedDate: Date;
      let quotationID: number;
      if (quotationValue.ID !== 0) {
        const spItemQuotation = await getQuotation({
          ID: quotationValue.ID,
        } as IQuotationCreteriaModel);
        if (
          spItemQuotation.Modified.getTime() !==
          quotationValue.Modified?.getTime()
        ) {
          throw new Error("Unmatch Version Detected, Please Refresh the Page");
        }
        quotationID = quotationValue.ID!;
        quotationModifiedDate = await putQuotation(quotationValue);
      } else {
        const newQuotationID = await postQuotation(quotationValue);
        const newQuotation = await getQuotation({
          ID: newQuotationID,
        } as IQuotationCreteriaModel);
        quotationID = newQuotationID;
        quotationModifiedDate = newQuotation.Modified;
      }
      const partModifiedDate = await putPartNegotiation(partValue);
      await postAttachments({
        FolderName: "Quotation Attachments",
        SubFolderName: quotationID.toString(),
        NewFileItems: attachmentsValue
          .filter((x) => !x.URL)
          .map((i) => i.FileItem),
        RemoveFileIDs: removeAttachmentIDs,
      } as IUDGSAttachmentFormModel);
      const attachmentValue = await getAttachments(
        "Quotation Attachments",
        quotationID.toString(),
        true
      );
      return {
        partModifiedDate: partModifiedDate,
        quotationModifiedDate: quotationModifiedDate,
        attachmentValue: attachmentValue,
      } as IPriceBreakdownModifiedModel;
    } catch (err) {
      throw new Error(err);
    }
  }
  async function postComment(
    partID: number,
    quotationID: number,
    modified: Date,
    commentValue: IUDGSCommentModel[]
  ): Promise<IPriceBreakdownModifiedModel> {
    try {
      if (quotationID !== 0) {
        const modifiedDate = await putQuotation({
          ID: quotationID,
          Modified: modified,
          CommentHistory: JSON.stringify(commentValue),
        } as IUDGSQuotationFormModel);
        return {
          partModifiedDate: new Date(),
          quotationModifiedDate: modifiedDate,
          attachmentValue: [],
          quotationID: quotationID,
        } as IPriceBreakdownModifiedModel;
      }
      const newQuotationID = await postQuotation({
        CommentHistory: JSON.stringify(commentValue),
        PartIDRef: partID,
      });
      const newQuotation = await getQuotation({
        ID: newQuotationID,
      } as IQuotationCreteriaModel);
      return {
        partModifiedDate: new Date(),
        quotationModifiedDate: newQuotation.Modified,
        attachmentValue: [],
        quotationID: newQuotationID,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  return {
    getInitiateData,
    saveData,
    postComment,
  };
}
