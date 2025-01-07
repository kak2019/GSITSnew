import React from "react";
import {
  TextField,
  DatePicker,
  defaultDatePickerStrings,
  DayOfWeek,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";
import styles from "./index.module.scss";

interface BasicInfoItemProps {
  itemLabel: string;
  itemValue?: string;
}
export const BasicInfoItem: React.FC<BasicInfoItemProps> = ({
  itemLabel,
  itemValue,
}) => {
  return (
    <div className={styles.basicInfoItemWrapper}>
      <div className={styles.basicInfoItemLabel}>{itemLabel}</div>
      <div className={styles.basicInfoItemValue} title={itemValue}>
        {itemValue}
      </div>
    </div>
  );
};

interface BasicInfoParmaItemProps extends BasicInfoItemProps {
  supplierNameValue?: string;
}
export const BasicInfoParmaItem: React.FC<BasicInfoParmaItemProps> = ({
  itemLabel,
  itemValue,
  supplierNameValue,
}) => {
  return (
    <div className={styles.basicInfoItemWrapper}>
      <div className={styles.basicInfoItemLabel}>{itemLabel}</div>
      <div className={styles.basicInfoItemValue + " " + styles.textEllipsis}>
        <span title={itemValue}>{itemValue}</span>
        <span
          className={styles.basicInfoSupplierNameValue}
          title={supplierNameValue}
        >
          {supplierNameValue}
        </span>
      </div>
    </div>
  );
};

interface TextfieldItemProps {
  itemLabel: string;
  itemValue?: string;
  required?: boolean;
  validate?: (value?: string) => string | undefined;
  onChange?: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => void;
}
export const TextfieldItem: React.FC<TextfieldItemProps> = ({
  itemLabel,
  itemValue,
  required = false,
  validate,
  onChange,
}) => {
  let errorMessage = undefined;
  if (required) {
    if (!itemValue?.trim()) {
      errorMessage = "Value Required";
    } else {
      errorMessage = validate?.(itemValue);
    }
  }
  return (
    <div className={styles.basicInfoItemWrapper}>
      {/* <div className={styles.basicInfoItemLabel}>{itemLabel}</div> */}
      <div>
        <TextField
          placeholder="Please input"
          label={itemLabel}
          value={itemValue}
          required={required}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

interface DatePickerItemProps {
  itemLabel: string;
  itemValue?: Date;
  required?: boolean;
  onSelectDate?: (date: Date | undefined) => void;
}
export const DatePickerItem: React.FC<DatePickerItemProps> = ({
  itemLabel,
  itemValue,
  required = false,
  onSelectDate,
}) => {
  const onFormatDate = (date?: Date): string => {
    return !date
      ? ""
      : date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  };
  return (
    <div className={styles.basicInfoItemWrapper}>
      {/* <div className={styles.basicInfoItemLabel}>{itemLabel}</div> */}
      <div>
        <DatePicker
          label={itemLabel}
          firstDayOfWeek={DayOfWeek.Sunday}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          strings={defaultDatePickerStrings}
          formatDate={onFormatDate}
          value={itemValue}
          isRequired={required}
          onSelectDate={onSelectDate}
        />
      </div>
    </div>
  );
};

interface DropdownItemProps {
  itemLabel: string;
  selectedKey?: string | number;
  selectedKeys?: string[] | number[];
  options: IDropdownOption[];
  multiSelect?: boolean;
  required?: boolean;
  onChange?: (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ) => void;
}
export const DropdownItem: React.FC<DropdownItemProps> = ({
  itemLabel,
  selectedKey,
  selectedKeys,
  options,
  multiSelect,
  required = false,
  onChange,
}) => {
  return (
    <div className={styles.basicInfoItemWrapper}>
      {/* <div className={styles.basicInfoItemLabel}>{itemLabel}</div> */}
      <div>
        <Dropdown
          label={itemLabel}
          placeholder="Please Select"
          selectedKey={selectedKey}
          selectedKeys={selectedKeys}
          onChange={onChange}
          options={options}
          multiSelect={multiSelect}
          required={required}
          errorMessage={
            required && !selectedKey && selectedKey !== 0
              ? "Value Required"
              : undefined
          }
        />
      </div>
    </div>
  );
};
