import React, { useEffect } from "react";
import {
  IconButton,
  ITextFieldStyles,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { useQuotation } from "../../../../hooks/useQuotation";
import { IQuotationGrid } from "../../../../model/requisition";
import { IRFQGrid } from "../../../../model/rfq";
import "./index.css";
import { useRFQ } from "../../../../hooks/useRFQ";
import { ITextFieldPriceBreakdown } from "./IPriceBreakDown";

const PriceBreakDown: React.FC = () => {
  //#region properties
  const [
    isFetching,
    errorMessage,
    ,
    currentQuotation,
    currentQuotationRFQ,
    ,
    ,
    initialLoadForPriceChange,
    ,
    updateQuotation,
    ,
    ,
  ] = useQuotation();
  const [, , , currentRFQ, , , getRFQ, , ,] = useRFQ();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);
  const [currentQuotationValue, setCurrentQuotationValue] = React.useState(
    {} as IQuotationGrid
  );
  const [currentQuotationRFQValue, setCurrentQuotationRFQValue] =
    React.useState({} as IRFQGrid);
  const [roleValue, setRoleValue] = React.useState("");
  const calculateFields: string[] = ["1", "2"];
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: "25px",
    },
    field: {
      height: "100%",
      fontSize: "13px",
    },
    root: { width: "13vi" },
  };
  //#endregion
  //#region fields
  const basicInfoRowOne = [
    { label: "Part Number", value: currentQuotationValue?.PartNumber },
    { label: "Qualifier", value: currentQuotationValue?.Qualifier },
    {
      label: "Part Description",
      value: currentQuotationValue?.PartDescription,
    },
    { label: "Part Issue", value: currentQuotationValue?.PartIssue },
  ];
  const basicInfoRowTwo = [
    { label: "PDrawing No.", value: currentQuotationValue?.DrawingNo },
    { label: "RFQ No.", value: currentQuotationRFQValue?.RFQNo },
    { label: "RFQ Due Date", value: currentQuotationRFQValue?.RFQDueDate },
    { label: "Status", value: currentQuotationValue?.Status },
  ];
  const basicInfoRowThree = [
    { label: "Order Type", value: currentQuotationValue?.OrderType },
    { label: "Material User", value: currentQuotationValue?.MaterialUser },
    { label: "Suffix", value: currentQuotationValue?.Suffix },
    { label: "Porg", value: currentQuotationValue?.Porg },
  ];
  const basicInfoRowFour = [
    { label: "Handler ID", value: currentQuotationValue?.HandlerId },
    { label: "Buyer Name", value: currentQuotationValue?.BuyerName },
    { label: "PARMA", value: currentQuotationValue?.PARMA },
    { label: "Supplier Name", value: currentQuotationRFQValue?.Created },
  ];
  const basicInfo = [
    basicInfoRowOne,
    basicInfoRowTwo,
    basicInfoRowThree,
    basicInfoRowFour,
  ];
  const generalInfoViewRowOne = [
    { label: "Named Place", value: currentQuotationValue?.NamedPlace },
    {
      label: "Named Place Description",
      value: currentQuotationValue?.NamedPlaceDescription,
    },
    {
      label: "Surface Treatment Code",
      value: currentQuotationValue?.SurfaceTreatmentCode,
    },
    { label: "Part Issue", value: currentQuotationValue?.PartIssue },
  ];
  const generalInfoViewRowTwo = [
    {
      label: "Country of Origin",
      value: currentQuotationValue?.CountryOfOrigin,
    },
    { label: "Order Qty", value: currentQuotationValue?.OrderQty },
    { label: "Annual Qty", value: currentQuotationValue?.AnnualQty },
    { label: "Status", value: currentQuotationValue?.Status },
  ];
  const generalInfoViewRowThree = [
    {
      label: "Order Coverate Time",
      value: currentQuotationValue?.OrderCoverageTime,
    },
    { label: "First Lot", value: currentQuotationValue?.FirstLot },
    {
      label: "Supplier Part Number",
      value: currentQuotationValue?.SupplierPartNumber,
    },
    { label: "Porg", value: currentQuotationValue?.Porg },
  ];
  const generalInfoView = [
    generalInfoViewRowOne,
    generalInfoViewRowTwo,
    generalInfoViewRowThree,
  ];
  const quoteBreakdownInfoViewRowOne = [
    { label: "Currency", value: currentQuotationValue?.Currency },
    {
      label: "Materials Costs Ttl",
      value: currentQuotationValue?.MaterialsCostsTtl,
    },
    {
      label: "Paid Prov Parts Cost",
      value: currentQuotationValue?.PaidProvPartsCost,
    },
  ];
  const quoteBreakdownInfoViewRowTwo = [
    {
      label: "Quoted Unit Price Ttl",
      value: currentQuotationValue?.QuotedUnitPriceTtl,
    },
    {
      label: "Purchased Parts Costs Ttl",
      value: currentQuotationValue?.PurchasedPartsCostsTtl,
    },
    {
      label: "Supplied Mtr Cost",
      value: currentQuotationValue?.SuppliedMtrCost,
    },
  ];
  const quoteBreakdownInfoViewRowThree = [
    { label: "Unit of Price", value: currentQuotationValue?.UnitOfPrice },
    {
      label: "Processing Costs Total",
      value: currentQuotationValue?.ProcessingCostsTtl,
    },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoViewRowFour = [
    {
      label: "Order Price Status Code",
      value: currentQuotationValue?.OrderPriceStatusCode,
    },
    {
      label: "Tooling Jig Depr Costs Ttl",
      value: currentQuotationValue?.ToolingJigDeprCostTtl,
    },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoViewRowFive = [
    {
      label: "Quoted Tooling Price Ttl",
      value: currentQuotationValue?.QuotedToolingPriceTtl,
    },
    { label: "Admin Exp/Profit", value: currentQuotationValue?.AdminExpProfit },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoViewRowSix = [
    {
      label: "Quoted One Time Payment Ttl",
      value: currentQuotationValue?.QuotedOneTimePaymentTtl,
    },
    {
      label: "Packing and Distribution Costs",
      value: currentQuotationValue?.PackingAndDistributionCosts,
    },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoViewRowSeven = [
    { label: "Blank", value: "" },
    { label: "Other", value: currentQuotationValue?.Other },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoViewRowEight = [
    { label: "Blank", value: "" },
    {
      label: "Quoted Basic Unit Price Ttl",
      value: currentQuotationValue?.QuotedBasicUnitPriceTtl,
    },
    { label: "Blank", value: "" },
  ];
  const quoteBreakdownInfoView = [
    quoteBreakdownInfoViewRowOne,
    quoteBreakdownInfoViewRowTwo,
    quoteBreakdownInfoViewRowThree,
    quoteBreakdownInfoViewRowFour,
    quoteBreakdownInfoViewRowFive,
    quoteBreakdownInfoViewRowSix,
    quoteBreakdownInfoViewRowSeven,
    quoteBreakdownInfoViewRowEight,
  ];
  const generalInfoEditRowOne: ITextFieldPriceBreakdown[] = [
    { FieldType: "Text", Label: "Named Place", Key: "NamedPlace" },
    {
      FieldType: "Text",
      Label: "Named Place Description",
      Key: "NamedPlaceDescription",
      MaxLength: 50,
    },
    {
      FieldType: "Choice",
      Label: "Surface Treatment Code",
      Key: "SurfaceTreatmentCode",
    },
  ];
  const generalInfoEditRowTwo: ITextFieldPriceBreakdown[] = [
    { FieldType: "Choice", Label: "Country of Origin", Key: "CountryOfOrigin" },
    { FieldType: "Number", Label: "Order QTY", Key: "OrderQty" },
    { FieldType: "Number", Label: "Annual Qty", Key: "AnnualQty" },
  ];
  const generalInfoEditRowThree: ITextFieldPriceBreakdown[] = [
    {
      FieldType: "Number",
      Label: "Order Coverage Time",
      Key: "OrderCoverageTime",
    },
    { FieldType: "Text", Label: "First Lot", Key: "FirstLot" },
    {
      FieldType: "Text",
      Label: "Supplier Part Number",
      Key: "SupplierPartNumber",
    },
  ];
  const generalInfoEdit = [
    generalInfoEditRowOne,
    generalInfoEditRowTwo,
    generalInfoEditRowThree,
  ];
  //#endregion
  //#region events
  useEffect(() => {
    // HardCode Data
    const dataInitialLoad = async (): Promise<void> => {
      await initialLoadForPriceChange("84", "168");
      getRFQ("84");
    };
    setRoleValue("Buyer");

    setIsLoading(true);
    dataInitialLoad()
      .then(() => {
        setIsLoading(false);
        setIsEditable(true);
      })
      .catch(() => {
        console.log(errorMessage);
        console.log(currentQuotationRFQValue);
        console.log(roleValue);
        // eslint-disable-next-line no-constant-condition
        if (false) {
          save();
        }
      });
  }, []);
  useEffect(() => {
    setCurrentQuotationValue(currentQuotation);
  }, [currentQuotation]);
  useEffect(() => {
    setCurrentQuotationRFQValue(currentQuotationRFQ);
  }, [currentQuotationRFQ]);
  const onFieldUpdate = (
    field: keyof IQuotationGrid,
    value: string | number
  ): void => {
    const currentQuotationValueDup = deepCopy(currentQuotationValue);
    const currentQuotationValueUpdated = {
      ...currentQuotationValueDup,
      [field]: value,
    };
    if (calculateFields.indexOf(field) !== -1) {
      console.log("Update");
    }
    setCurrentQuotationValue(currentQuotationValueUpdated);
  };
  const onTestSwitchEditable = (): void => {
    console.log(currentRFQ);
    setIsEditable(!deepCopy<boolean>(isEditable));
  };
  //#endregion
  //#region methods
  function save(): void {
    updateQuotation(deepCopy(currentQuotationValue));
    onFieldUpdate("BuyerName", "Test");
  }
  function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
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
              <button onClick={() => onTestSwitchEditable()}>
                Test Button
              </button>
              <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                <Text
                  variant="large"
                  style={{
                    backgroundColor: "#99CCFF",
                    padding: "5px",
                    fontWeight: "600",
                  }}
                >
                  Part Price Breakdown Details
                </Text>
                <Stack
                  tokens={{ childrenGap: 10 }}
                  styles={{
                    root: {
                      padding: "10px 1.5%",
                      border: "1px solid #ccc",
                    },
                  }}
                >
                  <Text variant="medium" style={{ fontWeight: "600" }}>
                    {t("Part Basic info")}
                  </Text>
                  {basicInfo.map((basicInfoRow, rowIndex) => {
                    return (
                      <Stack
                        key={rowIndex}
                        horizontal
                        verticalAlign="center"
                        tokens={{ childrenGap: 10 }}
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        {basicInfoRow.map((item, index) => {
                          return (
                            <Stack.Item grow key={index} align="start">
                              <Stack tokens={{ childrenGap: 10 }}>
                                <div className="labelItem">
                                  <Text variant="small" className="label">
                                    {t(item.label)}
                                  </Text>
                                  <Text variant="small" className="labelValue">
                                    {item.value ?? ""}
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
                  <Text
                    variant="medium"
                    style={{
                      fontWeight: "600",
                      padding: "0 2.5%",
                    }}
                  >
                    {t("General Info")}
                  </Text>
                  <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      styles={{
                        root: {
                          padding: "10px 1.5%",
                          backgroundColor: "#CCEEFF",
                        },
                      }}
                    >
                      {generalInfoEdit.forEach(
                        (generalInfoEditRow, rowIndex) => {
                          return (
                            <Stack
                              key={rowIndex}
                              horizontal
                              verticalAlign="center"
                              styles={{
                                root: {
                                  padding: "0 1.5%",
                                  columnGap: "calc((100%-2*1.5%)*0.055)",
                                },
                              }}
                            >
                              {generalInfoEditRow.map((item, index) => {
                                return (
                                  <Stack.Item grow key={index}>
                                    <Stack tokens={{ childrenGap: 10 }}>
                                      <div className="labelItem">
                                        <Text variant="small">
                                          {t(item.Label!)}
                                        </Text>
                                        <TextField styles={textFieldStyles} />
                                      </div>
                                    </Stack>
                                  </Stack.Item>
                                );
                              })}
                            </Stack>
                          );
                        }
                      )}
                    </Stack>
                  </Stack>
                  <Text
                    variant="medium"
                    style={{
                      fontWeight: "600",
                      padding: "0 2.5%",
                    }}
                  >
                    {t("Quote Breakdown Info")}
                  </Text>
                  <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      styles={{
                        root: {
                          padding: "10px 1.5%",
                          backgroundColor: "#CCEEFF",
                        },
                      }}
                    >
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item grow>
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">{t("Currency")}</Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item grow>
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Materials Costs Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item grow>
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="end"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Paid Prov Parts Cost")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item grow>
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Quoted Unit Price Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item grow>
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Purchased Parts Costs Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item grow>
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="end"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Supplied Mtr Cost")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">{t("Unit of Price")}</Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Proccessing Costs Total")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Order Price Status Code")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Tooling Jig Depr Cost Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Quoted Tooling Price Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Admin Exp/Profit")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack tokens={{ childrenGap: 10 }}>
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Quoted One Time Payment Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Packing and Distribution Costs")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">{t("Other")}</Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                      <Stack
                        horizontal
                        verticalAlign="center"
                        styles={{
                          root: {
                            padding: "0 1.5%",
                            columnGap: "calc((100%-2*1.5%)*0.055)",
                          },
                        }}
                      >
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          <Stack
                            tokens={{ childrenGap: 10 }}
                            horizontalAlign="center"
                          >
                            <div className="labelItem">
                              <Text variant="small">
                                {t("Quoted Basic Unit Price Ttl")}
                              </Text>
                              <TextField styles={textFieldStyles} />
                            </div>
                          </Stack>
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
                          {""}
                        </Stack.Item>
                      </Stack>
                    </Stack>
                  </Stack>
                </>
              )}
              {!isEditable && (
                <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                  <Stack
                    tokens={{ childrenGap: 10 }}
                    styles={{
                      root: {
                        padding: "10px 1.5%",
                        border: "1px solid #ccc",
                      },
                    }}
                  >
                    <Text variant="medium" style={{ fontWeight: "600" }}>
                      {t("General Info")}
                    </Text>
                    {generalInfoView.map((generalInfoViewRow, rowIndex) => {
                      return (
                        <Stack
                          key={rowIndex}
                          horizontal
                          verticalAlign="center"
                          tokens={{ childrenGap: 10 }}
                          styles={{
                            root: {
                              padding: "0 1.5%",
                              columnGap: "calc((100%-2*1.5%)*0.055)",
                            },
                          }}
                        >
                          {generalInfoViewRow.map((item, index) => {
                            return (
                              <Stack.Item grow key={index} align="start">
                                <Stack tokens={{ childrenGap: 10 }}>
                                  <div className="labelItem">
                                    <Text variant="small" className="label">
                                      {t(item.label)}
                                    </Text>
                                    <Text
                                      variant="small"
                                      className="labelValue"
                                    >
                                      {item.value}
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
                    styles={{
                      root: {
                        padding: "10px 1.5%",
                        border: "1px solid #ccc",
                      },
                    }}
                  >
                    <Text variant="medium" style={{ fontWeight: "600" }}>
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
                            styles={{
                              root: {
                                padding: "0 1.5%",
                                columnGap: "calc((100%-2*1.5%)*0.055)",
                              },
                            }}
                          >
                            {quoteBreakdownInfoViewRow.map((item, index) => {
                              return item.label === "Blank" ? (
                                <Stack.Item
                                  key={index}
                                  grow
                                  styles={{ root: { flexBasis: 0 } }}
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
                                        {item.value}
                                      </Text>
                                    </div>
                                  </Stack>
                                </Stack.Item>
                              ) : (
                                <Stack.Item
                                  grow
                                  key={index}
                                  align="start"
                                  styles={{ root: { flexBasis: 0 } }}
                                >
                                  <Stack tokens={{ childrenGap: 10 }}>
                                    <div className="labelItem">
                                      <Text variant="small" className="label">
                                        {t(item.label)}
                                      </Text>
                                      <Text
                                        variant="small"
                                        className="labelValue"
                                      >
                                        {item.value}
                                      </Text>
                                    </div>
                                  </Stack>
                                </Stack.Item>
                              );
                            })}
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
                styles={{
                  root: {
                    padding: "0 1.5%",
                    columnGap: "calc((100%-2*1.5%)*0.055)",
                  },
                }}
              >
                <Stack.Item grow={1} align="start">
                  <Stack styles={{ root: { marginTop: "20px" } }}>
                    <div
                      style={{
                        border: "1px dashed #0078d4",
                        padding: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: "#f3f9fc",
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        style={{
                          fontSize: "10px",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <IconButton
                          iconProps={{ iconName: "Attach" }}
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <div style={{ display: "inline-block" }}>
                          <span
                            role="img"
                            aria-label="paperclip"
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              marginRight: 5,
                            }}
                          >
                            {"Click to Upload"}
                          </span>
                          {
                            "(File number limit: 10; Single file size limit: 10MB)"
                          }
                        </div>
                      </label>
                    </div>
                  </Stack>
                </Stack.Item>
                <Stack.Item grow={1} align="start">
                  <Stack>
                    <Text
                      variant="medium"
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {t("Comment")}
                    </Text>
                    <Stack
                      tokens={{ childrenGap: 10 }}
                      styles={{
                        root: {
                          padding: "10px 5%",
                        },
                      }}
                    >
                      <Text
                        variant="small"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        {t("Input Comments")}
                      </Text>
                      <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <Stack.Item
                          grow={4}
                          styles={{ root: { flexBasis: 0, width: "100%" } }}
                        >
                          <TextField
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
                          />
                        </Stack.Item>
                        <Stack.Item
                          grow={1}
                          styles={{ root: { flexBasis: 0 } }}
                        >
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
                          />
                        </Stack.Item>
                      </Stack>
                      <Text
                        variant="small"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        {t("Comment History")}
                      </Text>
                      <TextField
                        multiline
                        rows={6}
                        readOnly
                        styles={{
                          field: { resize: "vertical", overflow: "auto" },
                          root: { width: "inherit" },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack.Item>
              </Stack>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceBreakDown;
