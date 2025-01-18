import {
  getActionlogs,
  getAttachments,
  getPartNegotiation,
  getQuotation,
  getRFQ,
  postAttachments,
  postQuotation,
  putPartNegotiation,
  putQuotation,
} from "../../../../actions";
import {
  IActionlogCreteriaModel,
  INegotiationPartCreteriaModel,
  IQuotationCreteriaModel,
  IRFQCreteriaModel,
  IUDGSAttachmentFormModel,
  IUDGSAttachmentGridModel,
  IUDGSCommentModel,
  IUDGSNegotiationPartFormModel,
  IUDGSQuotationFormModel,
} from "../../../../model-v2";
import {
  IPriceBreakdownInitiateDataModel,
  IPriceBreakdownModifiedModel,
} from "./IPriceChangePriceBreakDown";

type UsePriceBreakdownNegotiationSP = {
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
export function usePriceBreakdownNegotiationSP(): UsePriceBreakdownNegotiationSP {
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
      const commentHistoryValue = quotationValue.CommentHistory
        ? JSON.parse(quotationValue.CommentHistory).map(
            (item: IUDGSCommentModel) => {
              return {
                ...item,
                CommentDate: new Date(item.CommentDate),
              } as IUDGSCommentModel;
            }
          )
        : [];
      commentHistoryValue.sort((a: IUDGSCommentModel, b: IUDGSCommentModel) => {
        return (
          new Date(b.CommentDate).getTime() - new Date(a.CommentDate).getTime()
        );
      });
      return {
        rfqValue: rfqValue,
        partValue: partValue,
        quotationValue: quotationValue,
        actionlogValue: actionlogValue,
        attachmentValue: attachmentValue,
        commentHistoryValue: commentHistoryValue,
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
    commentHistory: IUDGSCommentModel[]
  ): Promise<IPriceBreakdownModifiedModel> {
    try {
      if (quotationID !== 0) {
        const modifiedDate = await putQuotation({
          ID: quotationID,
          Modified: modified,
          CommentHistory: JSON.stringify(commentHistory),
        } as IUDGSQuotationFormModel);
        return {
          partModifiedDate: new Date(),
          quotationModifiedDate: modifiedDate,
          attachmentValue: [],
          quotationID: quotationID,
        } as IPriceBreakdownModifiedModel;
      }
      const newQuotationID = await postQuotation({
        CommentHistory: JSON.stringify(commentHistory),
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
