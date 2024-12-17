import React from "react";
import {
  Stack,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import {
  BasicInfoItem,
  DropdownItem,
  DatePickerItem,
  TextfieldItem,
} from "./Component";

interface FeedbackDialogProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOk: (formData: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailInfo: any;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  visible,
  onCancel,
  onOk,
  detailInfo,
}) => {
  console.log("detailInfo", detailInfo);
  const options = [
    { key: 0, text: "Proceed to e-negotiation" },
    { key: 1, text: "Return Request" },
    { key: 0, text: "Feedback to Host Buyer" },
  ];
  const reasonCodeOptions = [
    { key: 0, text: "0" },
    { key: 1, text: "1" },
    { key: 0, text: "2" },
  ];
  return (
    <Dialog
      hidden={!visible}
      onDismiss={onCancel}
      dialogContentProps={{
        type: DialogType.normal,
        title: "Responsible Buyer Feedback",
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
          tokens={{ childrenGap: 10 }}
          horizontalAlign="space-between"
        >
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <BasicInfoItem
              itemLabel="Request ID"
              itemValue={detailInfo.requestId}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <BasicInfoItem itemLabel="Parma" itemValue={detailInfo.parma} />
          </Stack>
        </Stack>
        <Stack>
          <DropdownItem
            itemLabel="Select Feedback Options"
            options={options}
            onChange={(e, option) => {
              console.log("Select Feedback Options", e, option);
            }}
          />
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="space-between"
        >
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <DatePickerItem itemLabel="Expected Effective Date" />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <DropdownItem
              itemLabel="Reason Code"
              options={reasonCodeOptions}
              onChange={(e, option) => {
                console.log("Reason Code", e, option);
              }}
            />
          </Stack>
        </Stack>
        <Stack>
          <TextfieldItem itemLabel="Comment" />
        </Stack>
      </Stack>
      <DialogFooter>
        <DefaultButton onClick={onCancel} text="Cancel" />
        <PrimaryButton
          onClick={() => {
            onOk({});
          }}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
};

interface BackDialogProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export const BackDialog: React.FC<BackDialogProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  return (
    <Dialog
      hidden={!visible}
      onDismiss={onCancel}
      dialogContentProps={{
        type: DialogType.normal,
        title: "Warning",
        subText:
          "Are you sure to leave this page? All filled contents will be lost.",
      }}
    >
      <DialogFooter>
        <PrimaryButton onClick={onOk} text="Yes" />
        <DefaultButton onClick={onCancel} text="No" />
      </DialogFooter>
    </Dialog>
  );
};
