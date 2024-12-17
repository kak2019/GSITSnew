import React, { useEffect } from "react";
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
  IDetailsListStyles,
  IDetailsRowProps,
  IDropdownOption,
  ITextFieldStyles,
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
import { useQuotation } from "../../../../hooks/useQuotation";
import { IQuotationGrid } from "../../../../model/requisition";
import { IRFQGrid } from "../../../../model/rfq";
import "./index.css";
import {
  AutoSumQuotedBasicUnitPriceTtlFields,
  AutoSumQuotedUnitPriceTtlFields,
  basicInfo,
  decimalRegex,
  DecimalValidationFieldsTwo,
  generalInfoEdit,
  generalInfoView,
  IActionLogColumn,
  IDialogListColumn,
  IDialogValue,
  MandatoryValidationFieldsOne,
  MandatoryValidationFieldsTwo,
  NonDoubleBytesValidationFields,
  quoteBreakdownInfoEdit,
  quoteBreakdownInfoView,
} from "./IPriceBreakDown";
import { IAttachments } from "../../../../model/documents";
import { IComment } from "../../../../model/comment";
import { IActionLog } from "../../../../model/actionLog";
import { useLocation, useNavigate } from "react-router-dom";

const PriceBreakDown: React.FC = () => {
  //#region properties
  const [
    isFetching,
    errorMessage,
    ,
    currentQuotation,
    currentQuotationRFQ,
    allActionLogs,
    quotationAttachments,
    ,
    initialLoadForPriceChange,
    ,
    updateQuotation,
    getAllActionLogs,
    createActionLog,
    acceptOrReturn,
    postComment,
    uploadQuotationAttachments,
    ,
  ] = useQuotation();
  const { t } = useTranslation();
  const location = useLocation();
  const masterData = location.state;
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    IsOpen: false,
    Title: "",
    Tip: "",
    Type: "Close",
  } as IDialogValue);
  const [currentQuotationValue, setCurrentQuotationValue] = React.useState(
    {} as IQuotationGrid
  );
  const [currentQuotationRFQValue, setCurrentQuotationRFQValue] =
    React.useState({} as IRFQGrid);
  const [attachmentsValue, setAttachmentsValue] = React.useState(
    [] as IAttachments[]
  );
  const [attachmentsToBeRemovedValue, setAttachmentsToBeRemovedValue] =
    React.useState([] as string[]);
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: "25px",
    },
    errorMessage: { paddingTop: "0px" },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "15vi" },
  };
  const textFieldStylesShort: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: "25px",
    },
    errorMessage: { paddingTop: "0px" },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "11vi" },
  };
  const dropdownStyles = {
    title: {
      height: "25px",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
    },
    caretDownWrapper: {
      height: "25px",
      display: "flex",
      alignItems: "center",
    },
    errorMessage: { paddingTop: "0px" },
    root: {
      width: "15vi",
    },
  };
  const defaultButtonStyle = {
    root: {
      height: "30px",
      borderRadius: "5px",
      minHeight: "30px",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  };
  const primaryButtonStyle = {
    root: {
      height: "30px",
      width: "120px",
      borderRadius: "5px",
      minHeight: "30px",
      // color: "black",
      // backgroundColor: "#99CCFF",
      // borderColor: "#99CCFF",
    },
    rootHovered: {
      // backgroundColor: "#99CCFF",
      // borderColor: "#99CCFF",
    },
    textContainer: { height: "100%" },
    label: { lineHeight: "30px" },
  };
  const listStyles: IDetailsListStyles = {
    root: {
      border: "1px solid #ccc",
      overflow: "visible",
    },
    headerWrapper: {},
    contentWrapper: {},
    focusZone: {},
  };
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
  //#endregion
  //#region fields
  const [generalInfoEditValue, setGeneralInfoEditValue] =
    React.useState(generalInfoEdit);
  const [quoteBreakdownInfoEditValue, setQuoteBreakdownInfoEditValue] =
    React.useState(quoteBreakdownInfoEdit(masterData));
  const [commentValue, setCommentValue] = React.useState("");
  const [dialogCommentValue, setDialogCommentValue] = React.useState("");
  const [commentHistoryValue, setCommentHistoryValue] = React.useState(
    [] as IComment[]
  );
  //#endregion
  //#region events
  useEffect(() => {
    const dataInitialLoad = async (): Promise<void> => {
      try {
        setIsLoading(true);
        getAllActionLogs("ByRFQId", masterData.rfqId, masterData.quotationId);
        await initialLoadForPriceChange(
          masterData.rfqId,
          masterData.quotationId
        );
      } catch (error) {
        console.log(error);
      }
    };
    dataInitialLoad()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        console.log(errorMessage);
        // eslint-disable-next-line no-constant-condition
        if (false) {
          validate();
        }
      });
  }, []);
  useEffect(() => {
    if (!currentQuotation) {
      return;
    }
    const isEmptyObject =
      Object.keys(currentQuotation).length === 0 &&
      currentQuotation.constructor === Object;
    const initialQuotationValue = deepCopy(currentQuotation);
    if (!isEmptyObject) {
      const isEditableValue =
        masterData.role === "Supplier" && currentQuotation.Status !== "Closed";
      if (isEditableValue) {
        initialQuotationValue.NamedPlace = currentQuotation.NamedPlace
          ? currentQuotation.NamedPlace
          : masterData.supplierId;
        initialQuotationValue.SurfaceTreatmentCode =
          currentQuotation.SurfaceTreatmentCode
            ? currentQuotation.SurfaceTreatmentCode
            : "0";
        initialQuotationValue.CountryOfOrigin = currentQuotation.CountryOfOrigin
          ? currentQuotation.CountryOfOrigin
          : masterData.countryCode;
        initialQuotationValue.OrderCoverageTime =
          currentQuotation.OrderCoverageTime
            ? currentQuotation.OrderCoverageTime
            : 1;
        initialQuotationValue.FirstLot = currentQuotation.FirstLot
          ? currentQuotation.FirstLot
          : currentQuotation.RequiredWeek;
        setIsEditable(true);
      }
      setCurrentQuotationValue(initialQuotationValue);
      setCommentHistoryValue(
        initialQuotationValue.CommentHistory
          ? JSON.parse(initialQuotationValue.CommentHistory).map(
              (item: IComment) => {
                return {
                  ...item,
                  CommentDate: new Date(item.CommentDate),
                } as IComment;
              }
            )
          : []
      );
    }
  }, [currentQuotation]);
  useEffect(() => {
    setCurrentQuotationRFQValue(currentQuotationRFQ);
  }, [currentQuotationRFQ]);
  useEffect(() => {
    setAttachmentsValue(quotationAttachments);
  }, [quotationAttachments]);
  const onChangeTextField = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof IQuotationGrid,
    newValue?: string
  ): void => {
    fieldUpdate(fieldName, newValue);
  };
  const onChangeDropDown = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption,
    fieldName: keyof IQuotationGrid
  ): void => {
    fieldUpdate(fieldName, item.key as string);
    setIsDirty(true);
  };
  const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(
        (file) => ({ File: file, Url: "", ID: "" } as IAttachments)
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
  const onRemoveFile = (fileToRemove: IAttachments, index: number): void => {
    if (!!fileToRemove.ID) {
      const attachmentsToBeRemovedValueDup = deepCopy(
        attachmentsToBeRemovedValue
      );
      attachmentsToBeRemovedValueDup.push(fileToRemove.ID);
      setAttachmentsToBeRemovedValue(attachmentsToBeRemovedValueDup);
    }
    const attachmentsValueDup = [...attachmentsValue];
    attachmentsValueDup.splice(index, 1);
    setAttachmentsValue(attachmentsValueDup);
  };
  const onChangeComment = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    setCommentValue(newValue ?? "");
    setIsDirty(true);
  };
  const onAddComment = (): void => {
    if (commentValue) {
      const commentHistoryValueDup = deepCopy(commentHistoryValue);
      commentHistoryValueDup.push({
        CommentDate: new Date(),
        CommentBy: masterData.userName ?? "",
        CommentText: commentValue,
        CommentType: "Common",
      });
      setCommentHistoryValue(commentHistoryValueDup);
      postComment(
        JSON.stringify(commentHistoryValueDup),
        masterData.quotationId
      );
      setCommentValue("");
    }
  };
  const onClickCancelBtn = (): void => {
    if (isDirty) {
      setDialogValue({
        IsOpen: true,
        Title: t("Leave without saving?"),
        Tip: t("You'll lose the changes and all progress you have made"),
        Type: "Cancel",
      });
    }
    handleReturn();
  };
  const onClickSaveBtn = async (): Promise<void> => {
    await save("Draft");
  };
  const onClickSubmitBtn = async (): Promise<void> => {
    const validateResult = validate();
    if (validateResult) {
      await save("Quoted");
      createActionLog({
        User: masterData.userEmail,
        Date: new Date(),
        LogType: "Submit Quote",
        RequisitionId: masterData.quotationId,
        RFQId: masterData.rfqId,
      } as IActionLog);
    }
  };
  const onClickAcceptBtn = (): void => {
    setDialogValue({
      IsOpen: true,
      Title: t("Accept Parts"),
      Tip: t(
        "Reminder: After accepting a part, please click “Proceed to PO creation: to post the order back to GPS"
      ),
      Type: "Accepted",
    });
  };
  const onClickReturnBtn = (): void => {
    setDialogValue({
      IsOpen: true,
      Title: t("Return Parts"),
      Tip: t(
        "Reminder: The parts will be returned to the supplier to revise and re-submit"
      ),
      Type: "Returned",
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
      Type: "Close",
    });
    setDialogCommentValue("");
  };
  const onDialogConfirm = (): void => {
    if (dialogValue.Type === "Accepted" || dialogValue.Type === "Returned") {
      acceptOrReturn(
        dialogValue.Type,
        currentQuotationValue.ID,
        dialogCommentValue
      );
      createActionLog({
        User: masterData.userEmail,
        Date: new Date(),
        LogType:
          dialogValue.Type === "Accepted" ? "Accept Quote" : "Return Quote",
        RequisitionId: masterData.quotationId,
        RFQId: masterData.rfqId,
      } as IActionLog);
    } else if (dialogValue.Type === "Cancel") {
      onDialogClose();
      handleReturn();
    }
  };
  //#endregion
  //#region methods
  function fieldUpdate(
    fieldName: keyof IQuotationGrid,
    newValue?: string
  ): void {
    let currentQuotationValueDup = deepCopy(currentQuotationValue);
    currentQuotationValueDup = {
      ...currentQuotationValueDup,
      [fieldName]: newValue,
    };
    if (AutoSumQuotedBasicUnitPriceTtlFields.indexOf(fieldName) !== -1) {
      currentQuotationValueDup.QuotedBasicUnitPriceTtl = (
        (currentQuotationValueDup.MaterialsCostsTtl
          ? Number(currentQuotationValueDup.MaterialsCostsTtl)
          : 0) +
        (currentQuotationValueDup.PurchasedPartsCostsTtl
          ? Number(currentQuotationValueDup.PurchasedPartsCostsTtl)
          : 0) +
        (currentQuotationValueDup.ProcessingCostsTtl
          ? Number(currentQuotationValueDup.ProcessingCostsTtl)
          : 0) +
        (currentQuotationValueDup.ToolingJigDeprCostTtl
          ? Number(currentQuotationValueDup.ToolingJigDeprCostTtl)
          : 0) +
        (currentQuotationValueDup.AdminExpProfit
          ? Number(currentQuotationValueDup.AdminExpProfit)
          : 0) +
        (currentQuotationValueDup.PackingAndDistributionCosts
          ? Number(currentQuotationValueDup.PackingAndDistributionCosts)
          : 0) +
        (currentQuotationValueDup.Other
          ? Number(currentQuotationValueDup.Other)
          : 0)
      ).toString();
    }
    if (AutoSumQuotedUnitPriceTtlFields.indexOf(fieldName) !== -1) {
      currentQuotationValueDup.QuotedUnitPriceTtl = (
        (currentQuotationValueDup.PaidProvPartsCost
          ? Number(currentQuotationValueDup.PaidProvPartsCost)
          : 0) +
        (currentQuotationValueDup.SuppliedMtrCost
          ? Number(currentQuotationValueDup.SuppliedMtrCost)
          : 0) +
        (currentQuotationValueDup.MaterialsCostsTtl
          ? Number(currentQuotationValueDup.MaterialsCostsTtl)
          : 0) +
        (currentQuotationValueDup.PurchasedPartsCostsTtl
          ? Number(currentQuotationValueDup.PurchasedPartsCostsTtl)
          : 0) +
        (currentQuotationValueDup.ProcessingCostsTtl
          ? Number(currentQuotationValueDup.ProcessingCostsTtl)
          : 0) +
        (currentQuotationValueDup.ToolingJigDeprCostTtl
          ? Number(currentQuotationValueDup.ToolingJigDeprCostTtl)
          : 0) +
        (currentQuotationValueDup.AdminExpProfit
          ? Number(currentQuotationValueDup.AdminExpProfit)
          : 0) +
        (currentQuotationValueDup.PackingAndDistributionCosts
          ? Number(currentQuotationValueDup.PackingAndDistributionCosts)
          : 0) +
        (currentQuotationValueDup.Other
          ? Number(currentQuotationValueDup.Other)
          : 0)
      ).toString();
    }
    setIsDirty(true);
    setCurrentQuotationValue(currentQuotationValueDup);
  }
  async function save(status: string): Promise<void> {
    const currentQuotationValueDup = deepCopy(currentQuotationValue);
    currentQuotationValueDup.Status = status;
    const removeItemIds = deepCopy(attachmentsToBeRemovedValue);
    if (attachmentsValue.filter((i) => i.Url === "").length > 0) {
      uploadQuotationAttachments(
        attachmentsValue.filter((i) => i.Url === "").map((item) => item.File),
        currentQuotationValueDup.ID,
        removeItemIds
      );
    }
    await updateQuotation(currentQuotationValueDup, masterData.rfqId);
  }
  function validate(): boolean {
    const currentQuotationValueDup = deepCopy(currentQuotationValue);
    const generalInfoEditValueDup = deepCopy(generalInfoEditValue);
    const quoteBreakdownInfoEditValueDup = deepCopy(
      quoteBreakdownInfoEditValue
    );
    let validationResult: boolean = true;
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const regex = new RegExp(decimalRegex);
    DecimalValidationFieldsTwo.forEach((validationField) => {
      if (currentQuotationValueDup[validationField.Field]) {
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
      ].ErrorMessage = result ? "" : "Double bytes charater detected";
    });
    setGeneralInfoEditValue(generalInfoEditValueDup);
    setQuoteBreakdownInfoEditValue(quoteBreakdownInfoEditValueDup);
    console.log(currentQuotationValueDup);
    return validationResult;
  }
  function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
  function isDoubleByte(char: string): boolean {
    const charCode = char.charCodeAt(0);
    return charCode > 255;
  }
  function handleReturn(): void {
    const selectedItems = [
      {
        key: currentQuotationRFQ.ID,
        Parma: currentQuotationRFQ.Parma,
        RFQNo: currentQuotationRFQ.RFQNo,
        BuyerInfo: currentQuotationRFQ.BuyerInfo,
        HandlerName: currentQuotationRFQ.HandlerName,
        RFQType: currentQuotationRFQ.RFQType,
        ReasonOfRFQ: currentQuotationRFQ.ReasonOfRFQ,
        Created: currentQuotationRFQ.Created,
        RFQDueDate: currentQuotationRFQ.RFQDueDate,
        RFQStatus: currentQuotationRFQ.RFQStatus,
        EffectiveDateRequest: currentQuotationRFQ.EffectiveDateRequest,
      },
    ];
    navigate("/rfq/quotation", { state: { selectedItems } });
  }
  //#endregion
  return (
    <div>
      {isFetching || isLoading ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <div>
          {errorMessage.length > 0 ? (
            <label>{errorMessage}</label>
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
                  {basicInfo.map((basicInfoRow, rowIndex) => {
                    return (
                      <Stack
                        key={rowIndex}
                        horizontal
                        verticalAlign="center"
                        tokens={{ childrenGap: 10 }}
                        className={
                          basicInfoRow.IsLastRow
                            ? "stackHorizontalLastRow"
                            : "stackHorizontal"
                        }
                      >
                        {basicInfoRow.Fields.map((rowItem, index) => {
                          return (
                            <Stack.Item grow key={index} align="start">
                              <Stack tokens={{ childrenGap: 10 }}>
                                <div className="labelItem">
                                  <Text variant="small" className="label">
                                    {t(rowItem.Label!)}
                                  </Text>
                                  <Text variant="small" className="labelValue">
                                    {rowItem.DataSource === "Quotation"
                                      ? currentQuotationValue[
                                          rowItem.Key as keyof IQuotationGrid
                                        ] ?? ""
                                      : rowItem.DataSource === "RFQ"
                                      ? currentQuotationRFQValue[
                                          rowItem.Key as keyof IRFQGrid
                                        ] ?? ""
                                      : ""}
                                  </Text>
                                </div>
                              </Stack>
                            </Stack.Item>
                          );
                        })}
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
              {isEditable && (
                <>
                  <Text variant="medium" className="subHeader">
                    {t("General Info")}
                  </Text>
                  <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                    <Stack tokens={{ childrenGap: 20 }} className="stackInput">
                      {generalInfoEditValue.map(
                        (generalInfoEditRow, rowIndex) => {
                          return (
                            <Stack
                              key={rowIndex}
                              horizontal
                              verticalAlign="center"
                              className={
                                generalInfoEditRow.IsLastRow
                                  ? "stackHorizontalLastRow"
                                  : "stackHorizontal"
                              }
                            >
                              {generalInfoEditRow.Fields.map(
                                (rowItem, index) => {
                                  return (
                                    <Stack.Item grow key={index}>
                                      <Stack
                                        tokens={{ childrenGap: 10 }}
                                        horizontalAlign={rowItem.Align}
                                      >
                                        <div className="labelItem">
                                          <div style={{ display: "flex" }}>
                                            <Text variant="small">
                                              {t(rowItem.Label!)}
                                            </Text>
                                            {rowItem.ShowMandatoryIcon && (
                                              <span className="labelRed">
                                                {"*"}
                                              </span>
                                            )}
                                            {rowItem.AdditionalIcon && (
                                              <TooltipHost
                                                content={rowItem.Label}
                                                id={rowItem.Key}
                                              >
                                                <Icon
                                                  iconName="Info"
                                                  styles={{
                                                    root: {
                                                      paddingLeft: "5px",
                                                      fontSize: "10px",
                                                      paddingTop: "4px",
                                                      verticalAlign: "Top",
                                                    },
                                                  }}
                                                />
                                              </TooltipHost>
                                            )}
                                          </div>
                                          {rowItem.Key ===
                                          "OrderCoverageTime" ? (
                                            <div className="displayFlex">
                                              <TextField
                                                styles={textFieldStylesShort}
                                                type="number"
                                                value={currentQuotationValue.OrderCoverageTime?.toString()}
                                                onWheel={(event) => {
                                                  event.currentTarget.blur();
                                                }}
                                              />
                                              <span className="labelUnit">
                                                {t("Weeks")}
                                              </span>
                                            </div>
                                          ) : rowItem.FieldType === "Text" ? (
                                            <TextField
                                              styles={textFieldStyles}
                                              value={currentQuotationValue[
                                                rowItem.Key! as keyof IQuotationGrid
                                              ]?.toString()}
                                              onChange={(event, newValue) =>
                                                onChangeTextField(
                                                  event,
                                                  rowItem.Key! as keyof IQuotationGrid,
                                                  newValue
                                                )
                                              }
                                              errorMessage={
                                                rowItem.ErrorMessage ??
                                                undefined
                                              }
                                            />
                                          ) : rowItem.FieldType === "Number" ? (
                                            <TextField
                                              type="number"
                                              styles={textFieldStyles}
                                              value={currentQuotationValue[
                                                rowItem.Key! as keyof IQuotationGrid
                                              ]?.toString()}
                                              onChange={(event, newValue) =>
                                                onChangeTextField(
                                                  event,
                                                  rowItem.Key! as keyof IQuotationGrid,
                                                  newValue ?? ""
                                                )
                                              }
                                              errorMessage={
                                                rowItem.ErrorMessage ??
                                                undefined
                                              }
                                              onWheel={(event) => {
                                                event.currentTarget.blur();
                                              }}
                                            />
                                          ) : (
                                            rowItem.FieldType === "Choice" && (
                                              <Dropdown
                                                defaultSelectedKey={
                                                  currentQuotationValue[
                                                    rowItem.Key! as keyof IQuotationGrid
                                                  ]
                                                }
                                                options={rowItem.Choice!}
                                                styles={dropdownStyles}
                                                onChange={(event, item) =>
                                                  onChangeDropDown(
                                                    event,
                                                    item!,
                                                    rowItem.Key! as keyof IQuotationGrid
                                                  )
                                                }
                                                errorMessage={
                                                  rowItem.ErrorMessage ??
                                                  undefined
                                                }
                                              />
                                            )
                                          )}
                                        </div>
                                      </Stack>
                                    </Stack.Item>
                                  );
                                }
                              )}
                            </Stack>
                          );
                        }
                      )}
                    </Stack>
                  </Stack>
                  <Text variant="medium" className="subHeader">
                    {t("Quote Breakdown Info")}
                  </Text>
                  <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                    <Stack tokens={{ childrenGap: 20 }} className="stackInput">
                      {quoteBreakdownInfoEditValue.map(
                        (quoteBreakdownInfoEditRow, rowIndex) => {
                          return (
                            <Stack
                              key={rowIndex}
                              horizontal
                              verticalAlign="center"
                              className={
                                quoteBreakdownInfoEditRow.IsLastRow
                                  ? "stackHorizontalLastRow"
                                  : "stackHorizontal"
                              }
                            >
                              {quoteBreakdownInfoEditRow.Fields.map(
                                (rowItem, index) => {
                                  return (
                                    <Stack.Item
                                      grow
                                      key={index}
                                      className="flexBasisZero"
                                    >
                                      <Stack
                                        tokens={{ childrenGap: 10 }}
                                        horizontalAlign={rowItem.Align}
                                      >
                                        {rowItem.FieldType === "Blank" ? (
                                          <></>
                                        ) : (
                                          <div className="labelItem">
                                            <div style={{ display: "flex" }}>
                                              <Text variant="small">
                                                {t(rowItem.Label!)}
                                              </Text>
                                              {rowItem.ShowMandatoryIcon && (
                                                <span className="labelRed">
                                                  {"*"}
                                                </span>
                                              )}
                                              {rowItem.AdditionalIcon && (
                                                <TooltipHost
                                                  content={rowItem.Label}
                                                  id={rowItem.Key}
                                                >
                                                  <Icon
                                                    iconName="Info"
                                                    styles={{
                                                      root: {
                                                        paddingLeft: "5px",
                                                        fontSize: "10px",
                                                        paddingTop: "4px",
                                                        verticalAlign: "Top",
                                                      },
                                                    }}
                                                  />
                                                </TooltipHost>
                                              )}
                                            </div>
                                            {rowItem.FieldType === "Text" ? (
                                              <TextField
                                                styles={textFieldStyles}
                                                value={currentQuotationValue[
                                                  rowItem.Key! as keyof IQuotationGrid
                                                ]?.toString()}
                                                onChange={(event, newValue) =>
                                                  onChangeTextField(
                                                    event,
                                                    rowItem.Key! as keyof IQuotationGrid,
                                                    newValue
                                                  )
                                                }
                                                errorMessage={
                                                  rowItem.ErrorMessage ??
                                                  undefined
                                                }
                                              />
                                            ) : rowItem.FieldType ===
                                              "Number" ? (
                                              <TextField
                                                type="number"
                                                value={currentQuotationValue[
                                                  rowItem.Key! as keyof IQuotationGrid
                                                ]?.toString()}
                                                styles={textFieldStyles}
                                                onChange={(event, newValue) =>
                                                  onChangeTextField(
                                                    event,
                                                    rowItem.Key! as keyof IQuotationGrid,
                                                    newValue
                                                  )
                                                }
                                                errorMessage={
                                                  rowItem.ErrorMessage ??
                                                  undefined
                                                }
                                                disabled={rowItem.ReadOnly}
                                                onWheel={(event) => {
                                                  event.currentTarget.blur();
                                                }}
                                              />
                                            ) : (
                                              rowItem.FieldType ===
                                                "Choice" && (
                                                <Dropdown
                                                  options={rowItem.Choice!}
                                                  defaultSelectedKey={
                                                    currentQuotationValue[
                                                      rowItem.Key! as keyof IQuotationGrid
                                                    ]
                                                  }
                                                  styles={dropdownStyles}
                                                  onChange={(event, item) =>
                                                    onChangeDropDown(
                                                      event,
                                                      item!,
                                                      rowItem.Key! as keyof IQuotationGrid
                                                    )
                                                  }
                                                  errorMessage={
                                                    rowItem.ErrorMessage ??
                                                    undefined
                                                  }
                                                />
                                              )
                                            )}
                                          </div>
                                        )}
                                      </Stack>
                                    </Stack.Item>
                                  );
                                }
                              )}
                            </Stack>
                          );
                        }
                      )}
                    </Stack>
                  </Stack>
                </>
              )}
              {!isEditable && (
                <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                  <Stack
                    tokens={{ childrenGap: 10 }}
                    className="stackSubHeader"
                  >
                    <Text variant="medium" className="textBolder">
                      {t("General Info")}
                    </Text>
                    {generalInfoView.map((generalInfoViewRow, rowIndex) => {
                      return (
                        <Stack
                          key={rowIndex}
                          horizontal
                          verticalAlign="center"
                          tokens={{ childrenGap: 10 }}
                          className={
                            generalInfoViewRow.IsLastRow
                              ? "stackHorizontalLastRow"
                              : "stackHorizontal"
                          }
                        >
                          {generalInfoViewRow.Fields.map((rowItem, index) => {
                            return (
                              <Stack.Item grow key={index} align="start">
                                <Stack tokens={{ childrenGap: 10 }}>
                                  <div className="labelItem">
                                    <Text variant="small" className="label">
                                      {t(rowItem.Label!)}
                                    </Text>
                                    <Text
                                      variant="small"
                                      className="labelValue"
                                    >
                                      {currentQuotationValue[
                                        rowItem.Key as keyof IQuotationGrid
                                      ] ?? ""}
                                    </Text>
                                  </div>
                                </Stack>
                              </Stack.Item>
                            );
                          })}
                        </Stack>
                      );
                    })}
                  </Stack>
                  <Stack
                    tokens={{ childrenGap: 10 }}
                    className="stackSubHeader"
                  >
                    <Text variant="medium" className="textBolder">
                      {t("Quote Breakdown Info")}
                    </Text>
                    {quoteBreakdownInfoView.map(
                      (quoteBreakdownInfoViewRow, rowIndex) => {
                        return (
                          <Stack
                            key={rowIndex}
                            horizontal
                            verticalAlign="center"
                            tokens={{ childrenGap: 10 }}
                            className={
                              quoteBreakdownInfoViewRow.IsLastRow
                                ? "stackHorizontalLastRow"
                                : "stackHorizontal"
                            }
                          >
                            {quoteBreakdownInfoViewRow.Fields.map(
                              (rowItem, index) => {
                                return rowItem.Label === "Blank" ? (
                                  <Stack.Item
                                    key={index}
                                    grow
                                    className="flexBasisZero"
                                    align="start"
                                  >
                                    <Stack tokens={{ childrenGap: 10 }}>
                                      <div className="labelItem">
                                        <Text variant="small" className="label">
                                          {""}
                                        </Text>
                                        <Text
                                          variant="small"
                                          className="labelValue"
                                        >
                                          {}
                                        </Text>
                                      </div>
                                    </Stack>
                                  </Stack.Item>
                                ) : (
                                  <Stack.Item
                                    grow
                                    key={index}
                                    align="start"
                                    className="flexBasisZero"
                                  >
                                    <Stack tokens={{ childrenGap: 10 }}>
                                      <div className="labelItem">
                                        <Text variant="small" className="label">
                                          {t(rowItem.Label!)}
                                        </Text>
                                        <Text
                                          variant="small"
                                          className="labelValue"
                                        >
                                          {currentQuotationValue[
                                            rowItem.Key as keyof IQuotationGrid
                                          ] ?? ""}
                                        </Text>
                                      </div>
                                    </Stack>
                                  </Stack.Item>
                                );
                              }
                            )}
                          </Stack>
                        );
                      }
                    )}
                  </Stack>
                </Stack>
              )}
              <Stack
                horizontal
                verticalAlign="center"
                className="stackHorizontal"
              >
                <Stack.Item grow={1} align="start" className="flexBasisZero">
                  <Stack>
                    {isEditable && (
                      <>
                        <div className="displayFlex">
                          <Text variant="medium">
                            {"Please download template"}
                          </Text>
                          <Link href="" className="textPaddingLeft">
                            {"here"}
                          </Link>
                        </div>
                        <div className="uploadArea">
                          <input
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            id="file-input"
                            onChange={onUploadFile}
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
                            className={
                              i % 2 === 0 ? "fileItemEven" : "fileItemOdd"
                            }
                          >
                            <Link onClick={() => onDownLoadFile(val.File)}>
                              {val.File.name}
                            </Link>
                            <Link onClick={() => onRemoveFile(val, i)}>
                              Remove
                            </Link>
                          </div>
                        ) : (
                          <div
                            className={
                              i % 2 === 0 ? "fileItemEven" : "fileItemOdd"
                            }
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
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      className="stackComment"
                    >
                      <Text variant="small" className="textBolder">
                        {t("Input Comments")}
                      </Text>
                      <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <Stack.Item grow={4} className="stackCommentInput">
                          <TextField
                            onChange={onChangeComment}
                            styles={{
                              fieldGroup: {
                                height: "25px",
                              },
                              field: {
                                height: "100%",
                                fontSize: "13px",
                              },
                              root: { width: "100%" },
                            }}
                            disabled={currentQuotationValue.Status === "Closed"}
                          />
                        </Stack.Item>
                        <Stack.Item grow={1} className="flexBasisZero">
                          <PrimaryButton
                            text="Add"
                            styles={{
                              root: {
                                height: "25px",
                                borderRadius: "5px",
                                minHeight: "25px",
                              },
                              textContainer: { height: "100%" },
                              label: { lineHeight: "25px" },
                            }}
                            onClick={onAddComment}
                            disabled={currentQuotationValue.Status === "Closed"}
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
                              `${item.CommentDate.toLocaleString()} ${
                                item.CommentBy
                              }: ${item.CommentText}`
                          )
                          .join("\n")}
                        styles={{
                          field: {
                            resize: "vertical",
                            overflow: "auto",
                            fontSize: "12px",
                          },
                          root: { width: "inherit" },
                        }}
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
                    text={t("Cancel")}
                    styles={defaultButtonStyle}
                    onClick={onClickCancelBtn}
                  />
                  {masterData.role === "Supplier" && (
                    <>
                      <PrimaryButton
                        text={t("Save")}
                        styles={primaryButtonStyle}
                        onClick={onClickSaveBtn}
                      />
                      <PrimaryButton
                        text={t("Submit")}
                        styles={primaryButtonStyle}
                        onClick={onClickSubmitBtn}
                      />
                    </>
                  )}
                  {masterData.role === "Buyer" && (
                    <>
                      <PrimaryButton
                        text={t("Accept")}
                        styles={primaryButtonStyle}
                        onClick={onClickAcceptBtn}
                      />
                      <PrimaryButton
                        text={t("Return")}
                        styles={primaryButtonStyle}
                        onClick={onClickReturnBtn}
                      />
                    </>
                  )}
                </Stack>
              </Stack>
              <div
                style={{
                  paddingTop: "40px",
                  paddingLeft: "1.5%",
                  paddingRight: "1.5%",
                }}
              >
                <DetailsList
                  items={
                    masterData.role === "Buyer"
                      ? allActionLogs
                      : allActionLogs.filter(
                          (log) => log.LogType !== "Accept Quote"
                        )
                  }
                  columns={IActionLogColumn}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selectionMode={SelectionMode.none}
                  onRenderRow={listRowRender}
                  styles={listStyles}
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
                {(dialogValue.Type === "Accepted" ||
                  dialogValue.Type === "Returned") && (
                  <DetailsList
                    items={[currentQuotationValue]}
                    columns={IDialogListColumn}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionMode={SelectionMode.none}
                    styles={{
                      root: {
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      },
                      headerWrapper: {
                        backgroundColor: "#AFAFAF",
                        selectors: {
                          ".ms-DetailsHeader": {
                            backgroundColor: "#BDBDBD",
                            fontWeight: 600,
                          },
                        },
                      },
                    }}
                  />
                )}
                {dialogValue.Type === "Returned" && (
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
                  {(dialogValue.Type === "Accepted" ||
                    dialogValue.Type === "Returned") && (
                    <>
                      <DefaultButton
                        onClick={() => onDialogClose()}
                        text="Cancel"
                      />
                      <PrimaryButton
                        onClick={() => onDialogConfirm()}
                        disabled={
                          dialogCommentValue.length === 0 &&
                          dialogValue.Type === "Returned"
                        }
                        text="OK"
                      />
                    </>
                  )}
                  {dialogValue.Type === "Cancel" && (
                    <>
                      <PrimaryButton
                        onClick={() => onDialogConfirm()}
                        text="Leave"
                      />
                      <DefaultButton
                        onClick={() => onDialogClose()}
                        text="Continue Editing"
                      />
                    </>
                  )}
                </DialogFooter>
              </Dialog>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceBreakDown;
