import React, { useContext, useEffect } from "react";
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  Icon,
  IconButton,
  IDetailsRowProps,
  IDropdownOption,
  Link,
  PrimaryButton,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
  TooltipHost,
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import "./index.css";
import {
  AutoSumQuotedBasicUnitPriceTtlFields,
  AutoSumQuotedUnitPriceTtlFields,
  basicInfo,
  decimalRegex,
  NumberValidationFields,
  generalInfoEdit,
  generalInfoView,
  IActionLogColumn,
  IDialogListColumn,
  IDialogValue,
  IMasterData,
  ITextFieldRowPriceBreakdown,
  MandatoryValidationFieldsOne,
  MandatoryValidationFieldsTwo,
  NonDoubleBytesValidationFields,
  quoteBreakdownInfoEdit,
  quoteBreakdownInfoView,
} from "./IPriceBreakDown";
import { useLocation, useNavigate } from "react-router-dom";
import { useUDGSRFQ } from "../../../../hooks-v2/use-udgs-rfq";
import { IUDGSRFQGridModel } from "../../../../model-v2/udgs-rfq-model";
import {
  deepCopy,
  getDecimalPlace,
  isDoubleByte,
  parseNumberOptional,
  parseDateFormat,
} from "../../../../common/commonHelper";
import {
  IUDGSQuotationFormModel,
  IUDGSQuotationGridModel,
} from "../../../../model-v2/udgs-quotation-model";
import { IUDGSAttachmentGridModel } from "../../../../model-v2/udgs-attachment-model";
import { useUDGSActionlog } from "../../../../hooks-v2/use-udgs-actionlog";
import { useUDGSAttachment } from "../../../../hooks-v2/use-udgs-attachment";
import { useUDGSPart } from "../../../../hooks-v2/use-udgs-part";
import { useUDGSQuotation } from "../../../../hooks-v2/use-udgs-quotation";
import {
  IUDGSAcceptReturnModel,
  IUDGSNewPartGridModel,
} from "../../../../model-v2/udgs-part-model";
import { priceBreakdownStyles } from "../../../../config/theme";
import { IUDGSCommentModel } from "../../../../model-v2/udgs-comment-model";
import { IUDGSActionlogFormModel } from "../../../../model-v2/udgs-actionlog-model";
import AppContext from "../../../../AppContext";

const PriceBreakDown: React.FC = () => {
  //#region hooks
  const [
    ,
    errorMessageActionlog,
    currentActionlogs,
    getActionlogsByPartID,
    ,
    postActionlog,
  ] = useUDGSActionlog();
  const [, errorMessageAttachment, , getAttachmentsUDGS, postAttachments] =
    useUDGSAttachment();
  const [, errorMessagePart, , , , , , getPartByID, , putPart, acceptReturn] =
    useUDGSPart();
  const [
    ,
    errorMessageQuotation,
    currentQuotation,
    getQuotationByID,
    ,
    postQuotation,
    putQuotation,
  ] = useUDGSQuotation();
  const [, errorMessageRFQ, , , , getRFQByID, , putRFQ] = useUDGSRFQ();
  //#endregion
  //#region properties
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const location = useLocation();
  const masterData: IMasterData = location.state;
  // console.log(location.state);
  // const masterData: IMasterData = {
  //   role: "Supplier",
  //   rfqID: 2,
  //   partID: 3,
  //   quotationID: 17,
  //   supplierId: "111",
  //   userName: "Rodger Ruan",
  //   userEmail: "rodger.ruan@udtrucks.com",
  //   isSME: true,
  //   countryCode: "CN",
  // };
  const navigate = useNavigate();
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const orderQtyEditableType = [
    "SAPP Standalone Prototype Order",
    "SAPR Standalone Production Order",
    "QUPR Quantity Production Order",
  ];
  const [isDirty, setIsDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    IsOpen: false,
    Title: "",
    Tip: "",
    ActionType: "Close",
  } as IDialogValue);
  const [partValue, setPartValue] = React.useState({} as IUDGSNewPartGridModel);
  const [quotationValue, setQuotationValue] = React.useState(
    {} as IUDGSQuotationGridModel
  );
  const [quotationCommentValue, setQuotationCommentValue] = React.useState("");
  const [dialogCommentValue, setDialogCommentValue] = React.useState("");
  const [commentHistoryValue, setCommentHistoryValue] = React.useState(
    [] as IUDGSCommentModel[]
  );
  const [rfqValue, setRFQValue] = React.useState({} as IUDGSRFQGridModel);
  const [attachmentsValue, setAttachmentsValue] = React.useState(
    [] as IUDGSAttachmentGridModel[]
  );
  const [removedAttachmentIdsValue, setRemovedAttachmentIdsValue] =
    React.useState([] as string[]);
  const [generalInfoEditValue, setGeneralInfoEditValue] = React.useState(
    generalInfoEdit(true)
  );
  const [quoteBreakdownInfoEditValue, setQuoteBreakdownInfoEditValue] =
    React.useState(quoteBreakdownInfoEdit(masterData));
  const [partQuotationValue, setPartQuotationValue] = React.useState({});
  //#endregion
  //#region events
  useEffect(() => {
    const dataInitialLoad = async (): Promise<void> => {
      try {
        setIsLoading(true);
        await getActionlogsByPartID(masterData.partID);
        const initialPartValue = deepCopy(await getPartByID(masterData.partID));
        const initialRFQValue = deepCopy(await getRFQByID(masterData.rfqID));
        let initialQuotationValue: IUDGSQuotationGridModel;
        let initialAttachmentsValue: IUDGSAttachmentGridModel[] = [];
        if (masterData.quotationID === 0) {
          initialQuotationValue = {
            ID: 0,
            Modified: new Date(),
            PriceType: "",
            QuotedUnitPriceTtl: "",
            Currency: "",
            UOP: initialPartValue.UOM,
            EffectiveDate: new Date(),
            CommentHistory: "",
            StandardOrderText1: "",
            StandardOrderText2: "",
            StandardOrderText3: "",
            FreePartText: "",
            NamedPlace: masterData.supplierId ?? "",
            NamedPlaceDescription: "",
            CountryOfOrigin: masterData.countryCode ?? "",
            OrderCoverageTime: 1,
            FirstLot: initialPartValue.RequiredWeek.toString().substring(2, 6),
            SupplierPartNumber: "",
            QuotedToolingPriceTtl: "",
            QuotedOneTimePaymentTtl: "",
            MaterialsCostsTtl: "",
            PurchasedPartsCostsTtl: "",
            ProcessingCostsTtl: "",
            ToolingJigDeprCostTtl: "",
            AdminExpProfit: "",
            Other: "",
            QuotedBasicUnitPriceTtl: "",
            PaidProvPartsCost: "",
            SuppliedMtrCost: "",
            PackingAndDistributionCosts: "",
            SurfaceTreatmentCode: "0",
            OrderPriceStatusCode: "",
            OrderNumber: "",
          } as IUDGSQuotationGridModel;
        } else {
          initialQuotationValue = deepCopy(
            await getQuotationByID(masterData.quotationID)
          );
          initialAttachmentsValue = await getAttachmentsUDGS({
            FolderName: "Quotation Attachments",
            SubFolderName: masterData.quotationID.toString(),
            IsDataNeeded: true,
          });
        }
        const isEditableValue =
          masterData.role === "Supplier" &&
          initialPartValue.PartStatus !== "Closed" &&
          initialPartValue.PartStatus !== "Quoted" &&
          initialPartValue.PartStatus !== "Sent to GPS" &&
          initialPartValue.PartStatus !== "Accepted";
        setIsEditable(isEditableValue);
        const isEmptyObject =
          Object.keys(currentQuotation).length === 0 &&
          currentQuotation.constructor === Object;
        if (!isEmptyObject && isEditableValue) {
          if (
            initialRFQValue.OrderType === "BLPR Blanket Production Order" &&
            !initialPartValue.AnnualQty
          ) {
            initialPartValue.OrderQty = Number.NaN;
            initialPartValue.AnnualQty =
              initialPartValue.RequisitionType === "RB"
                ? initialPartValue.OrderQty
                : initialPartValue.AnnualQty;
          }
          setGeneralInfoEditValue(
            generalInfoEdit(
              orderQtyEditableType.indexOf(initialRFQValue.OrderType) === -1
            )
          );
          initialQuotationValue.UOP = currentQuotation.UOP
            ? currentQuotation.UOP
            : initialPartValue.UOM;
          initialQuotationValue.NamedPlace = currentQuotation.NamedPlace
            ? currentQuotation.NamedPlace
            : masterData.supplierId ?? "";
          initialQuotationValue.SurfaceTreatmentCode =
            currentQuotation.SurfaceTreatmentCode
              ? currentQuotation.SurfaceTreatmentCode
              : "0";
          initialQuotationValue.CountryOfOrigin =
            currentQuotation.CountryOfOrigin
              ? currentQuotation.CountryOfOrigin
              : masterData.countryCode ?? "";
          initialQuotationValue.OrderCoverageTime =
            currentQuotation.OrderCoverageTime
              ? currentQuotation.OrderCoverageTime
              : 1;
          initialQuotationValue.FirstLot = currentQuotation.FirstLot
            ? currentQuotation.FirstLot
            : initialPartValue.RequiredWeek.toString().substring(2, 6);
        }
        setQuotationValue(initialQuotationValue);
        setPartValue(initialPartValue);
        setRFQValue(initialRFQValue);
        setAttachmentsValue(initialAttachmentsValue);
        setCommentHistoryValue(
          initialQuotationValue.CommentHistory
            ? JSON.parse(initialQuotationValue.CommentHistory).map(
                (item: IUDGSCommentModel) => {
                  return {
                    ...item,
                    CommentDate: new Date(item.CommentDate),
                  } as IUDGSCommentModel;
                }
              )
            : []
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    dataInitialLoad().catch((error) => {
      console.log(error);
    });
  }, []);
  useEffect(() => {
    console.log("Error");
  }, [
    errorMessageActionlog,
    errorMessageAttachment,
    errorMessagePart,
    errorMessageQuotation,
    errorMessageRFQ,
  ]);
  const onChangeTextField = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof IUDGSQuotationGridModel,
    dataSource: "Part" | "RFQ" | "Quotation",
    newValue?: string
  ): void => {
    fieldUpdate(fieldName, dataSource, newValue);
  };
  const onChangeDropDown = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption,
    fieldName: keyof IUDGSQuotationGridModel,
    dataSource: "Part" | "RFQ" | "Quotation"
  ): void => {
    fieldUpdate(fieldName, dataSource, item.key as string);
  };
  const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_SIZE) {
          setDialogValue({
            IsOpen: true,
            Title: t("Warning"),
            Tip: t("File size exceed limit, single file size limit: 10MB"),
            ActionType: "Message",
          });
          return;
        }
      }
      const newAttachments = Array.from(files).map(
        (file) =>
          ({
            FileItem: file,
            FileID: "",
            URL: "",
            Name: file.name,
          } as IUDGSAttachmentGridModel)
      );
      const currentAttachments = [...attachmentsValue];
      newAttachments.forEach((newAttachment) => {
        currentAttachments.push(newAttachment);
      });
      setAttachmentsValue(currentAttachments);
    }
    setIsDirty(true);
  };
  const onDownLoadFile = (downloadFile: File): void => {
    const url = URL.createObjectURL(downloadFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const onRemoveFile = (
    fileToRemove: IUDGSAttachmentGridModel,
    index: number
  ): void => {
    if (!!fileToRemove.FileID) {
      const attachmentsToBeRemovedValueDup = deepCopy(
        removedAttachmentIdsValue
      );
      attachmentsToBeRemovedValueDup.push(fileToRemove.FileID);
      setRemovedAttachmentIdsValue(attachmentsToBeRemovedValueDup);
    }
    const attachmentsValueDup = [...attachmentsValue];
    attachmentsValueDup.splice(index, 1);
    setAttachmentsValue(attachmentsValueDup);
  };
  const onChangeQuotationComment = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    setQuotationCommentValue(newValue ?? "");
    setIsDirty(true);
  };
  const onPostComment = async (): Promise<void> => {
    if (quotationCommentValue) {
      const commentHistoryValueDup = deepCopy(commentHistoryValue);
      commentHistoryValueDup.push({
        CommentDate: new Date(),
        CommentBy: masterData.userName ?? "",
        CommentText: quotationCommentValue,
        CommentType: "Common",
      } as IUDGSCommentModel);
      setCommentHistoryValue(commentHistoryValueDup);
      if (quotationValue.ID === 0) {
        const QuotationID = await postQuotation({
          ID: quotationValue.ID,
          Modified: quotationValue.Modified,
          CommentHistory: JSON.stringify(commentHistoryValueDup),
          PartIDRef: partValue.ID,
        });
        const newQuotation = await getQuotationByID(QuotationID);
        const quotationValueDup = deepCopy(quotationValue);
        quotationValueDup.Modified = newQuotation.Modified;
        quotationValueDup.ID = newQuotation.ID;
        setQuotationValue(quotationValueDup);
      } else {
        const newModified = await putQuotation({
          ID: quotationValue.ID,
          Modified: quotationValue.Modified,
          CommentHistory: JSON.stringify(commentHistoryValueDup),
        });
        const quotationValueDup = deepCopy(quotationValue);
        quotationValueDup.Modified = newModified;
        setQuotationValue(quotationValueDup);
      }
      setQuotationCommentValue("");
    }
    return;
  };
  const onClickBackBtn = (): void => {
    if (isDirty) {
      setDialogValue({
        IsOpen: true,
        Title: t("Leave without saving?"),
        Tip: t("You'll lose the changes and all progress you have made"),
        ActionType: "Cancel",
      });
      return;
    }
    handleReturn();
  };
  const onClickSaveBtn = async (): Promise<void> => {
    await save("Draft").then(async () => {
      setDialogValue({
        IsOpen: true,
        Title: t("Submit Success"),
        Tip: t("The update is saved successfully"),
        ActionType: "Message",
      });
    });
    setIsLoading(false);
  };
  const onClickSubmitBtn = async (): Promise<void> => {
    const validateResult = validate();
    if (validateResult) {
      await save("Quoted")
        .then(async () => {
          await postActionlog({
            User: masterData.userEmail,
            Date: new Date(),
            LogType: "Submit Quote",
            PartIDRef: partValue.ID,
            RFQIDRef: rfqValue.ID,
          } as IUDGSActionlogFormModel);
          setIsEditable(false);
          setDialogValue({
            IsOpen: true,
            Title: t("Submit Success"),
            Tip: t(
              "The price is submitted successfully. Notification will be sent to UD Buyer."
            ),
            ActionType: "Message",
          });
        })
        .catch((err) => {
          setDialogValue({
            IsOpen: true,
            Title: t("Error"),
            Tip: err,
            ActionType: "Message",
          });
        });
      await getActionlogsByPartID(partValue.ID);
      setIsLoading(false);
    }
  };
  const onClickAcceptBtn = (): void => {
    const partValueDup = deepCopy(partValue);
    setPartQuotationValue({
      ...partValueDup,
      QuotedUnitPriceTtl: quotationValue.QuotedUnitPriceTtl,
    });
    setDialogValue({
      IsOpen: true,
      Title: t("Accept Parts"),
      Tip: t(
        "Reminder: After accepting a part, please click “Proceed to PO creation: to post the order back to GPS"
      ),
      ActionType: "Accepted",
    });
  };
  const onClickReturnBtn = (): void => {
    const partValueDup = deepCopy(partValue);
    setPartQuotationValue({
      ...partValueDup,
      QuotedUnitPriceTtl: quotationValue.QuotedUnitPriceTtl,
    });
    setDialogValue({
      IsOpen: true,
      Title: t("Return Parts"),
      Tip: t(
        "Reminder: The parts will be returned to the supplier to revise and re-submit"
      ),
      ActionType: "Returned",
    });
  };
  const onDialogCommentChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    setDialogCommentValue(newValue ?? "");
  };
  const onDialogClose = (): void => {
    setDialogValue({
      IsOpen: false,
      Title: "",
      Tip: "",
      ActionType: "Close",
    });
    setDialogCommentValue("");
  };
  const onDialogConfirm = async (): Promise<void> => {
    if (
      dialogValue.ActionType === "Accepted" ||
      dialogValue.ActionType === "Returned"
    ) {
      const commentHistoryValueDup = deepCopy(commentHistoryValue);
      if (dialogValue.ActionType === "Returned") {
        commentHistoryValueDup.push({
          CommentDate: new Date(),
          CommentBy: masterData.userName ?? "",
          CommentText: dialogCommentValue,
          CommentType: "Returned",
        } as IUDGSCommentModel);
        setCommentHistoryValue(commentHistoryValueDup);
      }
      await acceptReturn([
        {
          Action: dialogValue.ActionType,
          PartID: partValue.ID,
          QuotationID: quotationValue.ID,
          QuotationModified: quotationValue.Modified,
          Comment: {
            CommentDate: new Date(),
            CommentBy: masterData.userName ?? "",
            CommentText: dialogCommentValue,
            CommentType: dialogValue.ActionType,
          } as IUDGSCommentModel,
        } as IUDGSAcceptReturnModel,
      ]);
      await postActionlog({
        User: masterData.userEmail,
        Date: new Date(),
        LogType:
          dialogValue.ActionType === "Accepted"
            ? "Accept Quote"
            : "Return Quote",
        PartIDRef: partValue.ID,
        RFQIDRef: rfqValue.ID,
      } as IUDGSActionlogFormModel);
      const newStatus = (await getPartByID(partValue.ID)).PartStatus;
      const partValueDup = deepCopy(partValue);
      partValueDup.PartStatus = newStatus;
      await getActionlogsByPartID(partValue.ID);
      setPartValue(partValueDup);
      onDialogClose();
    } else if (dialogValue.ActionType === "Cancel") {
      onDialogClose();
      handleReturn();
    }
  };
  //#endregion
  //#region fields
  const listRowRender = (
    props: IDetailsRowProps | undefined
  ): JSX.Element | null => {
    if (props) {
      return (
        <DetailsRow
          {...props}
          styles={{
            root: {
              background: props.itemIndex % 2 === 0 ? "#f6f6f6" : "#fff",
              border: "1px solid #ccc",
            },
          }}
        />
      );
    }
    return null;
  };
  const formRender = (
    fields: ITextFieldRowPriceBreakdown[],
    readOnly: boolean
  ): JSX.Element | null => {
    return (
      <>
        {fields.map((rowData, rowIndex) => {
          return (
            <Stack
              key={rowIndex}
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
              className={
                rowData.IsLastRow ? "stackHorizontalLastRow" : "stackHorizontal"
              }
            >
              {rowData.Fields.map((fieldData, fieldIndex) => {
                return (
                  <Stack.Item grow key={fieldIndex} className="flexBasisZero">
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      horizontalAlign={fieldData.Align}
                    >
                      <div className="labelItem">
                        {fieldData.Label === "Blank" ? (
                          <>
                            <Text variant="small" className="label">
                              {""}
                            </Text>
                            <Text variant="small" className="labelValue">
                              {}
                            </Text>
                          </>
                        ) : (
                          <>
                            <div className="displayFlex">
                              <Text
                                variant="small"
                                className={readOnly ? "label" : undefined}
                              >
                                {t(fieldData.Label!)}
                              </Text>
                              {fieldData.ShowMandatoryIcon && (
                                <span className="labelRed">{"*"}</span>
                              )}
                              {fieldData.AdditionalIcon && (
                                <TooltipHost
                                  content={fieldData.Label}
                                  id={fieldData.Key}
                                >
                                  <Icon
                                    iconName="Info"
                                    styles={priceBreakdownStyles.icon}
                                  />
                                </TooltipHost>
                              )}
                            </div>
                            {readOnly && (
                              <>
                                {fieldData.IsDate ? (
                                  <Text variant="small" className="labelValue">
                                    {fieldData.DataSource === "Part"
                                      ? partValue[
                                          fieldData.Key as keyof IUDGSNewPartGridModel
                                        ] ?? ""
                                      : fieldData.DataSource === "Quotation"
                                      ? quotationValue[
                                          fieldData.Key as keyof IUDGSQuotationGridModel
                                        ] ?? ""
                                      : fieldData.DataSource === "RFQ"
                                      ? rfqValue[
                                          fieldData.Key as keyof IUDGSRFQGridModel
                                        ]
                                        ? parseDateFormat(
                                            rfqValue[
                                              fieldData.Key as keyof IUDGSRFQGridModel
                                            ] as Date
                                          )
                                        : ""
                                      : ""}
                                  </Text>
                                ) : (
                                  <Text variant="small" className="labelValue">
                                    {fieldData.DataSource === "Part"
                                      ? partValue[
                                          fieldData.Key as keyof IUDGSNewPartGridModel
                                        ] ?? ""
                                      : fieldData.DataSource === "Quotation"
                                      ? quotationValue[
                                          fieldData.Key as keyof IUDGSQuotationGridModel
                                        ] ?? ""
                                      : fieldData.DataSource === "RFQ"
                                      ? rfqValue[
                                          fieldData.Key as keyof IUDGSRFQGridModel
                                        ] ?? ""
                                      : ""}
                                  </Text>
                                )}
                              </>
                            )}
                            {!readOnly && (
                              <>
                                {fieldData.Key === "OrderCoverageTime" ? (
                                  <div className="displayFlex">
                                    <TextField
                                      styles={
                                        priceBreakdownStyles.textFieldShort
                                      }
                                      type="number"
                                      value={quotationValue.OrderCoverageTime?.toString()}
                                      onWheel={(event) => {
                                        event.currentTarget.blur();
                                      }}
                                      onChange={(event, newValue) =>
                                        onChangeTextField(
                                          event,
                                          fieldData.Key! as keyof IUDGSQuotationGridModel,
                                          fieldData.DataSource!,
                                          newValue
                                        )
                                      }
                                      max={99}
                                      min={1}
                                      errorMessage={
                                        fieldData.ErrorMessage ?? undefined
                                      }
                                    />
                                    <span className="labelUnit">
                                      {t("Weeks")}
                                    </span>
                                  </div>
                                ) : fieldData.FieldType === "Text" ? (
                                  <TextField
                                    styles={priceBreakdownStyles.textField}
                                    value={quotationValue[
                                      fieldData.Key! as keyof IUDGSQuotationGridModel
                                    ]?.toString()}
                                    onChange={(event, newValue) =>
                                      onChangeTextField(
                                        event,
                                        fieldData.Key! as keyof IUDGSQuotationGridModel,
                                        fieldData.DataSource!,
                                        newValue
                                      )
                                    }
                                    errorMessage={
                                      fieldData.ErrorMessage ?? undefined
                                    }
                                  />
                                ) : fieldData.FieldType === "Number" ? (
                                  <TextField
                                    type="number"
                                    styles={priceBreakdownStyles.textField}
                                    value={
                                      fieldData.DataSource === "Quotation"
                                        ? quotationValue[
                                            fieldData.Key! as keyof IUDGSQuotationGridModel
                                          ]?.toString()
                                        : partValue[
                                            fieldData.Key! as keyof IUDGSNewPartGridModel
                                          ]?.toString()
                                    }
                                    onChange={(event, newValue) =>
                                      onChangeTextField(
                                        event,
                                        fieldData.Key! as keyof IUDGSQuotationGridModel,
                                        fieldData.DataSource!,
                                        newValue ?? ""
                                      )
                                    }
                                    errorMessage={
                                      fieldData.ErrorMessage ?? undefined
                                    }
                                    onWheel={(event) => {
                                      event.currentTarget.blur();
                                    }}
                                    disabled={fieldData.ReadOnly}
                                  />
                                ) : (
                                  fieldData.FieldType === "Choice" && (
                                    <Dropdown
                                      defaultSelectedKey={quotationValue[
                                        fieldData.Key! as keyof IUDGSQuotationGridModel
                                      ].toString()}
                                      options={fieldData.Choice!}
                                      styles={priceBreakdownStyles.dropdown}
                                      onChange={(event, item) =>
                                        onChangeDropDown(
                                          event,
                                          item!,
                                          fieldData.Key! as keyof IUDGSQuotationGridModel,
                                          fieldData.DataSource!
                                        )
                                      }
                                      errorMessage={
                                        fieldData.ErrorMessage ?? undefined
                                      }
                                    />
                                  )
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </Stack>
                  </Stack.Item>
                );
              })}
            </Stack>
          );
        })}
      </>
    );
  };
  //#endregion
  //#region methods
  function getDecimalFactor(
    NewValue: IUDGSQuotationGridModel,
    Field: "QBUPT" | "QUPT"
  ): number {
    let decimalPlaces: number[] = [];
    if (Field === "QBUPT") {
      decimalPlaces = AutoSumQuotedBasicUnitPriceTtlFields.map((field) =>
        getDecimalPlace(NewValue[field].toString())
      );
    }
    if (Field === "QUPT") {
      decimalPlaces = AutoSumQuotedUnitPriceTtlFields.map((field) =>
        getDecimalPlace(NewValue[field].toString())
      );
    }
    if (decimalPlaces.length > 0) {
      return 10 ** Math.max(...decimalPlaces);
    }
    return 1;
  }
  function calculateField(
    newValue: IUDGSQuotationGridModel,
    fieldName: keyof IUDGSQuotationGridModel,
    factor: number
  ): number {
    return newValue[fieldName] ? Number(newValue[fieldName]) * factor : 0;
  }
  function fieldUpdate(
    fieldName: keyof IUDGSQuotationGridModel | keyof IUDGSNewPartGridModel,
    dataSource: "Part" | "Quotation" | "RFQ",
    newValue?: string
  ): void {
    const generalInfoEditValueDup = deepCopy(generalInfoEditValue);
    generalInfoEditValueDup[2].Fields[0].ErrorMessage = "";
    if (
      fieldName === "OrderCoverageTime" &&
      (Number(newValue) > 99 || Number(newValue) < 1) &&
      !!newValue
    ) {
      newValue = "1";
      generalInfoEditValueDup[2].Fields[0].ErrorMessage =
        "Value must be within 1 to 99";
    }
    if (
      NumberValidationFields.filter((i) => i.Field === fieldName).length > 0
    ) {
      const fieldData = NumberValidationFields.filter(
        (i) => i.Field === fieldName
      )[0];
      const quoteBreakdownInfoEditValueDup = deepCopy(
        quoteBreakdownInfoEditValue
      );
      quoteBreakdownInfoEditValueDup[fieldData.RowIndex].Fields[
        fieldData.ColumnIndex
      ].ErrorMessage = "";
      if (Number(newValue) < 0 && !!newValue) {
        quoteBreakdownInfoEditValueDup[fieldData.RowIndex].Fields[
          fieldData.ColumnIndex
        ].ErrorMessage = "Negative values are not allowed";
        newValue = "0";
      }
      setQuoteBreakdownInfoEditValue(quoteBreakdownInfoEditValueDup);
    }
    setGeneralInfoEditValue(generalInfoEditValueDup);
    if (dataSource === "Quotation") {
      let currentQuotationValueDup = deepCopy(quotationValue);
      currentQuotationValueDup = {
        ...currentQuotationValueDup,
        [fieldName]: newValue,
      } as IUDGSQuotationGridModel;
      const factorNumberQBUPT = getDecimalFactor(
        currentQuotationValueDup,
        "QBUPT"
      );
      const factorNumberQUPT = getDecimalFactor(
        currentQuotationValueDup,
        "QUPT"
      );
      if (
        AutoSumQuotedBasicUnitPriceTtlFields.indexOf(
          fieldName as keyof IUDGSQuotationGridModel
        ) !== -1
      ) {
        let resultQBUPT: number = 0;
        AutoSumQuotedBasicUnitPriceTtlFields.forEach((fieldName) => {
          resultQBUPT += calculateField(
            currentQuotationValueDup,
            fieldName,
            factorNumberQBUPT
          );
        });
        currentQuotationValueDup.QuotedBasicUnitPriceTtl = (
          resultQBUPT / factorNumberQBUPT
        ).toFixed(3);
      }
      if (
        AutoSumQuotedUnitPriceTtlFields.indexOf(
          fieldName as keyof IUDGSQuotationGridModel
        ) !== -1
      ) {
        let resultQUPT: number = 0;
        AutoSumQuotedUnitPriceTtlFields.forEach((fieldName) => {
          resultQUPT += calculateField(
            currentQuotationValueDup,
            fieldName,
            factorNumberQUPT
          );
        });
        currentQuotationValueDup.QuotedUnitPriceTtl = (
          resultQUPT / factorNumberQUPT
        ).toFixed(3);
      }
      setQuotationValue(currentQuotationValueDup);
    }
    if (dataSource === "Part") {
      let currentPartValueDup = deepCopy(partValue);
      currentPartValueDup = {
        ...currentPartValueDup,
        [fieldName]: newValue,
      } as IUDGSNewPartGridModel;
      setPartValue(currentPartValueDup);
    }
    setIsDirty(true);
  }
  async function save(status: string): Promise<void> {
    setIsLoading(true);
    try {
      const currentQuotationValueDup = deepCopy(quotationValue);
      currentQuotationValueDup.CommentHistory =
        JSON.stringify(commentHistoryValue);
      await putPart({
        ID: partValue.ID,
        Modified: new Date(partValue.Modified),
        PartStatus: status,
        IsQuoted: status === "Quoted" ? "Yes" : "",
        OrderQty: partValue.OrderQty,
        AnnualQty: partValue.AnnualQty,
      });
      let quotationID = quotationValue.ID;
      if (quotationValue.ID === 0) {
        quotationID = await postQuotation(quotationMapForm());
        const newQuotation = await getQuotationByID(quotationID);
        const quotationValueDupNew = deepCopy(quotationValue);
        quotationValueDupNew.ID = quotationID;
        quotationValueDupNew.Modified = newQuotation.Modified;
        setQuotationValue(quotationValueDupNew);
      } else {
        const newModified = await putQuotation(quotationMapForm());
        const quotationValueDupUpdate = deepCopy(quotationValue);
        quotationValueDupUpdate.Modified = newModified;
        setQuotationValue(quotationValueDupUpdate);
      }
      if (
        attachmentsValue.filter((i) => i.URL === "").length > 0 ||
        removedAttachmentIdsValue.length > 0
      ) {
        const updatedAttachmentsValue = await postAttachments({
          FolderName: "Quotation Attachments",
          SubFolderName: quotationID.toString(),
          NewFileItems: attachmentsValue
            .filter((i) => i.URL === "")
            .map((i) => i.FileItem!),
          RemoveFileIDs: deepCopy(removedAttachmentIdsValue),
        });
        setAttachmentsValue(updatedAttachmentsValue);
        setRemovedAttachmentIdsValue([]);
      }
      const rfqUpdateValue = {
        ID: masterData.rfqID,
        Modified: rfqValue.Modified,
        LatestQuoteDate: new Date(),
        RFQStatus: "In Progress",
      };
      const rfqNewModified = await putRFQ(rfqUpdateValue);
      const rfqValueDup = deepCopy(rfqValue);
      rfqValueDup.Modified = rfqNewModified;
      rfqValueDup.LatestQuoteDate = rfqUpdateValue.LatestQuoteDate;
      rfqValueDup.RFQStatus = "In Progress";
      setRFQValue(rfqValueDup);
    } catch (err) {
      setIsLoading(false);
      throw new Error(err);
    }
    setIsDirty(false);
  }
  function validate(): boolean {
    const currentQuotationValueDup = deepCopy(quotationValue);
    const generalInfoEditValueDup = deepCopy(generalInfoEditValue);
    const quoteBreakdownInfoEditValueDup = deepCopy(
      quoteBreakdownInfoEditValue
    );
    let validationResult: boolean = true;
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const regex = new RegExp(decimalRegex);
    NumberValidationFields.forEach((validationField) => {
      if (
        currentQuotationValueDup[validationField.Field] &&
        currentQuotationValueDup[validationField.Field] !== "NaN"
      ) {
        const result = regex.test(
          currentQuotationValueDup[validationField.Field]!.toString()
        );
        validationResult = result ? validationResult : false;
        quoteBreakdownInfoEditValueDup[validationField.RowIndex].Fields[
          validationField.ColumnIndex
        ].ErrorMessage = result ? "" : "3 decimals max";
      }
    });
    MandatoryValidationFieldsOne.forEach((validationField) => {
      const result = !!currentQuotationValueDup[validationField.Field];
      validationResult = result ? validationResult : false;
      generalInfoEditValueDup[validationField.RowIndex].Fields[
        validationField.ColumnIndex
      ].ErrorMessage = result ? "" : "Value Required";
    });
    MandatoryValidationFieldsTwo.forEach((validationField) => {
      const result = !!currentQuotationValueDup[validationField.Field];
      validationResult = result ? validationResult : false;
      quoteBreakdownInfoEditValueDup[validationField.RowIndex].Fields[
        validationField.ColumnIndex
      ].ErrorMessage = result ? "" : "Value Required";
    });
    NonDoubleBytesValidationFields.forEach((validationField) => {
      let result = true;
      const validationString = String(
        deepCopy(currentQuotationValueDup[validationField.Field])
      );
      for (let i = 0; i < validationString.length; i++) {
        if (isDoubleByte(validationString[i])) {
          result = false;
          validationResult = false;
        }
      }
      generalInfoEditValueDup[validationField.RowIndex].Fields[
        validationField.ColumnIndex
      ].ErrorMessage = result ? "" : "Double bytes charater not allowed";
    });
    setGeneralInfoEditValue(generalInfoEditValueDup);
    setQuoteBreakdownInfoEditValue(quoteBreakdownInfoEditValueDup);
    console.log(currentQuotationValueDup);
    return validationResult;
  }
  function handleReturn(): void {
    const selectedItems = [
      {
        ID: rfqValue.ID,
        Parma: rfqValue.Parma,
        RFQNo: rfqValue.RFQNo,
        BuyerInfo: rfqValue.BuyerInfo,
        HandlerName: rfqValue.HandlerName,
        RFQType: rfqValue.RFQType,
        ReasonOfRFQ: rfqValue.ReasonOfRFQ,
        Created: rfqValue.Created,
        RFQDueDate: rfqValue.RFQDueDate,
        RFQStatus: rfqValue.RFQStatus,
        EffectiveDateRequest: rfqValue.EffectiveDateSupplier,
      },
    ];
    navigate("/rfq/quotation", { state: { selectedItems } });
  }
  function quotationMapForm(): IUDGSQuotationFormModel {
    return {
      ID: quotationValue.ID,
      Modified: quotationValue.Modified,
      ContentTypeId: quotationValue.ContentTypeId,
      NamedPlace: quotationValue.NamedPlace,
      NamedPlaceDescription: quotationValue.NamedPlaceDescription,
      SurfaceTreatmentCode: quotationValue.SurfaceTreatmentCode,
      CountryOfOrigin: quotationValue.CountryOfOrigin,
      OrderCoverageTime: parseNumberOptional(
        quotationValue.OrderCoverageTime.toString()
      ),
      FirstLot: quotationValue.FirstLot,
      SupplierPartNumber: quotationValue.SupplierPartNumber,
      Currency: quotationValue.Currency,
      MaterialsCostsTtl: parseNumberOptional(quotationValue.MaterialsCostsTtl),
      PaidProvPartsCost: parseNumberOptional(quotationValue.PaidProvPartsCost),
      QuotedUnitPriceTtl: parseNumberOptional(
        quotationValue.QuotedUnitPriceTtl
      ),
      PurchasedPartsCostsTtl: parseNumberOptional(
        quotationValue.PurchasedPartsCostsTtl
      ),
      SuppliedMtrCost: parseNumberOptional(quotationValue.SuppliedMtrCost),
      UOP: quotationValue.UOP,
      ProcessingCostsTtl: parseNumberOptional(
        quotationValue.ProcessingCostsTtl
      ),
      OrderPriceStatusCode: quotationValue.OrderPriceStatusCode,
      ToolingJigDeprCostTtl: parseNumberOptional(
        quotationValue.ToolingJigDeprCostTtl
      ),
      QuotedToolingPriceTtl: parseNumberOptional(
        quotationValue.QuotedToolingPriceTtl
      ),
      AdminExpProfit: parseNumberOptional(quotationValue.AdminExpProfit),
      QuotedOneTimePaymentTtl: parseNumberOptional(
        quotationValue.QuotedOneTimePaymentTtl
      ),
      PackingAndDistributionCosts: parseNumberOptional(
        quotationValue.PackingAndDistributionCosts
      ),
      Other: parseNumberOptional(quotationValue.Other),
      QuotedBasicUnitPriceTtl: parseNumberOptional(
        quotationValue.QuotedBasicUnitPriceTtl
      ),
      PartIDRef: partValue.ID,
    };
  }
  //#endregion
  return (
    <div>
      {isLoading ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <>
          <Stack tokens={{ childrenGap: 10, padding: 10 }}>
            <Text variant="large" className="header">
              Part Price Breakdown Details
            </Text>
            <Stack tokens={{ childrenGap: 10 }} className="stackSubHeader">
              <Text variant="medium" className="textBolder">
                {t("Part Basic info")}
              </Text>
              {formRender(basicInfo, true)}
            </Stack>
          </Stack>
          {isEditable && (
            <>
              <Text variant="medium" className="subHeader">
                {t("General Info")}
              </Text>
              <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                <Stack tokens={{ childrenGap: 20 }} className="stackInput">
                  {formRender(generalInfoEditValue, false)}
                </Stack>
              </Stack>
              <Text variant="medium" className="subHeader">
                {t("Quote Breakdown Info")}
              </Text>
              <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                <Stack tokens={{ childrenGap: 20 }} className="stackInput">
                  {formRender(quoteBreakdownInfoEditValue, false)}
                </Stack>
              </Stack>
            </>
          )}
          {!isEditable && (
            <Stack tokens={{ childrenGap: 10, padding: 10 }}>
              <Stack tokens={{ childrenGap: 10 }} className="stackSubHeader">
                <Text variant="medium" className="textBolder">
                  {t("General Info")}
                </Text>
                {formRender(generalInfoView, true)}
              </Stack>
              <Stack tokens={{ childrenGap: 10 }} className="stackSubHeader">
                <Text variant="medium" className="textBolder">
                  {t("Quote Breakdown Info")}
                </Text>
                {formRender(quoteBreakdownInfoView, true)}
              </Stack>
            </Stack>
          )}
          <Stack horizontal verticalAlign="center" className="stackHorizontal">
            <Stack.Item grow={1} align="start" className="flexBasisZero">
              <Stack>
                {isEditable && (
                  <>
                    <div className="displayFlex">
                      <Text variant="medium">{"Please download template"}</Text>
                      <Link
                        href={`${
                          ctx!.context?._pageContext?._web?.absoluteUrl
                        }/GSITSTemplate/Demo%20Template.xlsx`}
                        className="textPaddingLeft"
                      >
                        {"here"}
                      </Link>
                    </div>
                    {attachmentsValue.length > 10 && (
                      <Text
                        variant="medium"
                        styles={{ root: { color: "red" } }}
                      >
                        {"File number limit: 10"}
                      </Text>
                    )}
                    <div className="uploadArea">
                      <input
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        id="file-input"
                        onChange={onUploadFile}
                        disabled={attachmentsValue.length >= 10}
                      />
                      <label htmlFor="file-input" className="labelUpload">
                        <IconButton
                          iconProps={{ iconName: "Attach" }}
                          className="iconUpload"
                        />
                        <div style={{ display: "inline-block" }}>
                          <span
                            role="img"
                            aria-label="paperclip"
                            className="textUpload"
                          >
                            {"Click to Upload"}
                          </span>
                          <span className="textPaddingLeft">
                            {
                              "(File number limit: 10; Single file size limit: 10MB)"
                            }
                          </span>
                        </div>
                      </label>
                    </div>
                  </>
                )}
                {!isEditable && (
                  <Text variant="medium" className="subHeader">
                    {t("Attachments")}
                  </Text>
                )}
                <Stack className="fileList">
                  {(attachmentsValue.length >= 4
                    ? attachmentsValue
                    : attachmentsValue.concat(
                        new Array(4 - attachmentsValue.length).fill(null)
                      )
                  ).map((val, i) => {
                    return val ? (
                      <div
                        className={i % 2 === 0 ? "fileItemEven" : "fileItemOdd"}
                      >
                        <Link onClick={() => onDownLoadFile(val.FileItem!)}>
                          {val.Name}
                        </Link>
                        {isEditable && (
                          <Link onClick={() => onRemoveFile(val, i)}>
                            Remove
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div
                        className={i % 2 === 0 ? "fileItemEven" : "fileItemOdd"}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Stack.Item>
            <Stack.Item grow={1} align="start" className="flexBasisZero">
              <Stack>
                <Text variant="medium" className="textBolder">
                  {t("Comment")}
                </Text>
                <Stack tokens={{ childrenGap: 10 }} className="stackComment">
                  <Text variant="small" className="textBolder">
                    {t("Input Comments")}
                  </Text>
                  <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <Stack.Item grow={4} className="stackCommentInput">
                      <TextField
                        onChange={onChangeQuotationComment}
                        styles={priceBreakdownStyles.textFieldComment}
                        value={quotationCommentValue}
                        disabled={partValue.PartStatus === "Closed"}
                      />
                    </Stack.Item>
                    <Stack.Item grow={1} className="flexBasisZero">
                      <PrimaryButton
                        text="Add"
                        styles={priceBreakdownStyles.buttonPrimarySmall}
                        onClick={onPostComment}
                        disabled={partValue.PartStatus === "Closed"}
                      />
                    </Stack.Item>
                  </Stack>
                  <Text variant="small" className="textBolder">
                    {t("Comment History")}
                  </Text>
                  <TextField
                    multiline
                    rows={5}
                    readOnly
                    value={commentHistoryValue
                      .map(
                        (item) =>
                          `${parseDateFormat(new Date(item.CommentDate))} ${
                            item.CommentBy
                          }: ${item.CommentText}`
                      )
                      .join("\n")}
                    styles={priceBreakdownStyles.textFieldMultiline}
                  />
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
          <Stack
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
            className="stackButton"
          >
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <DefaultButton
                text={t("Back")}
                styles={priceBreakdownStyles.buttonDefault}
                onClick={onClickBackBtn}
              />
              {masterData.role === "Supplier" && (
                <>
                  <PrimaryButton
                    text={t("Save")}
                    styles={priceBreakdownStyles.buttonPrimary}
                    onClick={onClickSaveBtn}
                    disabled={!isEditable}
                  />
                  <PrimaryButton
                    text={t("Submit")}
                    styles={priceBreakdownStyles.buttonPrimary}
                    onClick={onClickSubmitBtn}
                    disabled={!isEditable}
                  />
                </>
              )}
              {masterData.role === "Buyer" && (
                <>
                  <PrimaryButton
                    text={t("Accept")}
                    styles={priceBreakdownStyles.buttonPrimary}
                    onClick={onClickAcceptBtn}
                    disabled={partValue.PartStatus !== "Quoted"}
                  />
                  <PrimaryButton
                    text={t("Return")}
                    styles={priceBreakdownStyles.buttonPrimary}
                    onClick={onClickReturnBtn}
                    disabled={
                      partValue.PartStatus !== "Quoted" &&
                      partValue.PartStatus !== "Accepted"
                    }
                  />
                </>
              )}
            </Stack>
          </Stack>
          <div className="listWrapper">
            <DetailsList
              items={
                masterData.role === "Buyer"
                  ? currentActionlogs
                  : currentActionlogs.filter(
                      (log) =>
                        log.LogType !== "Accept Quote" &&
                        log.LogType !== "Sent to GPS"
                    )
              }
              columns={IActionLogColumn}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
              onRenderRow={listRowRender}
              styles={priceBreakdownStyles.detailsList}
            />
          </div>
          <Dialog
            hidden={!dialogValue.IsOpen}
            onDismiss={() => onDialogClose()}
            dialogContentProps={{
              type: DialogType.normal,
              title: dialogValue.Title,
            }}
            modalProps={{
              isBlocking: true,
            }}
            maxWidth={800}
          >
            <span>{dialogValue.Tip}</span>
            {(dialogValue.ActionType === "Accepted" ||
              dialogValue.ActionType === "Returned") && (
              <DetailsList
                items={[partQuotationValue]}
                columns={IDialogListColumn}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionMode={SelectionMode.none}
                styles={priceBreakdownStyles.detailsListDialogBox}
              />
            )}
            {dialogValue.ActionType === "Returned" && (
              <Stack style={{ marginBottom: 10 }}>
                <TextField
                  label="Input comments"
                  required
                  style={{ width: "100%" }}
                  onChange={(event, newValue) =>
                    onDialogCommentChange(event, newValue)
                  }
                />
              </Stack>
            )}
            <DialogFooter>
              {(dialogValue.ActionType === "Accepted" ||
                dialogValue.ActionType === "Returned") && (
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                  <DefaultButton
                    styles={priceBreakdownStyles.buttonDialogBox}
                    onClick={() => onDialogClose()}
                    text="Cancel"
                  />
                  <PrimaryButton
                    styles={priceBreakdownStyles.buttonDialogBox}
                    onClick={() => onDialogConfirm()}
                    disabled={
                      dialogCommentValue.length === 0 &&
                      dialogValue.ActionType === "Returned"
                    }
                    text="OK"
                  />
                </Stack>
              )}
              {dialogValue.ActionType === "Cancel" && (
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                  <PrimaryButton
                    styles={priceBreakdownStyles.buttonDialogBox}
                    onClick={() => onDialogConfirm()}
                    text="Leave"
                  />
                  <DefaultButton
                    styles={priceBreakdownStyles.buttonDialogBox}
                    onClick={() => onDialogClose()}
                    text="Continue Editing"
                  />
                </Stack>
              )}
              {dialogValue.ActionType === "Message" && (
                <DefaultButton
                  styles={priceBreakdownStyles.buttonDialogBox}
                  onClick={() => onDialogClose()}
                  text="Ok"
                />
              )}
            </DialogFooter>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default PriceBreakDown;
