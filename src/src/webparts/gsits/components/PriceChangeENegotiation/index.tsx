/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Stack,
  TextField,
  Dropdown,
  PrimaryButton,
  DetailsList,
  IColumn,
  Selection,
  SelectionMode,
  Icon,
  Label,
  TooltipHost,
  DatePicker,
  Spinner,
  SpinnerSize,
  IconButton,
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import AppContext from "../../../../AppContext";
import theme, { buttonStyles } from "../../../../config/theme";
import styles from "./index.module.scss";
import { STATUS } from "../../../../config/const";
import { formatDate } from "../../../../utils";
import CreateENegotiationDialog from "./CreateENegotiationDialog";
import { useUser } from "../../../../hooks";
import {
  IENegotiationRequestCreteriaModel,
  IENegotiationRequest,
} from "../../../../model/eNegotiation";

const PriceChangeRequest: React.FC = () => {
  const { t } = useTranslation();

  let userEmail = "";
  let userName = "";
  let webURL = "";
  let Site_Relative_Links = "";
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context._pageContext) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    console.log("ctx", ctx.context._pageContext);
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
    webURL = ctx.context?._pageContext?._web?.absoluteUrl;
    Site_Relative_Links = webURL.slice(webURL.indexOf("/sites"));
    console.log(userName, Site_Relative_Links);
  }

  const [isFetching] = useState(false);
  const [isCreateENegotiationDialogOpen, setIsCreateENegotiationDialogOpen] =
    useState(false);
  const [isCreateRFQDialogOpen, setIsCreateEFQDialogOpen] = useState(false);
  console.log("isCreateRFQDialogOpen", isCreateRFQDialogOpen);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [searchConditions, setSearchConditions] =
    useState<IENegotiationRequestCreteriaModel>({
      Buyer: "",
      RFQNo: "",
      ExpectedEffectiveDateFrom: undefined,
      ExpectedEffectiveDateTo: undefined,
      Parma: "",
      SupplierRequestID: "",
      Status: [] as string[],
    });

  const { getUserType, getGPSUser } = useUser();
  const [userType, setUserType] = useState<string>("Unknown");
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: "",
    porg: "porg",
  });

  const requestGPSUserData = async () => {
    const result = await getGPSUser(userEmail);
    if (result && result instanceof Object) {
      // 如果所有字段都有值，更新状态
      setUserDetails({
        role: result.role,
        name: result.name,
        sectionCode: result.sectionCode,
        handlercode: result.handlercode,
        porg: "porg",
      });
    }
  };

  const [eNegotiationList, setENegotiationList] = useState<
    IENegotiationRequest[]
  >([]);
  const requestPiceChangeENegotiationData = async (
    creteria: IENegotiationRequestCreteriaModel
  ) => {
    console.log("creteria", creteria);
    const data: IENegotiationRequest[] = [
      {
        ID: "1",
        RequestID: "345678901234",
        Parma: "212432",
        Porg: "UDT 21",
        Handler: "First Last Name",
        ExpectedEffectiveDateFrom: new Date(),
        Status: "Requested",
      },
    ];
    setENegotiationList(data);
  };

  const requestUserTypeData = async () => {
    const type = await getUserType(userEmail);
    if (userType !== type) setUserType(type);
    if (type === "Member") {
      requestGPSUserData();
      // 如果是buyer，再请求price change e-negotiation列表数据
      requestPiceChangeENegotiationData(searchConditions);
    }
  };

  useEffect(() => {
    // 请求user相关数据
    requestUserTypeData();
  }, []);

  // list相关
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return eNegotiationList.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, eNegotiationList]);
  const totalPages = Math.max(
    1,
    Math.ceil(eNegotiationList.length / itemsPerPage)
  );
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (
    key: keyof typeof searchConditions,
    value: string | string[] | Date | undefined
  ): void => {
    setSearchConditions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchClick = (): void => {
    const filters = {
      ...searchConditions,
      expectedeffectivedatefrom: searchConditions.ExpectedEffectiveDateFrom
        ? new Date(searchConditions.ExpectedEffectiveDateFrom)
        : "",
      expectedeffectivedateto: searchConditions.ExpectedEffectiveDateTo
        ? new Date(searchConditions.ExpectedEffectiveDateTo)
        : "",
    };
    setCurrentPage(1);
    requestPiceChangeENegotiationData(filters);
  };

  const handleCreateENegotiation = (formData: any): void => {
    console.log("Create e-negotiation Request Data:", formData);
    setIsCreateENegotiationDialogOpen(false);
  };

  const StatusOptions = [
    { key: STATUS.NEW, text: STATUS.NEW },
    { key: STATUS.INPROGRESS, text: STATUS.INPROGRESS },
    { key: STATUS.SENTTOGPS, text: STATUS.SENTTOGPS },
    { key: STATUS.CLOSED, text: STATUS.CLOSED },
  ];

  const columns: IColumn[] = [
    {
      key: "RequestID",
      name: t("Request ID"),
      fieldName: "RequestID",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "Porg",
      name: t("Buyer"),
      fieldName: "Porg",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "Handler",
      name: t("Handler Name"),
      fieldName: "Handler",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "Parma",
      name: t("Parma"),
      fieldName: "Parma",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "ExpectedEffectiveDate",
      name: t("Expected Effective Date"),
      fieldName: "ExpectedEffectiveDateFrom",
      minWidth: 150,
      isResizable: true,
      onRender: (item: IENegotiationRequest) => (
        <span>{formatDate(item.ExpectedEffectiveDateFrom)}</span>
      ),
    },
    {
      key: "ReasonCode",
      name: t("Reason Code"),
      fieldName: "ReasonCode",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "NegotiationNo",
      name: t("Negotiation Number"),
      fieldName: "NegotiationNo",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "RFQNo",
      name: t("RFQ No."),
      fieldName: "RFQNo",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "RFQStatus",
      name: t("RFQ Status"),
      fieldName: "RFQStatus",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "CreatedDate",
      name: t("Request Created Date"),
      fieldName: "CreatedDate",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "SupplierRequestIDRef",
      name: t("Supplier Request ID"),
      fieldName: "SupplierRequestIDRef",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "SupplierContact",
      name: t("Supplier Contact Email"),
      fieldName: "SupplierContact",
      minWidth: 150,
      isResizable: true,
    },
  ];

  const selection = new Selection({
    onSelectionChanged: () => {
      console.log("Selected Items:", selection.getSelection());
    },
  });

  const fieldWithTooltip = (
    label: string,
    tooltip: string,
    field: JSX.Element
  ) => {
    return (
      <div
        style={{ display: "grid", gridTemplateRows: "auto auto", gap: "3px" }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}
        >
          <span
            style={{ marginRight: "8px", fontSize: "14px", fontWeight: "500" }}
          >
            {label}
          </span>
          <TooltipHost content={tooltip} calloutProps={{ gapSpace: 0 }}>
            <Icon
              iconName="Info"
              styles={{
                root: {
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#0078D4",
                },
              }}
            />
          </TooltipHost>
        </div>
        {field}
      </div>
    );
  };

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          width: "100%",
          paddingTop: 0, // 去掉顶部空白
          paddingLeft: 20, // 保留左右空白
          paddingRight: 20,
          paddingBottom: 0, // 保留左右空白
          margin: "0",
        },
      }}
    >
      <h2 className={styles.mainTitle}>Price Change E-Negotiation</h2>
      {/* 搜索栏 */}
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        className={styles.noMargin}
        styles={{
          root: {
            backgroundColor: "white",
            padding: "0",
            cursor: "pointer",
            margin: 0,
          },
        }}
        onClick={() => setIsSearchVisible(!isSearchVisible)}
      >
        <Icon
          iconName={isSearchVisible ? "ChevronDown" : "ChevronRight"}
          style={{ fontSize: 16 }}
        />
        <Label styles={{ root: { fontWeight: "bold" } }}>{t("Search")}</Label>
      </Stack>
      {/* 搜索区域 */}
      {isSearchVisible && (
        <Stack
          className={styles.noMargin}
          styles={{
            root: {
              ...theme.searchbarforPriceChange,
            },
          }}
          tokens={{ childrenGap: 10 }}
        >
          {fieldWithTooltip(
            t("Buyer"),
            t("Search by Org/Handler Code/Name"),
            <TextField
              styles={theme.TextfieldStyles}
              value={searchConditions.Buyer}
              onChange={(e, newValue) =>
                handleSearchChange("Buyer", newValue || "")
              }
            />
          )}
          <TextField
            styles={theme.TextfieldStyles}
            label={t("RFQ No")}
            value={searchConditions.RFQNo}
            onChange={(e, newValue) =>
              handleSearchChange("RFQNo", newValue || "")
            }
          />
          <DatePicker
            label={t("Expected Effective Date From")}
            allowTextInput
            styles={{
              root: {
                width: "100%",
                maxWidth: "300px",
                marginBottom: "10px",
              },
              textField: {
                height: "30px", // 控制输入框高度
                fontSize: "12px",
              },

              callout: {
                fontSize: "12px", // 日期选择器的字体大小
              },
            }}
            value={
              searchConditions.ExpectedEffectiveDateFrom
                ? new Date(searchConditions.ExpectedEffectiveDateFrom)
                : undefined
            }
            onSelectDate={(date) => {
              if (date) {
                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                handleSearchChange("ExpectedEffectiveDateFrom", formattedDate); // 保存格式化后的日期
              } else {
                handleSearchChange("ExpectedEffectiveDateFrom", "");
              }
            }}
            formatDate={formatDate}
          />
          <DatePicker
            label={t("Expected Effective Date To")}
            allowTextInput
            styles={{
              root: {
                width: "100%",
                maxWidth: "300px",
                marginBottom: "10px",
              },
              textField: {
                height: "30px", // 控制输入框高度
                fontSize: "12px",
              },

              callout: {
                fontSize: "12px", // 日期选择器的字体大小
              },
            }}
            value={
              searchConditions.ExpectedEffectiveDateTo
                ? new Date(searchConditions.ExpectedEffectiveDateTo)
                : undefined
            }
            onSelectDate={(date) => {
              if (date) {
                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                handleSearchChange("ExpectedEffectiveDateTo", formattedDate); // 保存格式化后的日期
              } else {
                handleSearchChange("ExpectedEffectiveDateTo", "");
              }
            }}
            formatDate={formatDate}
          />
          <TextField
            label={t("Parma")}
            value={searchConditions.Parma}
            onChange={(e, newValue) =>
              handleSearchChange("Parma", newValue || "")
            }
            styles={theme.TextfieldStyles}
          />
          <TextField
            label={t("Supplier Request ID")}
            value={searchConditions.SupplierRequestID}
            onChange={(e, newValue) =>
              handleSearchChange("SupplierRequestID", newValue || "")
            }
            styles={theme.TextfieldStyles}
          />
          <Dropdown
            label={t("Status")}
            styles={theme.DropDownfieldStyles}
            selectedKey={searchConditions.Status}
            options={StatusOptions}
            onChange={(e, option) =>
              handleSearchChange("Status", option ? [option.key as string] : [])
            }
          />
          <Stack.Item
            style={{
              gridRow: "2",
              gridColumn: "4",
              justifySelf: "end",
              alignSelf: "end",
            }}
          >
            <PrimaryButton
              text={t("Search")}
              styles={buttonStyles}
              onClick={handleSearchClick}
            />
          </Stack.Item>
        </Stack>
      )}
      {/* 表格区域 */}
      {isFetching ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <Stack>
          <DetailsList
            items={paginatedItems}
            columns={columns}
            getKey={(item: IENegotiationRequest) => item.ID}
            selectionMode={SelectionMode.single}
            selection={selection}
            styles={{
              root: theme.detaillist.root,
              contentWrapper: theme.detaillist.contentWrapper,
              headerWrapper: theme.detaillist.headerWrapper,
            }}
            viewport={{
              height: 0,
              width: 0,
            }}
          />
          {/* 页码 */}
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
            styles={{
              root: {
                ...theme.paginated.paginatedbackground,
              },
            }}
          >
            <IconButton
              iconProps={{ iconName: "DoubleChevronLeft" }}
              title="First Page"
              ariaLabel="First Page"
              disabled={currentPage === 1}
              onClick={() => goToPage(1)}
              styles={{
                root: {
                  ...theme.paginated.paginatedicon.root,
                },
                icon: {
                  ...theme.paginated.paginatedicon.icon,
                },
                rootHovered: {
                  ...theme.paginated.paginatedicon.rootHovered,
                },
                rootDisabled: {
                  ...theme.paginated.paginatedicon.rootDisabled,
                },
              }}
            />
            <IconButton
              iconProps={{ iconName: "ChevronLeft" }}
              title="Previous Page"
              ariaLabel="Previous Page"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              styles={{
                root: {
                  ...theme.paginated.paginatedicon.root,
                },
                icon: {
                  ...theme.paginated.paginatedicon.icon,
                },
                rootHovered: {
                  ...theme.paginated.paginatedicon.rootHovered,
                },
                rootDisabled: {
                  ...theme.paginated.paginatedicon.rootDisabled,
                },
              }}
            />
            <Label styles={{ root: { alignSelf: "center" } }}>
              Page {currentPage} of {totalPages}
            </Label>
            <IconButton
              iconProps={{ iconName: "ChevronRight" }}
              title="Next Page"
              ariaLabel="Next Page"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              styles={{
                root: {
                  ...theme.paginated.paginatedicon.root,
                },
                icon: {
                  ...theme.paginated.paginatedicon.icon,
                },
                rootHovered: {
                  ...theme.paginated.paginatedicon.rootHovered,
                },
                rootDisabled: {
                  ...theme.paginated.paginatedicon.rootDisabled,
                },
              }}
            />
            <IconButton
              iconProps={{ iconName: "DoubleChevronRight" }}
              title="Last Page"
              ariaLabel="Last Page"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(totalPages)}
              styles={{
                root: {
                  ...theme.paginated.paginatedicon.root,
                },
                icon: {
                  ...theme.paginated.paginatedicon.icon,
                },
                rootHovered: {
                  ...theme.paginated.paginatedicon.rootHovered,
                },
                rootDisabled: {
                  ...theme.paginated.paginatedicon.rootDisabled,
                },
              }}
            />
          </Stack>
        </Stack>
      )}
      {userDetails.porg && (
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          horizontalAlign="start"
          style={{ alignItems: "center" }}
        >
          <PrimaryButton
            text={t("Create E-Negotiation")}
            onClick={() => setIsCreateENegotiationDialogOpen(true)}
            styles={{
              ...theme.buttonStyles,
              root: { ...buttonStyles.root, width: "180px" },
            }}
          />
          <PrimaryButton
            text={t("Create RFQ")}
            onClick={() => setIsCreateEFQDialogOpen(true)}
            styles={{
              ...theme.buttonStyles,
              root: { ...buttonStyles.root, width: "120px" },
            }}
          />
        </Stack>
      )}
      {userDetails.porg && (
        <CreateENegotiationDialog
          Porg={userDetails.porg}
          Handler={userDetails.handlercode}
          isOpen={isCreateENegotiationDialogOpen}
          onCancel={() => setIsCreateENegotiationDialogOpen(false)}
          onCreate={handleCreateENegotiation}
        />
      )}
    </Stack>
  );
};

export default PriceChangeRequest;
