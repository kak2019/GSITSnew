import React, { useEffect } from "react";
import { Label, Spinner, SpinnerSize, Stack } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { useQuotation } from "../../../../hooks/useQuotation";
import { IQuotationGrid } from "../../../../model/requisition";
import { IRFQGrid } from "../../../../model/rfq";
import { useRFQ } from "../../../../hooks/useRFQ";

const PriceBreakDown: React.FC = () => {
  //#region properties
  const [, , , currentRFQ, currentRFQRequisitions, , getRFQ, , ,] = useRFQ();
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
  const [currentQuotationRFQValue, setCurrentQuotationRFQValue] =
    React.useState({} as IRFQGrid);
  const [roleValue, setRoleValue] = React.useState("");
  const CalculateFields: string[] = ["1", "2"];
  //#endregion
  //#region events
  useEffect(() => {
    // HardCode Data
    const dataInitialLoad = async (): Promise<void> => {
      await initialLoadForPriceChange("1", "1");
    };
    setRoleValue("Buyer");

    setIsLoading(true);
    getRFQ("84");
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
  const onFieldUpdate = (
    field: keyof IQuotationGrid,
    value: string | number
  ): void => {
    const currentQuotationValueDup = deepCopy(currentQuotationValue);
    const currentQuotationValueUpdated = {
      ...currentQuotationValueDup,
      [field]: value,
    };
    if (CalculateFields.indexOf(field) !== -1) {
      console.log("Update");
    }
    setCurrentQuotationValue(currentQuotationValueUpdated);
  };
  //#endregion
  //#region methods
  function save(): void {
    updateQuotation(deepCopy(currentQuotationValue));
  }
  function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
  //#endregion
  const test = (): void => {
    console.log(currentRFQ);
    console.log(currentRFQRequisitions);
  };
  return (
    <div>
      {isFetching || isLoading ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <div>
          {errorMessage.length > 0 ? (
            <label>{errorMessage}</label>
          ) : (
            <Stack
              tokens={{ childrenGap: 20, padding: 20 }}
              styles={{ root: { width: "100%" } }}
            >
              <h2 className="mainTitle">Part Price Breakdown Details</h2>
              <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 10 }}
              >
                <Label styles={{ root: { fontWeight: "bold", fontSize: 16 } }}>
                  {t("Part Basic info")}
                </Label>
              </Stack>
              <button onClick={() => test()}>tests</button>
              <input onBlur={() => onFieldUpdate("PartNumber", "000")} />
            </Stack>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceBreakDown;
