import React, { useState } from "react";
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
} from "@fluentui/react";
import { formatDate } from "../../../../utils";
import { buttonStyles } from "../../../../config/theme";
import { IENegotiationRequestFormModel } from "../../../../model/eNegotiation";

// 定义 Props 接口
interface CreateENegotiationDialogProps {
  Porg: string;
  Handler: string;
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
  // 表单数据状态
  const [formData, setFormData] = useState<IENegotiationRequestFormModel>({
    Parma: "",
    SupplierContact: "",
    Porg,
    Handler,
    ExpectedEffectiveDateFrom: undefined,
    ReasonCode: "",
  });

  // 处理表单输入变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 简单的邮箱验证正则
    if (!value) {
      return "Email is required"; // 如果为空，返回错误信息
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address."; // 如果格式不正确，返回错误信息
    }
    return undefined; // 如果没有错误，返回 undefined
  };

  const generateRequestNo = (): string => {
    const now = new Date();
    const year = now.getFullYear(); // 年份
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份，补零
    const day = String(now.getDate()).padStart(2, "0"); // 日期，补零
    const hours = String(now.getHours()).padStart(2, "0"); // 小时，补零
    const minutes = String(now.getMinutes()).padStart(2, "0"); // 分钟，补零
    const seconds = String(now.getSeconds()).padStart(2, "0"); // 秒钟，补零
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0"); // 毫秒，补零
    return `${formData.Parma}${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`; // 拼接 RequestNo
  };

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onCancel}
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
        <Stack
          horizontal
          tokens={{ childrenGap: 40 }}
          horizontalAlign="start"
          style={{ alignItems: "center" }}
        >
          <Stack styles={{ root: { width: "30%" } }}>
            <TextField
              label="Parma"
              value={formData.Parma}
              required={true}
              onChange={(e, newValue) => handleChange("Parma", newValue)}
              errorMessage={formData.Parma ? "" : "Value is required"}
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
            <span>{formData.Parma}</span>
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
            value={formData.SupplierContact}
            required={true}
            onChange={(e, newValue) => handleChange("supplierEmail", newValue)}
            onGetErrorMessage={(value) => validateEmail(value || "")} // 验证邮箱格式
            validateOnFocusOut // 在失去焦点时验证
          />
          <TextField
            styles={{ root: { width: "30%" } }}
            label="Porg"
            value={formData.Porg}
            disabled
          />
          <TextField
            styles={{ root: { width: "30%" } }}
            label="Handler"
            value={formData.Handler}
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
              placeholder="Please select date"
              isRequired
              value={
                formData.ExpectedEffectiveDateFrom
                  ? new Date(formData.ExpectedEffectiveDateFrom)
                  : undefined
              }
              onSelectDate={(date) => {
                if (date) {
                  const formattedDate = formatDate(date);
                  handleChange("expectedEffectiveDate", formattedDate);
                }
              }}
              formatDate={formatDate} // 控制显示的日期格式
            />
          </Stack>
          <Dropdown
            styles={{ root: { width: "30%" } }}
            label="ReasonCode"
            placeholder="Please Select"
            selectedKey={formData.ReasonCode}
            onChange={(_, option?: IDropdownOption) => {
              handleChange("ReasonCode", option?.key);
            }}
            options={[
              { key: "0", text: "0" },
              { key: "1", text: "1" },
            ]}
            required={true}
            errorMessage={formData.ReasonCode ? "" : "Value is required"}
          />
          <Stack styles={{ root: { width: "30%" } }} />
        </Stack>
      </Stack>
      {/* 底部按钮 */}
      <DialogFooter>
        <DefaultButton onClick={onCancel} text="Cancel" />
        <PrimaryButton
          styles={buttonStyles}
          onClick={() => {
            const RequestID = generateRequestNo(); //generate reqeust no
            onCreate({ ...formData, RequestID });
          }}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
};

export default CreateENegotiationDialog;
