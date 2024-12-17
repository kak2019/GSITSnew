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
  itemValue: string;
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
  supplierNameValue: string;
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
  onChange?: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => void;
}
export const TextfieldItem: React.FC<TextfieldItemProps> = ({
  itemLabel,
  itemValue,
  onChange,
}) => {
  return (
    <div className={styles.basicInfoItemWrapper}>
      <div className={styles.basicInfoItemLabel}>{itemLabel}</div>
      <div>
        <TextField value={itemValue} onChange={onChange} />
      </div>
    </div>
  );
};

interface DatePickerItemProps {
  itemLabel: string;
  itemValue?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}
export const DatePickerItem: React.FC<DatePickerItemProps> = ({
  itemLabel,
  itemValue,
  onSelectDate,
}) => {
  const onFormatDate = (date?: Date): string => {
    return !date
      ? ""
      : (date.getFullYear() % 100) +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate();
  };
  return (
    <div className={styles.basicInfoItemWrapper}>
      <div className={styles.basicInfoItemLabel}>{itemLabel}</div>
      <div>
        <DatePicker
          firstDayOfWeek={DayOfWeek.Sunday}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          strings={defaultDatePickerStrings}
          formatDate={onFormatDate}
          value={itemValue}
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
  onChange,
}) => {
  return (
    <div className={styles.basicInfoItemWrapper}>
      <div className={styles.basicInfoItemLabel}>{itemLabel}</div>
      <div>
        <Dropdown
          placeholder="Please Select"
          selectedKey={selectedKey}
          selectedKeys={selectedKeys}
          onChange={onChange}
          options={options}
          multiSelect={multiSelect}
        />
      </div>
    </div>
  );
};
