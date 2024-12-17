import React, { useEffect, useState, useContext } from "react";
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
import { getAADClient } from "../../../../pnpjsConfig";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
import { useUser } from "../../../../hooks";
import { boolean } from "yup";
import styles from "./index.module.scss";
import { IComment, IAttachment } from "../../../../types";
import {
  buttonStyles,
  addButtonStyles,
  inputCommentsStyles,
  commentHistoryStyles,
  detailsListStyles,
} from "./styles";
import { BasicInfoItem, BasicInfoParmaItem } from "./Component";
import { BackDialog, FeedbackDialog } from "./Dialog";

interface IDetailsListItem {
  HandlerCode: string;
  ResponsibleBuyerName: string;
  Status: string;
  RFQNumber: string;
}

const PriceChangeRequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  console.log("location", location);

  let userEmail = "";
  let userName = "";
  let webURL = "";
  let Site_Relative_Links = "";
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
    webURL = ctx.context?._pageContext?._web?.absoluteUrl;
    Site_Relative_Links = webURL.slice(webURL.indexOf("/sites"));
    console.log(userName, Site_Relative_Links);
  }

  const [currentPCR] = useState("");
  console.log("currentPCR", currentPCR);
  const [commentValue, setCommentValue] = useState("");
  const [commentHistoryValue, setCommentHistoryValue] = useState<IComment[]>(
    []
  );
  const [attachmentsValue, setAttachmentsValue] = useState<IAttachment[]>([]);
  const [responsibleBuyers] = useState<IDetailsListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<IDetailsListItem[]>([]);
  console.log("selectedItems", selectedItems);

  const [supplierinfo] = useState({
    SupplierName: "",
    IsSme: boolean,
    CountryCode: "",
  });
  console.log("supplierinfo", supplierinfo);

  const [userType, setUserType] = useState<string>("Unknown");
  const { getUserType, getUserSupplierId, getGPSUser } = useUser();
  console.log("getUserSupplierId, getGPSUser", getUserSupplierId, getGPSUser);

  // 通过role和status判断哪些内容可编辑，可显示，可点击，
  const [isEditable, setIsEditable] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: "",
  });
  console.log("userDetails", userDetails);

  const [backDialogVisible, setBackDialogVisible] = useState(false);
  const [feedbackDialogVisible, setFeedbackDialogVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      try {
        const client = getAADClient(); // 请确保getAADClient()已正确实现
        // 使用模板字符串构建完整的函数URL
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser/${userEmail}`;
        const response = await client.get(
          functionUrl,
          AadHttpClient.configurations.v1
        );
        // 确保解析 response 时不抛出错误
        const result = await response.json();
        console.log(result, "dsdsd");
        if (
          result &&
          result.role &&
          result.name &&
          result.sectionCode &&
          result.handlercode
        ) {
          // 如果所有字段都有值，更新状态
          setUserDetails({
            role: result.role,
            name: result.name,
            sectionCode: result.sectionCode,
            handlercode: result.handlercode,
          });
          // 通过用户role和request status，判断一些action是否可编辑，
          setIsEditable(true);
        } else {
          console.warn("Incomplete data received:", result);
        }
      } catch (error) {
        console.error("Error fetching GPS user props:", error);
      }
    };

    // 调用 getUserType 并根据结果执行逻辑
    getUserType(userEmail)
      .then((type) => {
        if (userType !== type) {
          // 只有当 userType 变化时才更新状态
          setUserType(type);
          console.log("UserType updated to: ", userType);
        }
        if (type !== "Guest") {
          fetchData().then(
            (_) => _,
            (_) => _
          );
        }
      })
      .catch((e) => console.error("Error fetching GPS user props:", e));
  }, [userType]);

  const columns = [
    {
      key: "HandlerCode",
      name: t("Handler Code"),
      fieldName: "HandlerCode",
      minWidth: 150,
    },
    {
      key: "ResponsibleBuyerName",
      name: t("Responsible Buyer Name"),
      fieldName: "ResponsibleBuyerName",
      minWidth: 200,
    },
    {
      key: "Status",
      name: t("Status"),
      fieldName: "Status",
      minWidth: 150,
    },
    {
      key: "RFQNumber",
      name: t("RFQ Numberr"),
      fieldName: "RFQNumber",
      minWidth: 200,
    },
  ];

  const selection = new Selection({
    onSelectionChanged: () => {
      const items = selection.getSelection(); // 获取选中的记录
      setSelectedItems(items as IDetailsListItem[]); // 将选中的记录存入状态
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
      commentHistoryValue.push({
        CommentDate: new Date(),
        CommentBy: userDetails.name ?? "",
        CommentText: commentValue,
        CommentType: "Common",
      });
      setCommentHistoryValue(commentHistoryValue);
      setCommentValue("");
      // update comment api
    }
  };

  const handleUploadFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        File: file,
        Url: "",
      }));
      const currentAttachments = [...attachmentsValue, ...newAttachments];
      setAttachmentsValue(currentAttachments);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 20, padding: 20 }}>
      {/* Header */}
      <Text className={styles.header} variant="xxLarge">
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
            <BasicInfoItem itemLabel="Parma" itemValue={"currentPCR"} />
            <BasicInfoParmaItem
              itemLabel="Request ID"
              itemValue={"currentPCR"}
              supplierNameValue={"currentPCR"}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem
              itemLabel="Request Status"
              itemValue={"currentPCR"}
            />
            <BasicInfoItem
              itemLabel="Host Buyer Name"
              itemValue={"currentPCR"}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem itemLabel="Created By" itemValue={"currentPCR"} />
            <BasicInfoItem
              itemLabel="Expected Effective Date"
              itemValue={"currentPCR"}
            />
          </Stack>
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "25%" } }}
          >
            <BasicInfoItem itemLabel="Created Date" itemValue={"currentPCR"} />
            <BasicInfoItem
              itemLabel="Supplier Contact(Email)"
              itemValue={"currentPCR"}
            />
          </Stack>
        </Stack>
        <Stack>
          <BasicInfoItem
            itemLabel="Detailed Description"
            itemValue={"currentPCR"}
          />
        </Stack>
      </Stack>
      {/* Comment and Attach */}
      <Stack className={styles.content} horizontal tokens={{ childrenGap: 10 }}>
        <Stack.Item grow={1}>
          <Text variant="medium" className={styles.subHeader}>
            {t("Comment")}
          </Text>
          <Stack tokens={{ childrenGap: 10 }} className={styles.commentContent}>
            <Text variant="small" className={styles.fieldTitle}>
              {t("Input Comments")}
            </Text>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <Stack.Item grow={4}>
                <TextField
                  onChange={handleCommentChange}
                  styles={inputCommentsStyles}
                />
              </Stack.Item>
              <Stack.Item grow={1}>
                <PrimaryButton
                  text="Add"
                  styles={addButtonStyles}
                  onClick={handleAddComment}
                />
              </Stack.Item>
            </Stack>
            <Text variant="small" className={styles.fieldTitle}>
              {t("Comment History")}
            </Text>
            <TextField
              multiline
              rows={8}
              readOnly
              value={commentHistoryValue
                .map(
                  (item) =>
                    `${item.CommentDate.toLocaleString()} ${item.CommentBy}: ${
                      item.CommentText
                    }`
                )
                .join("\n")}
              styles={commentHistoryStyles}
            />
          </Stack>
        </Stack.Item>
        <Stack.Item grow={1}>
          <Text variant="medium" className={styles.subHeader}>
            {t("Attachments")}
          </Text>
          <Stack
            className={styles.attachmentsContent}
            tokens={{ childrenGap: 10 }}
          >
            {isEditable && (
              <>
                <div>
                  <Text variant="medium">Please download template</Text>
                  <Link href="" style={{ marginLeft: "5px" }}>
                    here
                  </Link>
                </div>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    id="file-input"
                    onChange={handleUploadFile}
                  />
                  <label htmlFor="file-input">
                    <IconButton
                      iconProps={{ iconName: "Attach" }}
                      className={styles.iconUpload}
                    />
                    <div style={{ display: "inline-block" }}>
                      <span
                        role="img"
                        aria-label="paperclip"
                        className={styles.textUpload}
                      >
                        Click to Upload
                      </span>
                      <span style={{ marginLeft: "5px" }}>
                        (File number limit: 10; Single file size limit: 10MB)
                      </span>
                    </div>
                  </label>
                </div>
              </>
            )}
            <Stack className={styles.fileList}>
              {(attachmentsValue.length >= 4
                ? attachmentsValue
                : attachmentsValue.concat(
                    new Array(4 - attachmentsValue.length).fill(null)
                  )
              ).map((val, i) => {
                return val ? (
                  <div
                    className={
                      i % 2 === 0 ? styles.fileItemEven : styles.fileItemOdd
                    }
                  >
                    <Link href={val.Url}>{val.File.name}</Link>
                  </div>
                ) : (
                  <div
                    className={
                      i % 2 === 0 ? styles.fileItemEven : styles.fileItemOdd
                    }
                  />
                );
              })}
            </Stack>
            <span>
              Once uploaded, the file is not able to edited or removed
            </span>
          </Stack>
        </Stack.Item>
      </Stack>
      {/* Host Buyer Action */}
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        horizontalAlign="start"
        style={{ alignItems: "center" }}
      >
        <Text className={styles.subHeader} variant="large">
          Host Buyer Action:{" "}
        </Text>
        <PrimaryButton
          text={t("Return Request")}
          onClick={() => {
            // show dialog
          }}
          styles={buttonStyles}
        />
        <PrimaryButton
          text={t("Forward to Responsible Buyer")}
          onClick={() => {
            // show dialog
          }}
          styles={buttonStyles}
        />
        <PrimaryButton
          text={t("Remove Responsible Buyer")}
          onClick={() => {
            // show dialog
          }}
          styles={buttonStyles}
        />
      </Stack>
      {/* List */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text className={styles.subHeader} variant="large">
          Responsible Buyer Processing
        </Text>
        <DetailsList
          items={responsibleBuyers}
          columns={columns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.multiple}
          selection={selection}
          styles={detailsListStyles}
        />
      </Stack>
      {/* Footer */}
      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="start">
        <DefaultButton text="Back" onClick={() => setBackDialogVisible(true)} />
        <DefaultButton
          text={t("Cancel Request")}
          onClick={() => {
            // show dialog
          }}
        />
        <DefaultButton
          text={t("Resubmit Request")}
          onClick={() => {
            // show dialog
          }}
          styles={buttonStyles}
        />
        <DefaultButton
          text={t("Responsible Buyer Action")}
          onClick={() => {
            setFeedbackDialogVisible(true);
          }}
          styles={buttonStyles}
        />
      </Stack>
      {/* Dialog */}
      <BackDialog
        visible={backDialogVisible}
        onCancel={() => setBackDialogVisible(false)}
        onOk={() => navigate("/pricechange")}
      />
      <FeedbackDialog
        detailInfo={{ requestId: "1", parma: "2" }}
        visible={feedbackDialogVisible}
        onCancel={() => setFeedbackDialogVisible(false)}
        onOk={(formData) => {
          console.log(formData);
          // request api
        }}
      />
    </Stack>
  );
};

export default PriceChangeRequestDetail;
