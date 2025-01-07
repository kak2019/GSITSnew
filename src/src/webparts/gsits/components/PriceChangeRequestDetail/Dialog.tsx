/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
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
import { ISupplierRequest } from "../../../../model/priceChange";
import { REASON_CODE } from "../../../../config/const";
import { ISupplierInfoResponse } from "../../../../api";
import {
  getNextNextMonthFirstDayDate,
  getDateMinus90DaysDate,
} from "../../../../utils";

export enum FeedbackType {
  ProceedToENegotiationNotJP,
  ProceedToENegotiationCreate,
  ReturnRequest,
  FeedbackToHostbuyer,
}
interface FeedbackDialogProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (type: FeedbackType, formData?: any) => void;
  detailInfo?: ISupplierRequest;
  supplierinfo?: ISupplierInfoResponse;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  visible,
  onCancel,
  onOk,
  detailInfo,
  supplierinfo,
}) => {
  const [formData, setFormData] = useState<ISupplierRequest | undefined>();
  const [selectedFeedbackOptionKey, setSelectedFeedbackOptionKey] = useState<
    string | number | undefined
  >(0);
  const [reasonCodeKey, setReasonCodeKey] = useState<
    string | number | undefined
  >();
  const [comment, setComment] = useState<string>();

  useEffect(() => {
    setFormData(detailInfo);
  }, [detailInfo]);

  const options = [
    { key: 0, text: "Proceed to e-negotiation" },
    { key: 1, text: "Return Request" },
    { key: 2, text: "Feedback to Host Buyer" },
  ];
  const reasonCodeOptions = [
    { key: REASON_CODE.C.CODE, text: REASON_CODE.C.DESC },
    { key: REASON_CODE.O.CODE, text: REASON_CODE.O.DESC },
    { key: REASON_CODE.C.CODE, text: REASON_CODE.R.DESC },
    { key: REASON_CODE.C.CODE, text: REASON_CODE.S.DESC },
    { key: REASON_CODE.C.CODE, text: REASON_CODE.T.DESC },
    { key: REASON_CODE.C.CODE, text: REASON_CODE.W.DESC },
    { key: REASON_CODE["0"].CODE, text: REASON_CODE["0"].DESC },
    { key: REASON_CODE["1"].CODE, text: REASON_CODE["1"].DESC },
    { key: REASON_CODE["2"].CODE, text: REASON_CODE["2"].DESC },
    { key: REASON_CODE["3"].CODE, text: REASON_CODE["3"].DESC },
    { key: REASON_CODE["4"].CODE, text: REASON_CODE["4"].DESC },
    { key: REASON_CODE["6"].CODE, text: REASON_CODE["6"].DESC },
    { key: REASON_CODE["7"].CODE, text: REASON_CODE["7"].DESC },
    { key: REASON_CODE["8"].CODE, text: REASON_CODE["8"].DESC },
    { key: REASON_CODE["9"].CODE, text: REASON_CODE["9"].DESC },
  ];

  const dateAndReasonCodeRequired = useMemo(() => {
    return selectedFeedbackOptionKey === 0;
  }, [selectedFeedbackOptionKey]);
  const commentRequired = useMemo(() => {
    return selectedFeedbackOptionKey !== 0;
  }, [selectedFeedbackOptionKey]);

  const validateFields = (): boolean => {
    if (!formData) return false;
    if (selectedFeedbackOptionKey === 0) {
      return (
        !!formData.ExpectedEffectiveDateFrom &&
        (!!reasonCodeKey || reasonCodeKey === 0)
      );
    } else {
      return !!comment && !!comment.trim();
    }
  };

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
            <BasicInfoItem itemLabel="Request ID" itemValue={formData?.ID} />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <BasicInfoItem itemLabel="Parma" itemValue={formData?.Parma} />
          </Stack>
        </Stack>
        <Stack>
          <DropdownItem
            itemLabel="Select Feedback Options"
            selectedKey={selectedFeedbackOptionKey}
            options={options}
            onChange={(e, option) => {
              console.log("Select Feedback Options", e, option);
              setSelectedFeedbackOptionKey(option?.key);
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
            <DatePickerItem
              itemLabel="Expected Effective Date"
              itemValue={new Date(formData?.ExpectedEffectiveDateFrom || "")}
              required={dateAndReasonCodeRequired}
              onSelectDate={(date: Date | undefined) => {
                if (date && formData) {
                  setFormData({
                    ...formData,
                    ExpectedEffectiveDateFrom: date,
                  });
                }
              }}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <DropdownItem
              itemLabel="Reason Code"
              selectedKey={reasonCodeKey}
              options={reasonCodeOptions}
              required={dateAndReasonCodeRequired}
              onChange={(e, option) => {
                console.log("Reason Code", e, option);
                setReasonCodeKey(option?.key);
              }}
            />
          </Stack>
        </Stack>
        <Stack>
          <TextfieldItem
            itemLabel="Comment"
            itemValue={comment}
            required={commentRequired}
            onChange={(_, newValue?: string) => {
              setComment(newValue);
            }}
          />
        </Stack>
      </Stack>
      <DialogFooter>
        <DefaultButton onClick={onCancel} text="Cancel" />
        <PrimaryButton
          onClick={() => {
            // 1
            // 如果选择的proceed to e-negotiation,点击save，需要判断parma country code不是日本
            // 如果不是日本，弹出提示，点击提示中的ok，弹框关闭，formData传回去，选择的selected items更新status为requested
            // 如果是日本，点击save，需要先检验必填(date and reason code)和date的规则（大小供应商），校验通过后formData传回去，然后create一条e-negotiation记录，记录的status是in progress，弹框关闭
            // 2
            // 如果选择的是return request，点击save，先校验必填（comment），没填给出提示，满足后更新items状态到returned，并保存comment，
            // 若所有items都是returned or cancelled or closed，update request status为returned
            // 3
            // 如果选择的是feedback to host buyer，点击save，先校验必填（comment），没填给出提示，满足后update comment，并发送邮件给host buyer，items状态保持不变
            if (selectedFeedbackOptionKey === 0) {
              if (supplierinfo?.isJP) {
                // 校验必填
                const validateResult = validateFields();
                if (validateResult) {
                  // 校验时间
                  // 如果是sme，时间早于下下个月的1号，那么显示warning并重置时间到下下个月1号，如果不早于下下个月1号，则可以生成e-negotiation
                  if (supplierinfo.isSME) {
                    const nextNextMonthFirstDayDate =
                      getNextNextMonthFirstDayDate();
                    const selectDate =
                      formData?.ExpectedEffectiveDateFrom as Date;
                    if (
                      selectDate.getTime() < nextNextMonthFirstDayDate.getTime()
                    ) {
                      alert(
                        "Selected date no earlier than the first of next next month."
                      );
                      if (formData) {
                        setFormData({
                          ...formData,
                          ExpectedEffectiveDateFrom: nextNextMonthFirstDayDate,
                        });
                      }
                    } else {
                      onOk(FeedbackType.ProceedToENegotiationCreate, {
                        ...formData,
                        reasonCodeKey,
                      });
                    }
                    // 如果不是sme，时间早于当前时间减90天，那么显示warning并重置时间到当前时间减90天，如果不早于当前时间减90天，则可以生成e-negotiation
                  } else {
                    const dateMinus90DaysDate = getDateMinus90DaysDate();
                    const selectDate =
                      formData?.ExpectedEffectiveDateFrom as Date;
                    if (selectDate.getTime() < dateMinus90DaysDate.getTime()) {
                      alert("Selected date no earlier than 90 days ago.");
                      if (formData) {
                        setFormData({
                          ...formData,
                          ExpectedEffectiveDateFrom: dateMinus90DaysDate,
                        });
                      }
                    } else {
                      onOk(FeedbackType.ProceedToENegotiationCreate, {
                        ...formData,
                        reasonCodeKey,
                      });
                    }
                  }
                }
              } else {
                const bo = confirm(
                  "Selected Parma is not Japanese supplier, please continue to use CSDB system to proceed."
                );
                if (bo) onOk(FeedbackType.ProceedToENegotiationNotJP);
              }
            } else if (selectedFeedbackOptionKey === 1) {
              const validateResult = validateFields();
              if (validateResult) {
                onOk(FeedbackType.ReturnRequest, {
                  ...formData,
                  newComment: comment,
                  reasonCodeKey,
                });
              }
            } else if (selectedFeedbackOptionKey === 2) {
              const validateResult = validateFields();
              if (validateResult) {
                onOk(FeedbackType.FeedbackToHostbuyer, {
                  ...formData,
                  newComment: comment,
                  reasonCodeKey,
                });
              }
            }
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
