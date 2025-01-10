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
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../../../AppContext";
import { usePriceBreakdownNegotiation } from "../../../../hooks-v3/use-pricebreakdown-negotiation";
import {
  IPCActionLogColumn,
  IPCDialogValue,
  IPCMasterData,
  IPCTextFieldRowPriceBreakdown,
  PCAutoSumQuotedBasicUnitPriceTtlFields,
  PCAutoSumQuotedUnitPriceTtlFields,
  PCBasicInfo,
  PCNumberValidationFields,
  PCQuoteBreakdownInfoEdit,
  PCQuoteBreakdownInfoView,
} from "./IPriceChangePriceBreakDown";
import {
  IUDGSQuotationFormModel,
  IUDGSQuotationGridModel,
} from "../../../../model-v2/udgs-quotation-model";
import { IUDGSAttachmentGridModel } from "../../../../model-v2/udgs-attachment-model";
import { IUDGSCommentModel } from "../../../../model-v2/udgs-comment-model";
import { IUDGSRFQGridModel } from "../../../../model-v2/udgs-rfq-model";
import { IUDGSNegotiationPartGridModel } from "../../../../model-v2/udgs-negotiation-model";
import {
  deepCopy,
  getDecimalPlace,
  parseDateFormat,
  parseNumberOptional,
} from "../../../../common/commonHelper";
import { IUDGSActionlogGridModel } from "../../../../model-v2/udgs-actionlog-model";
import { priceChangePriceBreakdownStyles } from "../../../../config/theme";
import "./index.css";

const PriceChangePriceBreakDown: React.FC = () => {
  //#region properties
  const hooks = usePriceBreakdownNegotiation();
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const navigate = useNavigate();
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const location = useLocation();
  const masterData: IPCMasterData = location.state;
  // console.log(location.state);
  // const masterData: IPCMasterData = {
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
  const [isDirty, setIsDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    IsOpen: false,
    Title: "",
    Tip: "",
    ActionType: "Close",
  } as IPCDialogValue);
  const [partValue, setPartValue] = React.useState(
    {} as IUDGSNegotiationPartGridModel
  );
  const [quotationValue, setQuotationValue] = React.useState(
    {} as IUDGSQuotationGridModel
  );
  const [rfqValue, setRFQValue] = React.useState({} as IUDGSRFQGridModel);
  const [attachmentsValue, setAttachmentsValue] = React.useState(
    [] as IUDGSAttachmentGridModel[]
  );
  const [actionlogValue, setActionlogValue] = React.useState(
    [] as IUDGSActionlogGridModel[]
  );
  const [commentHistoryValue, setCommentHistoryValue] = React.useState(
    [] as IUDGSCommentModel[]
  );
  const [quotationCommentValue, setQuotationCommentValue] = React.useState("");
  const [removedAttachmentIdsValue, setRemovedAttachmentIdsValue] =
    React.useState([] as string[]);
  const [quoteBreakdownInfoEditValue, setQuoteBreakdownInfoEditValue] =
    React.useState(PCQuoteBreakdownInfoEdit(masterData));
  //#endregion
  //#region events
  useEffect(() => {
    const dataInitialLoad = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const initialData = await hooks.getInitiateData(
          masterData.rfqID,
          masterData.partID,
          masterData.quotationID
        );
        const commentHistoryArray = initialData.quotationValue.CommentHistory
          ? JSON.parse(initialData.quotationValue.CommentHistory).map(
              (item: IUDGSCommentModel) => {
                return {
                  ...item,
                  CommentDate: new Date(item.CommentDate),
                } as IUDGSCommentModel;
              }
            )
          : [];
        commentHistoryArray.sort(
          (a: IUDGSCommentModel, b: IUDGSCommentModel) => {
            return (
              new Date(b.CommentDate).getTime() -
              new Date(a.CommentDate).getTime()
            );
          }
        );
        setIsEditable(masterData.role === "Supplier");
        setRFQValue(deepCopy(initialData.rfqValue));
        setPartValue(deepCopy(initialData.partValue));
        setQuotationValue(deepCopy(initialData.quotationValue));
        setAttachmentsValue(deepCopy(initialData.attachmentValue));
        setActionlogValue(deepCopy(initialData.actionlogValue));
        setCommentHistoryValue(commentHistoryArray);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    dataInitialLoad()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
  const onChangeTextField = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof IUDGSQuotationGridModel,
    newValue?: string
  ): void => {
    fieldUpdate(fieldName, newValue);
  };
  const onChangeDropDown = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption,
    fieldName: keyof IUDGSQuotationGridModel
  ): void => {
    fieldUpdate(fieldName, item.key as string);
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
      const updatedData = await hooks.postComment(
        partValue.ID,
        quotationValue.ID,
        quotationValue.Modified,
        commentHistoryValueDup
      );
      const quotationValueDup = deepCopy(quotationValue);
      quotationValueDup.ID = updatedData.quotationID!;
      quotationValueDup.Modified = updatedData.quotationModifiedDate;
      setQuotationValue(quotationValueDup);
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
    await save().then(() => {
      setDialogValue({
        IsOpen: true,
        Title: t("Submit Success"),
        Tip: t("The update is saved successfully"),
        ActionType: "Message",
      });
    });
    setIsLoading(false);
  };
  const onDialogClose = (): void => {
    setDialogValue({
      IsOpen: false,
      Title: "",
      Tip: "",
      ActionType: "Close",
    });
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
    fields: IPCTextFieldRowPriceBreakdown[],
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
              className={
                rowData.IsLastRow
                  ? "pcpb__form__field__wrapper--lastrow"
                  : "pcpb__form__field__wrapper"
              }
            >
              {rowData.Fields.map((fieldData, fieldIndex) => {
                return (
                  <Stack.Item
                    grow
                    key={fieldIndex}
                    className="pcpb--flexbasiszero"
                  >
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      horizontalAlign={fieldData.Align}
                    >
                      <div className="pcpb__form__field">
                        {fieldData.Label === "Blank" ? (
                          <>
                            <Text className="pcpb__form__field__label">
                              {""}
                            </Text>
                            <Text className="pcpb__form__field__value">{}</Text>
                          </>
                        ) : (
                          <>
                            {readOnly && (
                              <>
                                <div className="pcpb--flex">
                                  <span
                                    className={"pcpb__form__field__label--bold"}
                                  >
                                    {t(fieldData.Label!)}
                                  </span>
                                  {fieldData.AdditionalIcon && (
                                    <TooltipHost
                                      content={fieldData.Label}
                                      id={fieldData.Key}
                                    >
                                      <Icon
                                        iconName="Info"
                                        styles={
                                          priceChangePriceBreakdownStyles.icon
                                        }
                                      />
                                    </TooltipHost>
                                  )}
                                </div>
                                {fieldData.IsDate ? (
                                  <Text
                                    variant="small"
                                    className="pcpb__form__field__value"
                                  >
                                    {fieldData.DataSource === "Part"
                                      ? partValue[
                                          fieldData.Key as keyof IUDGSNegotiationPartGridModel
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
                                  <Text
                                    variant="small"
                                    className="pcpb__form__field__value"
                                  >
                                    {fieldData.DataSource === "Part"
                                      ? partValue[
                                          fieldData.Key as keyof IUDGSNegotiationPartGridModel
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
                                <Stack
                                  horizontal
                                  verticalAlign="center"
                                  tokens={{ childrenGap: 10 }}
                                >
                                  <Stack.Item className="pcpb--flexbasiszero">
                                    <div className="pcpb--flex">
                                      <span
                                        className={"pcpb__form__field__label"}
                                      >
                                        {t(fieldData.Label!)}
                                      </span>
                                      {fieldData.ShowMandatoryIcon && (
                                        <span className="pcpb__form__field__label--red">
                                          {"*"}
                                        </span>
                                      )}
                                      {fieldData.AdditionalIcon && (
                                        <TooltipHost
                                          content={fieldData.Label}
                                          id={fieldData.Key}
                                        >
                                          <Icon
                                            iconName="Info"
                                            styles={
                                              priceChangePriceBreakdownStyles.icon
                                            }
                                          />
                                        </TooltipHost>
                                      )}
                                    </div>
                                    {fieldData.FieldType === "Text" ? (
                                      <TextField
                                        styles={
                                          priceChangePriceBreakdownStyles.textField
                                        }
                                        value={quotationValue[
                                          fieldData.Key! as keyof IUDGSQuotationGridModel
                                        ]?.toString()}
                                        onChange={(event, newValue) =>
                                          onChangeTextField(
                                            event,
                                            fieldData.Key! as keyof IUDGSQuotationGridModel,
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
                                        styles={
                                          priceChangePriceBreakdownStyles.textField
                                        }
                                        value={
                                          fieldData.DataSource === "Quotation"
                                            ? quotationValue[
                                                fieldData.Key! as keyof IUDGSQuotationGridModel
                                              ]?.toString()
                                            : partValue[
                                                fieldData.Key! as keyof IUDGSNegotiationPartGridModel
                                              ]?.toString()
                                        }
                                        onChange={(event, newValue) =>
                                          onChangeTextField(
                                            event,
                                            fieldData.Key! as keyof IUDGSQuotationGridModel,
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
                                          styles={
                                            priceChangePriceBreakdownStyles.dropdown
                                          }
                                          onChange={(event, item) =>
                                            onChangeDropDown(
                                              event,
                                              item!,
                                              fieldData.Key! as keyof IUDGSQuotationGridModel
                                            )
                                          }
                                          errorMessage={
                                            fieldData.ErrorMessage ?? undefined
                                          }
                                        />
                                      )
                                    )}
                                  </Stack.Item>
                                  <Stack.Item className="pcpb--flexbasiszero">
                                    {!fieldData.ShowCurrent && (
                                      <>
                                        <Text className="pcpb__form__field__label">
                                          {""}
                                        </Text>
                                        <Text className="pcpb__form__field__value">
                                          {}
                                        </Text>
                                      </>
                                    )}
                                    {fieldData.ShowCurrent && (
                                      <>
                                        <div className="pcpb--flex">
                                          <span
                                            className={
                                              "pcpb__form__field__label--current"
                                            }
                                          >
                                            {`Current ${t(fieldData.Label!)}`}
                                          </span>
                                        </div>
                                        <div className="pcpb--flex">
                                          <span className="pcpb__form__field__value--current">
                                            {quotationValue[
                                              fieldData.Key! as keyof IUDGSQuotationGridModel
                                            ]?.toString()}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </Stack.Item>
                                </Stack>
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
      decimalPlaces = PCAutoSumQuotedBasicUnitPriceTtlFields.map((field) =>
        getDecimalPlace(NewValue[field].toString())
      );
    }
    if (Field === "QUPT") {
      decimalPlaces = PCAutoSumQuotedUnitPriceTtlFields.map((field) =>
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
    fieldName: keyof IUDGSQuotationGridModel,
    newValue?: string
  ): void {
    if (
      PCNumberValidationFields.filter((i) => i.Field === fieldName).length > 0
    ) {
      const fieldData = PCNumberValidationFields.filter(
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
    let currentQuotationValueDup = deepCopy(quotationValue);
    currentQuotationValueDup = {
      ...currentQuotationValueDup,
      [fieldName]: newValue,
    } as IUDGSQuotationGridModel;
    const factorNumberQBUPT = getDecimalFactor(
      currentQuotationValueDup,
      "QBUPT"
    );
    const factorNumberQUPT = getDecimalFactor(currentQuotationValueDup, "QUPT");
    if (
      PCAutoSumQuotedBasicUnitPriceTtlFields.indexOf(
        fieldName as keyof IUDGSQuotationGridModel
      ) !== -1
    ) {
      let resultQBUPT: number = 0;
      PCAutoSumQuotedBasicUnitPriceTtlFields.forEach((fieldName) => {
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
      PCAutoSumQuotedUnitPriceTtlFields.indexOf(
        fieldName as keyof IUDGSQuotationGridModel
      ) !== -1
    ) {
      let resultQUPT: number = 0;
      PCAutoSumQuotedUnitPriceTtlFields.forEach((fieldName) => {
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
    setIsDirty(true);
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
  async function save(): Promise<void> {
    setIsLoading(true);
    try {
      const newModifiedDate = await hooks.saveData(
        quotationMapForm(),
        partValue,
        attachmentsValue,
        removedAttachmentIdsValue
      );
      const quotationValueDup = deepCopy(quotationValue);
      const partValueDup = deepCopy(partValue);
      quotationValueDup.Modified = newModifiedDate.quotationModifiedDate;
      partValueDup.Modified = newModifiedDate.partModifiedDate;
      setQuotationValue(quotationValueDup);
      setPartValue(partValueDup);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
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
            <Text variant="large" className="pcpb__header">
              Part Price Breakdown Details
            </Text>
            <Stack tokens={{ childrenGap: 10 }} className="pcpb__form__header">
              <Text variant="medium" className="pcpb--bolder">
                {t("Part Basic info")}
              </Text>
              {formRender(PCBasicInfo, true)}
            </Stack>
          </Stack>
          {isEditable && (
            <>
              {" "}
              <Text variant="medium" className="pcpb__form__header--view">
                {t("Quote Breakdown Info")}
              </Text>
              <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                <Stack
                  tokens={{ childrenGap: 20 }}
                  className="pcpb__form__wrapper"
                >
                  {formRender(quoteBreakdownInfoEditValue, false)}
                </Stack>
              </Stack>
            </>
          )}
          {!isEditable && (
            <Stack tokens={{ childrenGap: 10 }} className="pcpb__form__header">
              <Text variant="medium" className="pcpb--bolder">
                {t("Quote Breakdown Info")}
              </Text>
              {formRender(PCQuoteBreakdownInfoView, true)}
            </Stack>
          )}
          <Stack
            horizontal
            verticalAlign="center"
            className="pcpb__form__field__wrapper"
          >
            <Stack.Item grow={1} align="start" className="pcpb--flexbasiszero">
              <Stack>
                <Text variant="medium" className="pcpb--bolder">
                  {t("Comment")}
                </Text>
                <Stack tokens={{ childrenGap: 10 }} className="pcpb__comment">
                  <Text variant="small" className="pcpb--bolder">
                    {t("Input Comments")}
                  </Text>
                  <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <Stack.Item grow={4} className="pcpb__comment__input">
                      <TextField
                        onChange={onChangeQuotationComment}
                        styles={
                          priceChangePriceBreakdownStyles.textFieldComment
                        }
                        value={quotationCommentValue}
                      />
                    </Stack.Item>
                    <Stack.Item grow={1} className="pcpb--flexbasiszero">
                      <PrimaryButton
                        text="Add"
                        styles={
                          priceChangePriceBreakdownStyles.buttonPrimarySmall
                        }
                        onClick={onPostComment}
                      />
                    </Stack.Item>
                  </Stack>
                  <Text variant="small" className="pcpb--bolder">
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
                    styles={priceChangePriceBreakdownStyles.textFieldMultiline}
                  />
                </Stack>
              </Stack>
            </Stack.Item>
            <Stack.Item grow={1} align="start" className="pcpb--flexbasiszero">
              <Stack>
                {isEditable && (
                  <>
                    <div className="pcpb--flex">
                      <Text variant="medium">{"Please download template"}</Text>
                      <Link
                        href={`${
                          ctx!.context?._pageContext?._web?.absoluteUrl
                        }/GSITSTemplate/Demo%20Template.xlsx`}
                        className="pcpb--paddingleft"
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
                    <div className="pcpb__upload__label">
                      <input
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        id="file-input"
                        onChange={onUploadFile}
                        disabled={attachmentsValue.length >= 10}
                      />
                      <label
                        htmlFor="file-input"
                        className="pcpb__upload__label__input"
                      >
                        <IconButton
                          iconProps={{ iconName: "Attach" }}
                          className="pcpb__upload__label__input__icon"
                        />
                        <div style={{ display: "inline-block" }}>
                          <span
                            role="img"
                            aria-label="paperclip"
                            className="pcpb__upload__label__input__text"
                          >
                            {"Click to Upload"}
                          </span>
                          <span className="pcpb__upload__label__input__hint">
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
                  <Text variant="medium" className="pcpb__form__header--view">
                    {t("Attachments")}
                  </Text>
                )}
                <Stack className="pcpb__upload__list">
                  {(attachmentsValue.length >= 4
                    ? attachmentsValue
                    : attachmentsValue.concat(
                        new Array(4 - attachmentsValue.length).fill(null)
                      )
                  ).map((val, i) => {
                    return val ? (
                      <div
                        className={
                          i % 2 === 0
                            ? "pcpb__upload__list--even"
                            : "pcpb__upload__list--odd"
                        }
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
                        className={
                          i % 2 === 0
                            ? "pcpb__upload__list--even"
                            : "pcpb__upload__list--odd"
                        }
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
          <Stack
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
            className="pcpb__footer__btnfield"
          >
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <DefaultButton
                text={t("Back")}
                styles={priceChangePriceBreakdownStyles.buttonDefault}
                onClick={onClickBackBtn}
              />
              {masterData.role === "Supplier" && (
                <>
                  <PrimaryButton
                    text={t("Save")}
                    styles={priceChangePriceBreakdownStyles.buttonPrimary}
                    onClick={onClickSaveBtn}
                    disabled={!isEditable}
                  />
                  <PrimaryButton
                    text={t("Submit")}
                    styles={priceChangePriceBreakdownStyles.buttonPrimary}
                    disabled={!isEditable}
                  />
                </>
              )}
            </Stack>
          </Stack>
          <div className="pcpb__detailslist">
            <DetailsList
              items={
                masterData.role === "Buyer"
                  ? actionlogValue
                  : actionlogValue.filter(
                      (log) =>
                        log.LogType !== "Accept Quote" &&
                        log.LogType !== "Sent to GPS"
                    )
              }
              columns={IPCActionLogColumn}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
              onRenderRow={listRowRender}
              styles={priceChangePriceBreakdownStyles.detailsList}
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
            <DialogFooter>
              {dialogValue.ActionType === "Message" && (
                <DefaultButton
                  styles={priceChangePriceBreakdownStyles.buttonDialogBox}
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
export default PriceChangePriceBreakDown;
