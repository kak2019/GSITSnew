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
  Spinner,
  SpinnerSize,
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
import { STATUS, USER_TYPE } from "../../../../config/const";
import { formatDate } from "../../../../utils";
import { usePriceChange } from "../../../../hooks/usePriceChange";
import {
  ISupplierRequestSubItem,
  ISupplierRequestSubItemFormModel,
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

  // Joy guest测试邮箱
  // const userEmail = "1986432132@qq.com";
  let userEmail = "";
  let userName = "";
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context._pageContext) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
  }

  const [
    isFetching,
    ,
    ,
    currentPriceChangeRequest,
    currentPriceChangeRequestSubItemList,
    ,
    getSupplierRequest,
    getSupplierRequestSubitemList,
    ,
    updateSupplierRequest,
    setCurrentPriceChangeRequest,
    createSupplierRequestSubitems,
    updateSupplierRequestSubitems,
  ] = usePriceChange();

  // detail信息是否有编辑过
  const [detailInfoChange, setDetailInfoChange] = useState(false);

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

  const [, , , , createENegotiationRequest, , deleteENegotiationRequests] =
    useENegotiation();
  const [selectedItems, setSelectedItems] = useState<ISupplierRequestSubItem[]>(
    []
  );

  const [backDialogVisible, setBackDialogVisible] = useState(false);
  const [feedbackDialogVisible, setFeedbackDialogVisible] = useState(false);
  const [forwardDialogVisible, setForwardDialogVisible] = useState(false);

  const { getUserType, getGPSUser, getSupplierHostBuyerMapping } = useUser();
  const [userType, setUserType] = useState<string>("Unknown");
  const [supplierinfo, setSupplierinfo] = useState<ISupplierInfoResponse>({
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
  });

  const requestGPSUserData = async () => {
    // 获取parma和hostbuyer的mapping
    if (!currentPriceChangeRequest?.Parma) return;
    const res = await getSupplierHostBuyerMapping(
      currentPriceChangeRequest?.Parma
    );
    if (res && res instanceof Object) {
      // 获取user detail
      const result = await getGPSUser(userEmail);
      if (result && result instanceof Object) {
        // 如果所有字段都有值，更新状态
        setUserDetails({
          role: result.role,
          name: result.name,
          sectionCode: result.sectionCode,
          handlercode: result.handlercode,
          porg: result.porg,
          // 需要通过parma和buyer的mapping判断是否是hostbuyer
          isHostBuyer:
            res.SupplierHostPorg === result.porg &&
            res.SupplierHostCd === result.handlercode,
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
      setSupplierinfo(result);
    }
  };

  const requestUserTypeData = async () => {
    const type = await getUserType(userEmail);
    if (userType !== type) setUserType(type);
    if (type !== USER_TYPE.GUEST) {
      requestGPSUserData();
    } else {
      requestSupplierInfoData();
    }
  };

  const supplierRequestFolderName = "Supplier Request Attachments";
  const requestAttachmentsData = async () => {
    const initialAttachmentsValue = await getAttachments({
      FolderName: supplierRequestFolderName,
      SubFolderName: id,
      IsDataNeeded: true,
    });
    setAttachmentsValue(initialAttachmentsValue);
  };

  const requestPiceChangeData = async () => {
    await getSupplierRequest(id);
    await getSupplierRequestSubitemList(id);
    requestAttachmentsData();
  };

  useEffect(() => {
    // 首次渲染请求price change详情数据和responsible buyers数据
    requestPiceChangeData();
  }, []);

  useEffect(() => {
    // 请求完详情数据，再请求user相关数据
    requestUserTypeData();
    // 处理comment
    if (currentPriceChangeRequest && currentPriceChangeRequest.CommentHistory) {
      const comments = JSON.parse(
        currentPriceChangeRequest.CommentHistory
      ) as IComment[];
      setCommentHistoryValue(comments);
    }
  }, [currentPriceChangeRequest]);

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
      fieldName: "SupplierRequestSubitemStatus",
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
      setDetailInfoChange(true);
      // update comment api
      updateSupplierRequest({
        ...currentPriceChangeRequest,
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
          Name: userName,
        })
      );
      const currentAttachments = [...newAttachments, ...tempAttachmentsValue];
      setTempAttachmentsValue(currentAttachments);
      setDetailInfoChange(true);
    }
  };

  const handleRemoveFile = (index: number) => {
    setTempAttachmentsValue(tempAttachmentsValue.filter((_, i) => i !== index));
  };

  const handleUploadAdd = async () => {
    await postAttachments({
      FolderName: supplierRequestFolderName,
      SubFolderName: id,
      NewFileItems: tempAttachmentsValue.map((i) => i.FileItem!),
    });
    // 上传新attachment后，刷新和重置attachment数据
    requestAttachmentsData();
    setTempAttachmentsValue([]);
  };

  const requestCreateSupplierRequestSubItem = async (items: any[]) => {
    const forms: ISupplierRequestSubItemFormModel[] = items.map((item) => ({
      Porg: item.porg,
      Handler: item.handlerCode,
      HandlerName: item.handlerName,
      Section: item.sectionCode,
      RequestIDRef: id,
    }));
    await createSupplierRequestSubitems(forms);
    setForwardDialogVisible(false);
    getSupplierRequestSubitemList(id);
    // update supplier request status to in progress
    await updateSupplierRequest({
      ...currentPriceChangeRequest,
      SupplierRequestStatus: STATUS.INPROGRESS,
    });
    getSupplierRequest(id);
  };
  const handleForwardConfirm = (items: any[]): void => {
    requestCreateSupplierRequestSubItem(items);
  };

  // buttons show and enable
  // 通过role和status判断哪些内容可编辑，可显示，可点击，
  // 如何判断是supplier和buyer，buyer如何判断是host和responsible
  // 获取usertype（member和guest），如果是guest那就是supllier，如果是member那就是buyer
  // 确定是buyer后，再通过getGPSUser获取具体的用户信息
  const supplierButtonShow = useMemo(
    () => !!supplierinfo.supplierName,
    [supplierinfo]
  );
  const cancelOrResubmitSelectedButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED &&
      currentPriceChangeRequestSubItemList.length &&
      selectedItems.length &&
      selectedItems.every(
        (item) => item.SupplierRequestSubitemStatus === STATUS.RETURNED
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
      !!supplierinfo.supplierName &&
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED,
    [supplierinfo, currentPriceChangeRequest]
  );
  const attachmentEditable = useMemo(
    () =>
      (!!supplierinfo.supplierName &&
        currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED) ||
      (!!userDetails.name &&
        ![STATUS.CANCELLED, STATUS.RETURNED, STATUS.CLOSED].includes(
          currentPriceChangeRequest?.SupplierRequestStatus || ""
        )),
    [supplierinfo, userDetails, currentPriceChangeRequest]
  );
  const commentEditable = useMemo(
    () =>
      (!!supplierinfo.supplierName &&
        [STATUS.RETURNED, STATUS.NEW, STATUS.INPROGRESS].includes(
          currentPriceChangeRequest?.SupplierRequestStatus || ""
        )) ||
      !!userDetails.name,
    [supplierinfo, userDetails, currentPriceChangeRequest]
  );
  const returnRequestButtonEnable = useMemo(() => {
    const condition =
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.RETURNED;
    return condition;
  }, [currentPriceChangeRequest]);
  const forwardToResponsibleBuyerButtonEnable = useMemo(() => {
    const condition = ![
      STATUS.RETURNED,
      STATUS.CANCELLED,
      STATUS.CLOSED,
    ].includes(currentPriceChangeRequest?.SupplierRequestStatus || "");
    return condition;
  }, [currentPriceChangeRequest]);
  const removeResponsibleBuyerButtonEnable = useMemo(() => {
    const condition = ![
      STATUS.RETURNED,
      STATUS.CANCELLED,
      STATUS.CLOSED,
    ].includes(currentPriceChangeRequest?.SupplierRequestStatus || "");
    return condition;
  }, [currentPriceChangeRequest]);
  const responsibleBuyerActionButtonEnable = useMemo(() => {
    const condition =
      !userDetails.isHostBuyer &&
      currentPriceChangeRequest?.SupplierRequestStatus === STATUS.INPROGRESS &&
      selectedItems.length === 1;
    return condition;
  }, [currentPriceChangeRequest, userDetails, selectedItems]);

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

  function getLatestCommentHistory(newComment: string): string {
    const tempCommentHistoryValue = { ...commentHistoryValue };
    tempCommentHistoryValue.unshift({
      CommentDate: new Date(),
      CommentBy: userDetails.name ?? "",
      CommentText: newComment,
      CommentType: "Common",
    });
    const tempCommentHistoryValueStr = JSON.stringify(tempCommentHistoryValue);
    return tempCommentHistoryValueStr;
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
              itemValue={currentPriceChangeRequest?.ID}
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
                    `${item.CommentDate.toLocaleString()} ${item.CommentBy}: ${
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
                  <span className={styles.fileItemExtraInfo}>{file.Name}</span>
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
                      title={val.Name}
                    >
                      {val.Name}
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
                ...currentPriceChangeRequest,
                SupplierRequestStatus: STATUS.RETURNED,
              });
              getSupplierRequest(id);
            }}
            styles={buttonStyles}
            disabled={!returnRequestButtonEnable}
          />
          <PrimaryButton
            text={t("Forward to Responsible Buyer")}
            onClick={() => setForwardDialogVisible(true)}
            styles={buttonStyles}
            disabled={!forwardToResponsibleBuyerButtonEnable}
          />
          <PrimaryButton
            text={t("Remove Responsible Buyer")}
            onClick={() => {
              // 如果没有selected items，弹出提示
              // 如果selected items，判断选择的buyers有没有创建negotiation，没有创建则可以删除，否则弹出提示
              // status是in progress，则表示这个responsible buyer已创建eNegotiation
              if (selectedItems.length) {
                if (
                  selectedItems.some(
                    (item) =>
                      item.SupplierRequestSubitemStatus === STATUS.INPROGRESS
                  )
                ) {
                  alert(
                    "e-Negotiation already created, not able to remove responsible buyer."
                  );
                } else {
                  const ids = selectedItems.map((item) => item.ID);
                  deleteENegotiationRequests(ids);
                }
              } else {
                alert("Please select responsible buyer and then remove.");
              }
            }}
            styles={buttonStyles}
            disabled={!removeResponsibleBuyerButtonEnable}
          />
        </Stack>
      )}
      {/* List */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text className={styles.subHeader} variant="large">
          {t("Responsible Buyer Processing Status")}
        </Text>
        {isFetching ? (
          <Spinner label={t("Loading...")} size={SpinnerSize.large} />
        ) : (
          <DetailsList
            items={currentPriceChangeRequestSubItemList}
            columns={columns}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.multiple}
            selection={selection}
            styles={detailsListStyles}
          />
        )}
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
                SupplierRequestSubitemStatus: STATUS.CANCELLED,
              }));
              await updateSupplierRequestSubitems(forms);
              // refresh
              const updatedSubitems = await getSupplierRequestSubitemList(id);
              // 后续判断status的逻辑
              if (
                updatedSubitems.every(
                  (item) =>
                    item.SupplierRequestSubitemStatus === STATUS.CANCELLED
                )
              ) {
                await updateSupplierRequest({
                  ...currentPriceChangeRequest,
                  SupplierRequestStatus: STATUS.CANCELLED,
                });
                getSupplierRequest(id);
              }
              const subitemStatusList = Array.from(
                new Set(
                  updatedSubitems
                    .filter((item) => !!item.SupplierRequestSubitemStatus)
                    .map((item) => item.SupplierRequestSubitemStatus)
                )
              );
              if (
                subitemStatusList.length === 2 &&
                subitemStatusList.every((item) =>
                  [STATUS.CANCELLED, STATUS.RETURNED].includes(item!)
                )
              ) {
                await updateSupplierRequest({
                  ...currentPriceChangeRequest,
                  SupplierRequestStatus: STATUS.RETURNED,
                });
                getSupplierRequest(id);
              }
            }}
            disabled={!cancelOrResubmitSelectedButtonEnable}
          />
          <DefaultButton
            text={t("Resubmit Selected")}
            onClick={async () => {
              // 需要校验表单数据（必填和格式），失败则弹框提示，成功则更新request数据
              // selected items status都是returned，更新selected items status到new，更新request status到in progress，并发送邮件
              const validateResult = validateFields();
              if (validateResult) {
                // update
                if (
                  selectedItems.every(
                    (item) =>
                      item.SupplierRequestSubitemStatus === STATUS.RETURNED
                  )
                ) {
                  // update subitems
                  const forms = selectedItems.map((item) => ({
                    ...item,
                    SupplierRequestSubitemStatus: STATUS.NEW,
                  }));
                  await updateSupplierRequestSubitems(forms);
                  await getSupplierRequestSubitemList(id);
                  // update request
                  await updateSupplierRequest({
                    ...currentPriceChangeRequest,
                    SupplierRequestStatus: STATUS.INPROGRESS,
                  });
                  getSupplierRequest(id);
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
            if (detailInfoChange) {
              setBackDialogVisible(true);
            } else {
              navigate("/pricechange");
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
                  ...currentPriceChangeRequest,
                  SupplierRequestStatus: STATUS.CANCELLED,
                });
                // 更新完刷新页面
                getSupplierRequest(id);
              }}
              disabled={!cancelOrResubmitRequestButtonEnable}
            />
            <DefaultButton
              text={t("Resubmit Request")}
              onClick={async () => {
                // 需要校验表单数据（必填和格式），失败则弹框提示，成功则更新request数据
                // 若无responsible buyers，request status是returned，更新request status到new，并发送邮件
                const validateResult = validateFields();
                if (validateResult) {
                  // update
                  await updateSupplierRequest({
                    ...currentPriceChangeRequest,
                    SupplierRequestStatus: STATUS.NEW,
                  });
                  // 更新完刷新页面
                  getSupplierRequest(id);
                }
              }}
              styles={buttonStyles}
              disabled={!cancelOrResubmitRequestButtonEnable}
            />
          </>
        )}
        {!!userDetails.name && !userDetails.isHostBuyer && (
          <DefaultButton
            text={t("Responsible Buyer Action")}
            onClick={() => {
              // 校验items有没有被选择，没有的话弹出提示；若选择了，需要判断选择的items是否match userinfo，不满足弹出提示
              // 若选择是user自己的items，校验items status；如果是new则正常流程弹出responsible buyer action弹框，如果不是new，弹出提示
              if (
                selectedItems.length &&
                selectedItems[0].Porg === userDetails.porg &&
                String(selectedItems[0].Handler) === userDetails.handlercode
              ) {
                if (
                  selectedItems[0].SupplierRequestSubitemStatus === STATUS.NEW
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
        onOk={() => navigate("/pricechange")}
      />
      <FeedbackDialog
        detailInfo={currentPriceChangeRequest}
        supplierinfo={supplierinfo}
        visible={feedbackDialogVisible}
        onCancel={() => setFeedbackDialogVisible(false)}
        onOk={async (type, formData) => {
          console.log(type, formData, selectedItems);
          // request api
          if (type === FeedbackType.ProceedToENegotiationNotJP) {
            const forms = selectedItems.map((item) => ({
              ...item,
              SupplierRequestSubitemStatus: STATUS.REQUESTED,
            }));
            await updateSupplierRequestSubitems(forms);
            setFeedbackDialogVisible(false);
            await getSupplierRequestSubitemList(id);
          } else if (type === FeedbackType.ProceedToENegotiationCreate) {
            // 生成e-negotiation
            const form: IENegotiationRequestFormModel = {
              RequestID: "", // TODO 生成规则在8.3, 应该通过flow生成
              Parma: formData.Parma,
              SupplierContact: currentPriceChangeRequest.SupplierContact,
              Porg: selectedItems[0].Porg,
              Handler: String(selectedItems[0].Handler),
              ExpectedEffectiveDateFrom: formData.ExpectedEffectiveDateFrom,
              ReasonCode: formData.reasonCodeKey,
            };
            await createENegotiationRequest(form);
            // update subitems
            const forms = selectedItems.map((item) => ({
              ...item,
              SupplierRequestSubitemStatus: STATUS.INPROGRESS,
            }));
            await updateSupplierRequestSubitems(forms);
            setFeedbackDialogVisible(false);
            await getSupplierRequestSubitemList(id);
          } else if (type === FeedbackType.ReturnRequest) {
            const tempCommentHistoryValueStr = getLatestCommentHistory(
              formData.newComment
            );
            // update
            const forms = selectedItems.map((item) => ({
              ...item,
              SupplierRequestSubitemStatus: STATUS.RETURNED,
            }));
            await updateSupplierRequestSubitems(forms);
            const updatedSubitems = await getSupplierRequestSubitemList(id);
            if (
              updatedSubitems.every((item) =>
                [STATUS.RETURNED, STATUS.CANCELLED, STATUS.CLOSED].includes(
                  item.SupplierRequestSubitemStatus || ""
                )
              )
            ) {
              await updateSupplierRequest({
                ...currentPriceChangeRequest,
                CommentHistory: tempCommentHistoryValueStr,
                SupplierRequestStatus: STATUS.RETURNED,
              });
            } else {
              await updateSupplierRequest({
                ...currentPriceChangeRequest,
                CommentHistory: tempCommentHistoryValueStr,
              });
            }
            // 更新完刷新页面
            getSupplierRequest(id);
          } else if (type === FeedbackType.FeedbackToHostbuyer) {
            const tempCommentHistoryValueStr = getLatestCommentHistory(
              formData.newComment
            );
            // 只更新comment
            await updateSupplierRequest({
              ...currentPriceChangeRequest,
              CommentHistory: tempCommentHistoryValueStr,
            });
            // 更新完刷新页面
            getSupplierRequest(id);
          }
        }}
      />
      <ForwardDialog
        isOpen={forwardDialogVisible}
        onDismiss={() => setForwardDialogVisible(false)}
        onConfirm={handleForwardConfirm}
      />
    </Stack>
  );
};

export default PriceChangeRequestDetail;
