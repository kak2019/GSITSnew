/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  DefaultButton,
  TextField,
  DatePicker,
  Stack,
  Dropdown,
  IDropdownOption,
  ComboBox,
  IComboBox,
  IComboBoxOption,
  IDatePickerStrings,
  defaultDatePickerStrings,
} from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import { formatDate } from "../../../../utils";
import { buttonStyles } from "../../../../config/theme";
import { IENegotiationRequestFormModel } from "../../../../model/eNegotiation";
import { REASON_CODE_OPTIONS } from "../../../../config/const";
import {
  ISupplierInfoResponse,
  getParmaListRequest,
  getSupplierInfoRequest,
} from "../../../../api";
import {
  getNextNextMonthFirstDayDate,
  getFirstDayOfPreviousMonth,
} from "../../../../utils";

interface CreateENegotiationDialogProps {
  Porg: string;
  Handler: number;
  isOpen: boolean;
  onCancel: () => void;
  onCreate: (formData: IENegotiationRequestFormModel) => void;
}

const CreateENegotiationDialog: React.FC<CreateENegotiationDialogProps> = ({
  Porg,
  Handler,
  isOpen,
  onCancel,
  onCreate,
}) => {
  const [formData, setFormData] = useState<IENegotiationRequestFormModel>();

  const [parmaOptions, setParmaOptions] = useState<IComboBoxOption[]>([]);
  const [supplierInfo, setSupplierInfo] = useState<
    ISupplierInfoResponse | undefined
  >();
  const [minDate, setMinDate] = useState<Date>(getFirstDayOfPreviousMonth(5));
  const [expectedEffectiveDateFromError, setExpectedEffectiveDateFromError] =
    useState(false);

  const requestSupplierName = async (parma: string) => {
    try {
      const result = await getSupplierInfoRequest({ parma });
      if (result && result instanceof Object) {
        setSupplierInfo(result);
      } else {
        setSupplierInfo(undefined);
      }
    } catch (error) {
      console.log(error);
      setSupplierInfo(undefined);
    }
  };

  const handleChange = (field: string, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParmaChange = async (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption
  ): Promise<void> => {
    if (option) {
      setFormData((prev) => ({ ...prev, Parma: option.text }));
      requestSupplierName(option.text as string);
    }
  };

  const handleParmaInputValueChange = async (text: string) => {
    if (text.length < 3) {
      setParmaOptions([]);
    } else {
      try {
        const response = await getParmaListRequest(text);
        if (response && Array.isArray(response)) {
          const options = response.map((item) => ({
            key: item,
            text: item,
            title: item,
          }));
          setParmaOptions(options);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
  };

  const dateValidateStrings: IDatePickerStrings = useConst(() => ({
    ...defaultDatePickerStrings,
    isOutOfBoundsErrorMessage: `Error`,
  }));

  const validateDate = (): boolean => {
    if (!supplierInfo || !formData || !formData?.ExpectedEffectiveDateFrom)
      return false;
    if (supplierInfo.isSME) {
      const nextNextMonthFirstDayDate = getNextNextMonthFirstDayDate();
      const selectDate = formData.ExpectedEffectiveDateFrom as Date;
      const flag = selectDate.getTime() < nextNextMonthFirstDayDate.getTime();
      setExpectedEffectiveDateFromError(flag);
      return !flag;
    } else {
      const firstDayOf5MonthsAgo = getFirstDayOfPreviousMonth(5);
      const selectDate = formData.ExpectedEffectiveDateFrom as Date;
      const flag = selectDate.getTime() < firstDayOf5MonthsAgo.getTime();
      return !flag;
    }
  };

  useEffect(() => {
    if (supplierInfo) {
      if (supplierInfo.isSME) {
        setMinDate(getNextNextMonthFirstDayDate());
      } else {
        setMinDate(getFirstDayOfPreviousMonth(5));
      }
      validateDate();
    }
  }, [supplierInfo, formData?.ExpectedEffectiveDateFrom]);

  const validateEmail = (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Email is required";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }
    return undefined;
  };

  const validateFields = (): boolean => {
    if (!formData) return false;
    return (
      !!formData.Parma &&
      !!formData.Parma.trim() &&
      !!formData.SupplierContact &&
      !!formData.SupplierContact.trim() &&
      !!formData.ExpectedEffectiveDateFrom &&
      !!formData.ReasonCode
    );
  };

  function ExpectedEffectiveDateFromErrorMessage() {
    return (
      <div style={{ color: "red", fontSize: 14 }}>
        <div style={{ marginBottom: 4 }}>
          The effective date is available only the 1st day of next next month
          onwards.
        </div>
        <div style={{ marginBottom: 4 }}>
          (For Japan Subcontract act objective suppliers)
        </div>
        <div>
          If you have any case does not suite the condition, please contact with
          the UD buyer.
        </div>
      </div>
    );
  }

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={() => {
        setFormData(undefined);
        setExpectedEffectiveDateFromError(false);
        setSupplierInfo(undefined);
        onCancel();
      }}
      dialogContentProps={{
        type: DialogType.normal,
        title: "Create Price Change E-Negotiation",
      }}
      modalProps={{
        isBlocking: true,
      }}
      minWidth={800}
      maxWidth={1200}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        {expectedEffectiveDateFromError && (
          <ExpectedEffectiveDateFromErrorMessage />
        )}
        <Stack
          horizontal
          tokens={{ childrenGap: 40 }}
          horizontalAlign="start"
          style={{ alignItems: "center" }}
        >
          <Stack styles={{ root: { width: "30%" } }}>
            <ComboBox
              label="Parma"
              placeholder="Please Input"
              options={parmaOptions}
              required={true}
              autoComplete="on"
              allowFreeform={true}
              openOnKeyboardFocus={true}
              onInputValueChange={handleParmaInputValueChange}
              useComboBoxAsMenuWidth={true}
              selectedKey={formData?.Parma}
              onChange={handleParmaChange}
              errorMessage={formData?.Parma ? "" : "Value is required"}
            />
          </Stack>
          <Stack
            styles={{
              root: {
                width: "50%",
                height: "50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              },
            }}
          >
            <span>{supplierInfo?.supplierName}</span>
          </Stack>
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="space-between"
        >
          <TextField
            styles={{ root: { width: "30%" } }}
            label="Supplier Contact (Email)"
            placeholder="Please Input"
            value={formData?.SupplierContact}
            required={true}
            onChange={(e, newValue) =>
              handleChange("SupplierContact", newValue)
            }
            onGetErrorMessage={(value) => validateEmail(value || "")}
            validateOnFocusOut
          />
          <TextField
            styles={{ root: { width: "30%" } }}
            label="Porg"
            value={Porg}
            disabled
          />
          <TextField
            styles={{ root: { width: "30%" } }}
            label="Handler"
            value={String(Handler)}
            disabled
          />
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="space-between"
        >
          <Stack styles={{ root: { width: "30%" } }}>
            <DatePicker
              label="Expected Effective Date"
              placeholder="Please Select"
              strings={dateValidateStrings}
              isRequired
              value={formData?.ExpectedEffectiveDateFrom}
              onSelectDate={(date) => {
                if (date) {
                  handleChange("ExpectedEffectiveDateFrom", date);
                }
              }}
              formatDate={formatDate}
              minDate={minDate}
            />
          </Stack>
          <Dropdown
            styles={{ root: { width: "40%" } }}
            label="ReasonCode"
            placeholder="Please Select"
            selectedKey={formData?.ReasonCode}
            onChange={(_, option?: IDropdownOption) => {
              handleChange("ReasonCode", option?.key);
            }}
            options={REASON_CODE_OPTIONS}
            required={true}
            errorMessage={formData?.ReasonCode ? "" : "Value is required"}
          />
          <Stack styles={{ root: { width: "20%" } }} />
        </Stack>
      </Stack>
      {/* footer button */}
      <DialogFooter>
        <DefaultButton
          onClick={() => {
            setFormData(undefined);
            setExpectedEffectiveDateFromError(false);
            setSupplierInfo(undefined);
            onCancel();
          }}
          text="Cancel"
        />
        <PrimaryButton
          styles={buttonStyles}
          onClick={() => {
            if (!supplierInfo) {
              alert("Please select a available parma.");
              return;
            }
            if (!supplierInfo.isJP) {
              alert(
                "Selected Parma is not Japanese supplier, please continue use CSDB system to proceed. "
              );
              return;
            }
            if (validateFields()) {
              if (validateDate()) {
                onCreate({ ...formData, Porg, Handler });
              }
            }
          }}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
};

export default CreateENegotiationDialog;
