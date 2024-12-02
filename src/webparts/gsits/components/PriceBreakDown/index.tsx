/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { useQuotation } from "../../../../hooks/useQuotation";
import { IQuotationGrid } from "../../../../model/requisition";
import { IRFQGrid } from "../../../../model/rfq";

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
const { t } = useTranslation();
const [isLoading, setIsLoading] = React.useState(false);
const [currentQuotationValue, setCurrentQuotationValue] = React.useState(
  {} as IQuotationGrid
);
const [currentQuotationRFQValue, setCurrentQuotationRFQValue] = React.useState(
  {} as IRFQGrid
);
const [roleValue, setRoleValue] = React.useState("");
//#endregion
//#region events
useEffect(() => {
  // HardCode Data
  const dataInitialLoad = async (): Promise<void> => {
    await initialLoadForPriceChange("1", "1");
  };
  setRoleValue("Buyer");

  setIsLoading(true);
  dataInitialLoad()
    .then(() => {
      setIsLoading(false);
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
//#endregion
//#region methods
function save(): void {
  updateQuotation(deepCopy(currentQuotationValue));
}
function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
//#endregion
//#region html
const PriceBreakDown: React.FC = () => {
  return (
    <div>
      {isFetching || isLoading ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <div>
          {errorMessage.length > 0 ? (
            <label>{errorMessage}</label>
          ) : (
            <div> Price Break Down</div>
          )}
        </div>
      )}
    </div>
  );
};
//#endregion
export default PriceBreakDown;
