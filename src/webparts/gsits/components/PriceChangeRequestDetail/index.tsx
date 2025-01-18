/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Stack,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  PrimaryButton,
  DefaultButton,
  Text,
  Selection,
  Link,
  IconButton,
} from "@fluentui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppContext from "../../../../AppContext";
import { useUser } from "../../../../hooks";
import styles from "./index.module.scss";
import { IComment } from "../../../../types";
import { IUDGSAttachmentGridModel } from "../../../../model-v2/udgs-attachment-model";
import {
  buttonStyles,
  addButtonStyles,
  inputCommentsStyles,
  commentHistoryStyles,
  detailsListStyles,
} from "./styles";
import {
  BasicInfoItem,
  BasicInfoParmaItem,
  TextfieldItem,
  DatePickerItem,
} from "./Component";
import { BackDialog, FeedbackDialog, FeedbackType } from "./Dialog";
import ForwardDialog from "../PriceChangeRequest/ForwardDialog";
import { getSupplierInfoRequest, ISupplierInfoResponse } from "../../../../api";
import { STATUS, USER_TYPE, CONST, ROLE_TYPE } from "../../../../config/const";
import { formatDate } from "../../../../utils";
import { usePriceChange } from "../../../../hooks/usePriceChange";
import {
  ISupplierRequest,
  ISupplierRequestSubItem,
} from "../../../../model/priceChange";
import { useUDGSAttachment } from "../../../../hooks-v2/use-udgs-attachment";
import { useENegotiation } from "../../../../hooks/useENegotiation";
import { IENegotiationRequestFormModel } from "../../../../model/eNegotiation";

const PriceChangeRequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { ID: id } = location.state;
  if (!id) throw new Error("ID is required");

  let userEmail = "";
  let userName = "";
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context._pageContext) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
  }

  const [currentPriceChangeRequest, setCurrentPriceChangeRequest] =
    useState<ISupplierRequest>();
  const [
    currentPriceChangeRequestSubItemList,
    setCurrentPriceChangeRequestSubItemList,
  ] = useState<ISupplierRequestSubItem[]>([]);
  const [
    ,
    ,
    ,
    ,
    ,
    ,
    getSupplierRequest,
    getSupplierRequestSubitemList,
    ,
    updateSupplierRequest,
    ,
    ,
    updateSupplierRequestSubitems,
    deleteSupplierRequestSubitems,
  ] = usePriceChange();

  // detail info changed？
  const [detailInfoChange, setDetailInfoChange] = useState(false);
  const [attachFileChange, setAttachFileChange] = useState(false);

  const [commentValue, setCommentValue] = useState("");
  const [commentHistoryValue, setCommentHistoryValue] = useState<IComment[]>(
    []
  );

  const [, , , getAttachments, postAttachments] = useUDGSAttachment();
  const [attachmentsValue, setAttachmentsValue] = useState<
    IUDGSAttachmentGridModel[]
  >([]);
  const [tempAttachmentsValue, setTempAttachmentsValue] = useState<
    IUDGSAttachmentGridModel[]
  >([]);

  const [, , , , createENegotiationRequest, ,] = useENegotiation();
  const [selectedItems, setSelectedItems] = useState<ISupplierRequestSubItem[]>(
    []
  );

  const [backDialogVisible, setBackDialogVisible] = useState(false);
  const [feedbackDialogVisible, setFeedbackDialogVisible] = useState(false);
  const [forwardDialogVisible, setForwardDialogVisible] = useState(false);

  const { getUserType, getGPSUser, getSupplierHostBuyerMapping } = useUser();
  const [userType, setUserType] = useState<string>("Unknown");
  const [supplierInfo, setSupplierInfo] = useState<ISupplierInfoResponse>({
    supplierName: "",
    isSME: false,
    isJP: false,
  });
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: "",
    porg: "",
    isHostBuyer: false,
    isBuyer: false,
  });

  const requestGPSUserData = async () => {
    // get parma and hostbuyer mapping
    if (!currentPriceChangeRequest?.Parma) return;
    const res = await getSupplierHostBuyerMapping(
      currentPriceChangeRequest?.Parma
    );
    if (res && res instanceof Object) {
      // get user detail
      const result = await getGPSUser(userEmail);
      if (result && result instanceof Object) {
        setUserDetails({
          role: result.role,
          name: result.name,
          sectionCode: result.sectionCode,
          handlercode: result.handlercode,
          porg: result.porg,
          // validate is hostbuyer by parma and buyer mapping
          isHostBuyer:
            res.SupplierHostPorg === result.porg &&
            res.SupplierHostCd === result.handlercode,
          isBuyer: result.role === ROLE_TYPE.BUYER,
        });
      }
    }
  };

  const requestSupplierInfoData = async () => {
    if (!currentPriceChangeRequest?.Parma) return;
    const result = await getSupplierInfoRequest({
      parma: currentPriceChangeRequest?.Parma,
    });
    if (result && result instanceof Object) {
      setSupplierInfo(result);
    }
  };

  const requestUserTypeData = async () => {
    const type = await getUserType(userEmail);
    if (userType !== type) setUserType(type);
    if (type !== USER_TYPE.GUEST) {
      requestGPSUserData();
      requestSupplierInfoData();
    } else {
      requestSupplierInfoData();
    }
  };

  const requestSupplierRequest = async () => {
    const request = await getSupplierRequest(id);
    setCurrentPriceChangeRequest(request);
  };

  const requestSupplierRequestSubitemList = async () => {
    const subitemList = await getSupplierRequestSubitemList(id);
    setCurrentPriceChangeRequestSubItemList(subitemList);
  };

  const requestAttachmentsData = async () => {
    const initialAttachmentsValue = await getAttachments({
      FolderName: CONST.LIBRARY_NAME_SUPPLIERREQUESTATTACHMENTS,
      SubFolderName: id,
      IsDataNeeded: true,
    });
    setAttachmentsValue(initialAttachmentsValue);
  };

  const requestPiceChangeData = async () => {
    requestSupplierRequest();
    requestSupplierRequestSubitemList();
    requestAttachmentsData();
  };

  useEffect(() => {
    // get price change detail info and responsible buyers list
    requestPiceChangeData();
  }, []);

  useEffect(() => {
    // get user info
    requestUserTypeData();
    // handle comment
    if (currentPriceChangeRequest && currentPriceChangeRequest.CommentHistory) {
      const comments = JSON.parse(
        currentPriceChangeRequest.CommentHistory
      ) as IComment[];
      setCommentHistoryValue(comments);
    }
  }, [currentPriceChangeRequest]);

  const [, , , getENegotiationRequestList] = useENegotiation();

  const columns = [
    {
      // Buyer Org + Handler code
      key: "ResponsibleBuyer",
      name: t("Responsible Buyer"),
      fieldName: "ResponsibleBuyer",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "ResponsibleBuyerName",
      name: t("Responsible Buyer Name"),
      fieldName: "HandlerName",
      minWidth: 200,
      isResizable: true,
    },
    {
      key: "Status",
      name: t("Status"),
      fieldName: "SupplierRequestSubItemStatus",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "RFQNumber",
      name: t("RFQ No."),
      fieldName: "RFQNumber",
      minWidth: 200,
      isResizable: true,
    },
  ];

  const selection = new Selection({
    onSelectionChanged: () => {
      const items = selection.getSelection();
      setSelectedItems(items as ISupplierRequestSubItem[]);
    },
  });

  const handleCommentChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    setCommentValue(newValue ?? "");
  };

  const handleAddComment = (): void => {
    if (commentValue) {
      commentHistoryValue.unshift({
        CommentDate: new Date(),
        CommentBy: userDetails.name ?? "",
        CommentText: commentValue,
        CommentType: "Common",
      });
      setCommentHistoryValue(commentHistoryValue);
      setCommentValue("");
      // update comment api
      updateSupplierRequest({
        ID: currentPriceChangeRequest?.ID,
        CommentHistory: JSON.stringify(commentHistoryValue),
      });
    }
  };

  const handleUploadFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      if (fileList.length > 10) {
        alert("The number of uploaded files cannot exceed 10.");
        return;
      }
      if (fileList.some((file) => file.size > 1024 * 1024)) {
        alert("Uploaded file size cannot exceed 10MB.");
        return;
      }
      const newAttachments: IUDGSAttachmentGridModel[] = fileList.map(
        (file) => ({
          FileItem: file,
          FileID: "",
          URL: "",
          Name: file.name,
          CreatedBy: userName,
        })
      );
      const currentAttachments = [...newAttachments, ...tempAttachmentsValue];
      setTempAttachmentsValue(currentAttachments);
      setAttachFileChange(true);
    }
  };

  const handleRemoveFile = (index: number) => {
    setTempAttachmentsValue(tempAttachmentsValue.filter((_, i) => i !== index));
  };

  const handleUploadAdd = async () => {
    try {
      await postAttachments({
        FolderName: CONST.LIBRARY_NAME_SUPPLIERREQUESTATTACHMENTS,
        SubFolderName: id,
        NewFileItems: tempAttachmentsValue.map((i) => i.FileItem!),
      });
      // upload new attachment，refresh and reset attachment
      requestAttachmentsData();
      setTempAttachmentsValue([]);
      setAttachFileChange(false);
    } catch (error) {
      console.log("postAttachments", error);
    }
  };

  const handleForwardConfirm = (): void => {
    // refresh page
    setForwardDialogVisible(false);
    requestSupplierRequestSubitemList();
    requestSupplierRequest();
  };

  // buttons show and enable
  const supplierButtonShow = useMemo(
    () => !!supplierInfo.supplierName && !userDetails.name,
    [supplierInfo, userDetails]
  );
  const cancelOrResubmitSelectedButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequestSubItemList.length &&
      selectedItems.length &&
      selectedItems.every(
        (item) => item.SupplierRequestSubItemStatus === STATUS.RETURNED
      );
    return condition;
  }, [
    currentPriceChangeRequest,
    currentPriceChangeRequestSubItemList,
    selectedItems,
  ]);
  const cancelOrResubmitRequestButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED &&
      !currentPriceChangeRequestSubItemList.length;
    return condition;
  }, [currentPriceChangeRequest, currentPriceChangeRequestSubItemList]);
  const fieldsEditable = useMemo(
    () =>
      supplierButtonShow &&
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED,
    [supplierButtonShow, currentPriceChangeRequest]
  );
  const attachmentEditable = useMemo(
    () =>
      (supplierButtonShow &&
        currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED) ||
      (userDetails.isBuyer &&
        ![STATUS.CANCELLED, STATUS.RETURNED, STATUS.CLOSED].includes(
          currentPriceChangeRequest?.SupplierRequestStatus || ""
        )),
    [supplierButtonShow, userDetails, currentPriceChangeRequest]
  );
  const commentEditable = useMemo(
    () =>
      (supplierButtonShow &&
        [STATUS.RETURNED, STATUS.NEW, STATUS.INPROGRESS].includes(
          currentPriceChangeRequest?.SupplierRequestStatus || ""
        )) ||
      userDetails.isBuyer,
    [supplierButtonShow, userDetails, currentPriceChangeRequest]
  );
  const returnRequestButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.NEW;
    return condition;
  }, [currentPriceChangeRequest]);
  const forwardToOrRemoveResponsibleBuyerButtonEnable = useMemo(() => {
    const condition = ![
      STATUS.RETURNED,
      STATUS.CANCELLED,
      STATUS.CLOSED,
    ].includes(currentPriceChangeRequest?.SupplierRequestStatus || "");
    return condition;
  }, [currentPriceChangeRequest]);
  const responsibleBuyerActionButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.INPROGRESS &&
      userDetails.isBuyer;
    return condition;
  }, [currentPriceChangeRequest, userDetails]);

  const validateFields = (): boolean => {
    if (!currentPriceChangeRequest) return false;
    const { ExpectedEffectiveDateFrom, SupplierContact, DetailedDescription } =
      currentPriceChangeRequest;
    const SupplierContactValiate = validateEmail(SupplierContact);
    return (
      !!ExpectedEffectiveDateFrom &&
      !!SupplierContact?.trim() &&
      SupplierContactValiate === undefined &&
      !!DetailedDescription?.trim()
    );
  };

  function validateEmail(value?: string): string | undefined {
    if (!value || !value?.trim()) return "Value Required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please input a valid email address.";
    return undefined;
  }

  function getLatestCommentHistory(
    newComment: string,
    isFeedback?: boolean
  ): string {
    const tempCommentHistoryValue = [...commentHistoryValue];
    if (newComment) {
      tempCommentHistoryValue.unshift({
        CommentDate: new Date(),
        CommentBy: userDetails.name ?? "",
        CommentText: newComment,
        CommentType: isFeedback ? "Feedback" : "Common",
      });
    }
    const tempCommentHistoryValueStr = JSON.stringify(tempCommentHistoryValue);
    return tempCommentHistoryValueStr;
  }

  // sbuitems status change，update request status
  async function handleRequestStatusUpdateBySubitems() {
    // subitems的status统一处理，subitems的status对request的status的影响逻辑总结？
    // subitems全是cancelled，request是cancel
    // subitems既有cancel也有closed，request是closed
    // subitems至少有一个retnrned，其他的都是returned/calcel/closed中，request是returned
    const subitems = await getSupplierRequestSubitemList(id);
    setCurrentPriceChangeRequestSubItemList(subitems);
    if (
      subitems.every((item) =>
        [STATUS.RETURNED, STATUS.CANCELLED, STATUS.CLOSED].includes(
          item.SupplierRequestSubItemStatus || ""
        )
      ) &&
      subitems.some(
        (item) => item.SupplierRequestSubItemStatus === STATUS.RETURNED
      )
    ) {
      await updateSupplierRequest({
        ID: currentPriceChangeRequest?.ID,
        SupplierRequestStatus: STATUS.RETURNED,
      });
    }
    if (
      subitems.every(
        (item) => item.SupplierRequestSubItemStatus === STATUS.CANCELLED
      )
    ) {
      await updateSupplierRequest({
        ID: currentPriceChangeRequest?.ID,
        SupplierRequestStatus: STATUS.CANCELLED,
      });
    }
    if (
      subitems.every((item) =>
        [STATUS.CANCELLED, STATUS.CLOSED].includes(
          item.SupplierRequestSubItemStatus || ""
        )
      ) &&
      subitems.some(
        (item) => item.SupplierRequestSubItemStatus === STATUS.CLOSED
      )
    ) {
      await updateSupplierRequest({
        ID: currentPriceChangeRequest?.ID,
        SupplierRequestStatus: STATUS.CLOSED,
      });
    }
    // refresh page
    requestSupplierRequest();
  }

  async function updateSupplierRequestCommentHistory(
    newComment: string,
    isFeedback?: boolean
  ) {
    if (newComment) {
      const tempCommentHistoryValueStr = getLatestCommentHistory(
        newComment,
        isFeedback
      );
      await updateSupplierRequest({
        ID: currentPriceChangeRequest?.ID,
        CommentHistory: tempCommentHistoryValueStr,
      });
      await requestSupplierRequest();
    }
  }

  async function updateSupplierRequestSubitemsInfo(
    date: string,
    reason: string,
    status?: string
  ) {
    const forms = selectedItems.map((item) => ({
      ...item,
      ExpectedEffectiveDateFrom: new Date(date),
      ReasonCode: reason,
      SupplierRequestSubItemStatus: status ?? item.SupplierRequestSubItemStatus,
    }));
    await updateSupplierRequestSubitems(forms);
    await requestSupplierRequestSubitemList();
  }

  return (
    <Stack tokens={{ childrenGap: 20, padding: 20 }}>
      {/* Header */}
      <Text className={styles.header} variant="large">
        Price Change Request Details
      </Text>
      {/* Basic Info */}
      <Stack className={styles.content} tokens={{ childrenGap: 10 }}>
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="space-between"
        >
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem
              itemLabel={t("Request ID")}
              itemValue={currentPriceChangeRequest?.RequestID}
            />
            <BasicInfoParmaItem
              itemLabel={t("Parma")}
              itemValue={currentPriceChangeRequest?.Parma}
              supplierNameValue={currentPriceChangeRequest?.SupplierName}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem
              itemLabel={t("Request Status")}
              itemValue={currentPriceChangeRequest?.SupplierRequestStatus}
            />
            <BasicInfoItem
              itemLabel={t("Host Buyer Name")}
              itemValue={currentPriceChangeRequest?.HostBuyerName}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem
              itemLabel={t("Created By")}
              itemValue={currentPriceChangeRequest?.CreatedBy}
            />
            {fieldsEditable ? (
              <DatePickerItem
                itemLabel={t("Expected Effective Date")}
                itemValue={
                  new Date(
                    currentPriceChangeRequest?.ExpectedEffectiveDateFrom || ""
                  )
                }
                required
                onSelectDate={(date: Date | undefined) => {
                  if (date && currentPriceChangeRequest) {
                    setCurrentPriceChangeRequest({
                      ...currentPriceChangeRequest,
                      ExpectedEffectiveDateFrom: date,
                    });
                    setDetailInfoChange(true);
                  }
                }}
              />
            ) : (
              <BasicInfoItem
                itemLabel={t("Expected Effective Date")}
                itemValue={formatDate(
                  currentPriceChangeRequest?.ExpectedEffectiveDateFrom
                )}
              />
            )}
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem
              itemLabel={t("Created Date")}
              itemValue={formatDate(currentPriceChangeRequest?.CreatedDate)}
            />
            {fieldsEditable ? (
              <TextfieldItem
                itemLabel={t("Supplier Contact")}
                itemValue={currentPriceChangeRequest?.SupplierContact}
                required
                validate={validateEmail}
                onChange={(_, newValue?: string) => {
                  if (currentPriceChangeRequest) {
                    setCurrentPriceChangeRequest({
                      ...currentPriceChangeRequest,
                      SupplierContact: newValue || "",
                    });
                    setDetailInfoChange(true);
                  }
                }}
              />
            ) : (
              <BasicInfoItem
                itemLabel={t("Supplier Contact")}
                itemValue={currentPriceChangeRequest?.SupplierContact}
              />
            )}
          </Stack>
        </Stack>
        <Stack>
          {fieldsEditable ? (
            <TextfieldItem
              itemLabel={t("Detailed Description")}
              itemValue={currentPriceChangeRequest?.DetailedDescription}
              required
              onChange={(_, newValue?: string) => {
                if (currentPriceChangeRequest) {
                  setCurrentPriceChangeRequest({
                    ...currentPriceChangeRequest,
                    DetailedDescription: newValue || "",
                  });
                  setDetailInfoChange(true);
                }
              }}
            />
          ) : (
            <BasicInfoItem
              itemLabel={t("Detailed Description")}
              itemValue={currentPriceChangeRequest?.DetailedDescription}
            />
          )}
        </Stack>
      </Stack>
      {/* Comment and Attach */}
      <Stack className={styles.content} horizontal tokens={{ childrenGap: 10 }}>
        <Stack.Item grow={1} align="start" style={{ flexBasis: 0 }}>
          <Text variant="medium" className={styles.subHeader}>
            {t("Comment")}
          </Text>
          <Stack tokens={{ childrenGap: 10 }} className={styles.commentContent}>
            <Text variant="small" className={styles.fieldTitle}>
              {t("Input Comments")}
            </Text>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <Stack.Item grow={1}>
                <TextField
                  styles={inputCommentsStyles}
                  onChange={handleCommentChange}
                  value={commentValue}
                />
              </Stack.Item>
              <Stack.Item>
                <PrimaryButton
                  text={t("Add")}
                  styles={addButtonStyles}
                  onClick={handleAddComment}
                  disabled={!commentEditable}
                />
              </Stack.Item>
            </Stack>
            <Text variant="small" className={styles.fieldTitle}>
              {t("Comment History")}
            </Text>
            <TextField
              styles={commentHistoryStyles}
              multiline
              rows={7}
              readOnly
              value={commentHistoryValue
                .map(
                  (item) =>
                    `${formatDate(item.CommentDate)} ${item.CommentBy}: ${
                      item.CommentText
                    }`
                )
                .join("\n")}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item grow={1} align="start" style={{ flexBasis: 0 }}>
          <Text variant="medium" className={styles.subHeader}>
            {t("Attach File")}
          </Text>
          <Stack
            className={styles.attachmentsContent}
            tokens={{ childrenGap: 10 }}
          >
            <div>
              <div className={styles.uploadContent}>
                <div
                  className={styles.uploadArea}
                  style={{
                    cursor: !attachmentEditable ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    disabled={!attachmentEditable}
                    type="file"
                    multiple
                    style={{
                      display: "none",
                    }}
                    id="fileInput"
                    onChange={handleUploadFile}
                  />
                  <label
                    htmlFor="fileInput"
                    style={{
                      cursor: !attachmentEditable ? "not-allowed" : "pointer",
                    }}
                  >
                    <IconButton
                      iconProps={{ iconName: "Attach" }}
                      className={styles.iconUpload}
                      style={{
                        cursor: !attachmentEditable ? "not-allowed" : "pointer",
                      }}
                    />
                    <span className={styles.textUpload}>Click to Upload</span>
                    <span style={{ marginLeft: "5px", fontSize: 12 }}>
                      (File number limit: 10; Single file size limit: 10MB)
                    </span>
                  </label>
                </div>
                <PrimaryButton
                  text={t("Add")}
                  styles={addButtonStyles}
                  onClick={handleUploadAdd}
                  disabled={!attachmentEditable}
                />
              </div>
              {tempAttachmentsValue.map((file, index) => (
                <div
                  key={index}
                  className={
                    index % 2 === 0 ? styles.fileItemEven : styles.fileItemOdd
                  }
                >
                  <Text
                    style={{ flex: 1 }}
                    className={`${styles.fileItemExtraInfoTitle} ${styles.textEllipsis}`}
                  >
                    {file.FileItem?.name}
                  </Text>
                  <span className={styles.fileItemExtraInfo}>
                    {file.CreatedBy}
                  </span>
                  <span className={styles.fileItemExtraInfo}>
                    <IconButton
                      iconProps={{ iconName: "Delete" }}
                      title="Remove"
                      onClick={() => handleRemoveFile(index)}
                    />
                  </span>
                </div>
              ))}
            </div>
            <Stack className={styles.fileList}>
              {(attachmentsValue.length >= 4
                ? attachmentsValue
                : attachmentsValue.concat(
                    new Array(4 - attachmentsValue.length).fill(null)
                  )
              ).map((val, i) => {
                return val ? (
                  <div
                    key={i}
                    className={
                      i % 2 === 0 ? styles.fileItemEven : styles.fileItemOdd
                    }
                  >
                    <Link
                      style={{ flex: 1 }}
                      className={`${styles.fileItemExtraInfoTitle} ${styles.textEllipsis}`}
                      href={val.URL}
                      title={val.FileItem?.name}
                      target="_blank"
                    >
                      {val.FileItem?.name}
                    </Link>
                    <span
                      className={`${styles.fileItemExtraInfo} ${styles.textEllipsis}`}
                      title={val.CreatedBy}
                    >
                      {val.CreatedBy}
                    </span>
                    <span
                      className={`${styles.fileItemExtraInfo} ${styles.textEllipsis}`}
                    >
                      {formatDate(new Date(val?.UploadTime || ""))}
                    </span>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={
                      i % 2 === 0 ? styles.fileItemEven : styles.fileItemOdd
                    }
                  />
                );
              })}
            </Stack>
            <span style={{ fontSize: 12 }}>
              Once uploaded, the file is not able to edited or removed
            </span>
          </Stack>
        </Stack.Item>
      </Stack>
      {/* Host Buyer Action */}
      {userDetails.isHostBuyer && (
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="start"
          style={{ alignItems: "center" }}
        >
          <Text className={styles.subHeader} variant="large">
            {t("Host Buyer Action")}:
          </Text>
          <PrimaryButton
            text={t("Return Request")}
            onClick={async () => {
              // update request status to Returned and send email to supplier
              await updateSupplierRequest({
                ID: currentPriceChangeRequest?.ID,
                SupplierRequestStatus: STATUS.RETURNED,
              });
              requestSupplierRequest();
            }}
            styles={buttonStyles}
            disabled={!returnRequestButtonEnable}
          />
          <PrimaryButton
            text={t("Forward to Responsible Buyer")}
            onClick={() => setForwardDialogVisible(true)}
            styles={buttonStyles}
            disabled={!forwardToOrRemoveResponsibleBuyerButtonEnable}
          />
          <PrimaryButton
            text={t("Remove Responsible Buyer")}
            onClick={async () => {
              // if no selected items，show warning
              // if selected validate buyers had created negotiation，if no, items can be removed, if yes, show warning
              // status is in progress，responsible buyer had created eNegotiation
              if (selectedItems.length) {
                if (
                  selectedItems.some(
                    (item) =>
                      item.SupplierRequestSubItemStatus === STATUS.INPROGRESS
                  )
                ) {
                  alert(
                    "e-Negotiation already created, not able to remove responsible buyer."
                  );
                } else {
                  const ids = selectedItems.map((item) => item.ID);
                  await deleteSupplierRequestSubitems(ids);
                  handleRequestStatusUpdateBySubitems();
                }
              } else {
                alert("Please select responsible buyer and then remove.");
              }
            }}
            styles={buttonStyles}
            disabled={!forwardToOrRemoveResponsibleBuyerButtonEnable}
          />
        </Stack>
      )}
      {/* List */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text className={styles.subHeader} variant="large">
          {t("Responsible Buyer Processing Status")}
        </Text>
        <DetailsList
          items={currentPriceChangeRequestSubItemList}
          columns={columns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.multiple}
          selection={selection}
          styles={detailsListStyles}
        />
      </Stack>
      {/* Footer */}
      {supplierButtonShow && (
        <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="start">
          <DefaultButton
            text={t("Cancel Selected")}
            onClick={async () => {
              // update selected items status to Cancelled, refresh table list
              // all res buyers status are cancelled，update request status to cancelled
              // all res buyers status are cancelled or returned，update request status to returned
              const forms = selectedItems.map((item) => ({
                ...item,
                SupplierRequestSubItemStatus: STATUS.CANCELLED,
              }));
              await updateSupplierRequestSubitems(forms);
              handleRequestStatusUpdateBySubitems();
            }}
            disabled={!cancelOrResubmitSelectedButtonEnable}
          />
          <DefaultButton
            text={t("Resubmit Selected")}
            onClick={async () => {
              // validate form data(mandatory and format)，if fail show warning，if success update request data
              // selected items status is returned，update selected items status to new，update request status to in progress，then send email
              const validateResult = validateFields();
              if (validateResult) {
                if (
                  selectedItems.every(
                    (item) =>
                      item.SupplierRequestSubItemStatus === STATUS.RETURNED
                  )
                ) {
                  const bo = confirm(
                    "Please confirm you have uploaded corresponding documents and add clear comment."
                  );
                  if (!bo) return;
                  const forms = selectedItems.map((item) => ({
                    ...item,
                    SupplierRequestSubItemStatus: STATUS.NEW,
                  }));
                  await updateSupplierRequestSubitems(forms);
                  requestSupplierRequestSubitemList();
                  await updateSupplierRequest({
                    ID: currentPriceChangeRequest?.ID,
                    SupplierRequestStatus: STATUS.INPROGRESS,
                  });
                  requestSupplierRequest();
                }
              }
            }}
            styles={buttonStyles}
            disabled={!cancelOrResubmitSelectedButtonEnable}
          />
        </Stack>
      )}
      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="start">
        <DefaultButton
          text={t("Back")}
          onClick={() => {
            if (detailInfoChange || attachFileChange) {
              setBackDialogVisible(true);
            } else {
              navigate(-1);
            }
          }}
        />
        {supplierButtonShow && (
          <>
            <DefaultButton
              text={t("Cancel Request")}
              onClick={async () => {
                // update request status to Cancelled and send email to host buyer
                await updateSupplierRequest({
                  ID: currentPriceChangeRequest?.ID,
                  SupplierRequestStatus: STATUS.CANCELLED,
                });
                requestSupplierRequest();
              }}
              disabled={!cancelOrResubmitRequestButtonEnable}
            />
            <DefaultButton
              text={t("Resubmit Request")}
              onClick={async () => {
                // validate form data(mandatory and format)，if fail show warning，if success update request data
                // if no responsible buyers，request status is returned，update request status to new，then send email
                // TODO: need validate expected effective date？
                const validateResult = validateFields();
                if (validateResult) {
                  await updateSupplierRequest({
                    ID: currentPriceChangeRequest?.ID,
                    SupplierRequestStatus: STATUS.NEW,
                  });
                  requestSupplierRequest();
                }
              }}
              styles={buttonStyles}
              disabled={!cancelOrResubmitRequestButtonEnable}
            />
          </>
        )}
        {!!userDetails.name && (
          <DefaultButton
            text={t("Responsible Buyer Action")}
            onClick={() => {
              // validate items had been selected，if not show warning；if yes，validate selected items is match userinfo，if not show warning
              // if selected items match userinfo，validate items status；if is new, show responsible buyer action dialog，if not new show warning
              if (
                selectedItems.length &&
                selectedItems[0].Porg === userDetails.porg &&
                String(selectedItems[0].Handler) === userDetails.handlercode
              ) {
                if (
                  selectedItems[0].SupplierRequestSubItemStatus === STATUS.NEW
                ) {
                  setFeedbackDialogVisible(true);
                } else {
                  alert("Request has been handled, cannot change feedback.");
                }
              } else {
                alert(
                  "please select your responsible buyer record before taking any further action."
                );
              }
            }}
            styles={buttonStyles}
            disabled={!responsibleBuyerActionButtonEnable}
          />
        )}
      </Stack>
      {/* Dialog */}
      <BackDialog
        visible={backDialogVisible}
        onCancel={() => setBackDialogVisible(false)}
        onOk={() => navigate(-1)}
      />
      <FeedbackDialog
        detailInfo={currentPriceChangeRequest}
        supplierInfo={supplierInfo}
        visible={feedbackDialogVisible}
        onCancel={() => setFeedbackDialogVisible(false)}
        onOk={async (type, formData) => {
          if (type === FeedbackType.ProceedToENegotiationNotJP) {
            setFeedbackDialogVisible(false);
            const forms = selectedItems.map((item) => ({
              ...item,
              SupplierRequestSubItemStatus: STATUS.INPROGRESS,
            }));
            await updateSupplierRequestSubitems(forms);
            requestSupplierRequestSubitemList();
          } else if (type === FeedbackType.ProceedToENegotiationCreate) {
            setFeedbackDialogVisible(false);
            // create e-negotiation request, search and validate had created request by parma+byer,
            // if request had created and connected rfq status is not closed, then can not create this reqeust and show warning
            // if request not created or had created but connected rfq status is colsed, then can create reqeust
            const { Parma, ExpectedEffectiveDateFrom, ReasonCode, newComment } =
              formData;
            const { Porg, Handler } = selectedItems[0];
            const list = await getENegotiationRequestList({
              Parma,
              Porg,
              Handler,
            });
            if (
              list &&
              list.length &&
              !list.every((item) => item.RFQStatus === STATUS.CLOSED)
            ) {
              alert(
                `There is active e-Negotation for Parma ${Parma}, please be aware and close previous one and then reqeust new one`
              );
            } else {
              const form: IENegotiationRequestFormModel = {
                Parma,
                SupplierContact: currentPriceChangeRequest?.SupplierContact,
                Porg,
                Handler,
                ExpectedEffectiveDateFrom: new Date(ExpectedEffectiveDateFrom),
                ReasonCode,
                SupplierRequestIDRef: currentPriceChangeRequest?.ID,
              };
              await createENegotiationRequest(form);
              await updateSupplierRequestCommentHistory(newComment);
              await updateSupplierRequestSubitemsInfo(
                ExpectedEffectiveDateFrom,
                ReasonCode,
                STATUS.INPROGRESS
              );
            }
          } else if (type === FeedbackType.ReturnRequest) {
            setFeedbackDialogVisible(false);
            const { ExpectedEffectiveDateFrom, ReasonCode, newComment } =
              formData;
            await updateSupplierRequestCommentHistory(newComment);
            await updateSupplierRequestSubitemsInfo(
              ExpectedEffectiveDateFrom,
              ReasonCode,
              STATUS.RETURNED
            );
            handleRequestStatusUpdateBySubitems();
          } else if (type === FeedbackType.FeedbackToHostbuyer) {
            setFeedbackDialogVisible(false);
            const { ExpectedEffectiveDateFrom, ReasonCode, newComment } =
              formData;
            await updateSupplierRequestCommentHistory(newComment, true);
            await updateSupplierRequestSubitemsInfo(
              ExpectedEffectiveDateFrom,
              ReasonCode
            );
          }
        }}
      />
      <ForwardDialog
        isOpen={forwardDialogVisible}
        onDismiss={() => setForwardDialogVisible(false)}
        onConfirm={handleForwardConfirm}
        RequestIDRef={currentPriceChangeRequest?.ID || ""}
        SelectedItemStatus={
          currentPriceChangeRequest?.SupplierRequestStatus || ""
        }
      />
    </Stack>
  );
};

export default PriceChangeRequestDetail;
