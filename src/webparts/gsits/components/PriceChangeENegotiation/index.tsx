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
  DatePicker,
  ComboBox,
  IComboBoxOption,
  IDropdownOption,
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import AppContext from "../../../../AppContext";
import theme, { buttonStyles } from "../../../../config/theme";
import styles from "./index.module.scss";
import { STATUS, USER_TYPE, ROLE_TYPE } from "../../../../config/const";
import { formatDate, getJapanDate } from "../../../../utils";
import CreateENegotiationDialog from "./CreateENegotiationDialog";
import { FieldWithTooltip } from "../common/FieldWithTooltip";
import { Pagination } from "../common/Pagination";
import { useUser } from "../../../../hooks";
import {
  IENegotiationRequestCreteriaModel,
  IENegotiationRequestFormModel,
  IENegotiationRequest,
} from "../../../../model/eNegotiation";
import { useENegotiation } from "../../../../hooks/useENegotiation";
import { getGPSUserByQueryRequest } from "../../../../api";
import { useNavigate } from "react-router-dom";

const PriceChangeRequest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let userEmail = "";
  let userName = "";
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context._pageContext) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    console.log("ctx", ctx.context._pageContext);
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
    console.log("userName", userName);
  }

  const [isCreateENegotiationDialogOpen, setIsCreateENegotiationDialogOpen] =
    useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [searchConditions, setSearchConditions] =
    useState<IENegotiationRequestCreteriaModel>({
      Buyer: "",
      RFQNo: "",
      ExpectedEffectiveDateFrom: undefined,
      ExpectedEffectiveDateTo: undefined,
      Parma: "",
      SupplierRequestID: "",
      RFQStatus: [] as string[],
    });

  const { getUserType, getGPSUser } = useUser();
  const [userType, setUserType] = useState<string>("Unknown");
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: "",
    porg: "",
  });

  const createButtonsEnable = useMemo(() => {
    return userDetails.role && userDetails.role === ROLE_TYPE.BUYER;
  }, [userDetails]);

  const [eNegotiationRequestList, setENegotiationRequestList] = useState<
    IENegotiationRequest[]
  >([]);
  const [, , , getENegotiationRequestList, createENegotiationRequest] =
    useENegotiation();
  const requestPiceChangeENegotiationData = async (
    creteria: IENegotiationRequestCreteriaModel
  ) => {
    console.log("creteria", creteria);
    const res = await getENegotiationRequestList(creteria);
    setENegotiationRequestList(res);
  };

  const [selectedItems, setSelectedItems] = useState<IENegotiationRequest[]>(
    []
  );

  const requestGPSUserData = async () => {
    const result = await getGPSUser(userEmail);
    if (result && result instanceof Object) {
      setUserDetails({
        role: result.role,
        name: result.name,
        sectionCode: result.sectionCode,
        handlercode: result.handlercode,
        porg: result.porg,
      });
    }
  };

  const requestUserTypeData = async () => {
    const type = await getUserType(userEmail);
    if (userType !== type) setUserType(type);
    if (type === USER_TYPE.MEMBER) {
      requestGPSUserData();
      // if is buyer，request price change e-negotiation list info
      requestPiceChangeENegotiationData(searchConditions);
    }
  };

  useEffect(() => {
    requestUserTypeData();
  }, []);

  // list pagnation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return eNegotiationRequestList.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, eNegotiationRequestList]);
  const totalPages = Math.max(
    1,
    Math.ceil(eNegotiationRequestList.length / itemsPerPage)
  );
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (
    key: keyof typeof searchConditions,
    value: string | number | string[] | Date | undefined
  ): void => {
    setSearchConditions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchClick = (): void => {
    setCurrentPage(1);
    requestPiceChangeENegotiationData(searchConditions);
  };

  const handleCreateENegotiation = async (
    formData: IENegotiationRequestFormModel
  ) => {
    // 创建e-negotiation request，以parma+buyer作为key去查询有没有已经创建的request，若存在并且关联的rfq status不是closed，那么则不能创建这条request，弹出提示
    // 若不存在，或者存在并且关联的rfq status是closed，则允许创建request
    // 创建request，post一条数据，触发flow生成equest id并上传文件
    const { Parma, Porg, Handler } = formData;
    const list = await getENegotiationRequestList({ Parma, Porg, Handler });
    if (
      list &&
      list.length &&
      !list.every((item) => item.RFQStatus === STATUS.CLOSED)
    ) {
      alert(
        "There is active e-Negotation for Parma xxxx, please be aware and close previous one and then reqeust new one"
      );
    } else {
      await createENegotiationRequest(formData);
      setIsCreateENegotiationDialogOpen(false);
      getENegotiationRequestList(searchConditions);
    }
  };

  const [buyerOptions, setBuyerOptions] = useState<IComboBoxOption[]>([]);
  const handleBuyerInputValueChange = async (query: string) => {
    const result = await getGPSUserByQueryRequest({ query });
    if (result && result instanceof Object) {
      const options: IComboBoxOption[] = result.map((item) => {
        const key = `${item.porg} ${item.handlercode}`;
        const text = `${item.porg} ${item.handlercode} (${item.name})`;
        return { key, text, title: text };
      });
      setBuyerOptions(options);
    }
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
      onRender: (item: IENegotiationRequest) =>
        getJapanDate(item.ExpectedEffectiveDateFrom),
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
      onRender: (item) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/pricechange/detail", {
              state: { ID: item.SupplierRequestIDRef },
            });
          }}
          style={{
            color: "#0078D4",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {item.SupplierRequestIDRef}
        </a>
      ),
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
      const items = selection.getSelection();
      setSelectedItems(items as IENegotiationRequest[]);
    },
  });

  return (
    <Stack tokens={{ childrenGap: 20, padding: "0 20px" }}>
      <h2 className={styles.mainTitle}>Price Change E-Negotiation</h2>
      {/* search bar */}
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
      {/* search content */}
      {isSearchVisible && (
        <Stack
          className={styles.noMargin}
          styles={{
            root: {
              ...theme.searchbarforPriceChange,
            },
          }}
        >
          {FieldWithTooltip(
            t("Buyer"),
            t("Search by Org/Handler Code/Name"),
            <ComboBox
              options={buyerOptions}
              autoComplete="on"
              allowFreeform={true}
              openOnKeyboardFocus={true}
              onInputValueChange={handleBuyerInputValueChange}
              useComboBoxAsMenuWidth={false}
              selectedKey={searchConditions.Buyer}
              onChange={(e, option) =>
                handleSearchChange("Buyer", option?.key || "")
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
            styles={theme.datePickerStyles}
            value={
              searchConditions.ExpectedEffectiveDateFrom
                ? new Date(searchConditions.ExpectedEffectiveDateFrom)
                : undefined
            }
            onSelectDate={(date) => {
              if (date) {
                const formattedDate = formatDate(date);
                handleSearchChange("ExpectedEffectiveDateFrom", formattedDate);
              } else {
                handleSearchChange("ExpectedEffectiveDateFrom", "");
              }
            }}
            formatDate={formatDate}
          />
          <DatePicker
            label={t("Expected Effective Date To")}
            allowTextInput
            styles={theme.datePickerStyles}
            value={
              searchConditions.ExpectedEffectiveDateTo
                ? new Date(searchConditions.ExpectedEffectiveDateTo)
                : undefined
            }
            onSelectDate={(date) => {
              if (date) {
                const formattedDate = formatDate(date);
                handleSearchChange("ExpectedEffectiveDateTo", formattedDate);
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
            selectedKeys={searchConditions.RFQStatus}
            multiSelect
            options={StatusOptions}
            onChange={(e, option: IDropdownOption) =>
              handleSearchChange(
                "RFQStatus",
                option.selected
                  ? [
                      ...(searchConditions.RFQStatus || []),
                      option.key as string,
                    ]
                  : (searchConditions.RFQStatus || []).filter(
                      (key) => key !== option.key
                    )
              )
            }
          />
          <Stack.Item className={styles.searchButtonContent}>
            <PrimaryButton
              text={t("Search")}
              styles={buttonStyles}
              onClick={handleSearchClick}
            />
          </Stack.Item>
        </Stack>
      )}
      {/* search list */}
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
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageClick={goToPage}
        />
      </Stack>
      {/* footer buttons */}
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
          disabled={!createButtonsEnable}
        />
        <PrimaryButton
          text={t("Create RFQ")}
          onClick={() => {
            // 首先判断negotiation nuber是否存在，并且rfq number是否是空，如果都满足，则跳转到rfq create page，否则弹出提示
            const item = selectedItems[0];
            if (item.NegotiationNo && !item.RFQNo) {
              navigate("/pce/create-price-rfq", { state: { ...item } });
            } else {
              alert(
                "User can only create RFQ if e-Negotiaion has been created in GPS and RFQ not created yet"
              );
            }
          }}
          styles={{
            ...theme.buttonStyles,
            root: { ...buttonStyles.root, width: "120px" },
          }}
          disabled={!createButtonsEnable || !selectedItems.length}
        />
      </Stack>
      {/* dialog */}
      {userDetails.porg && (
        <CreateENegotiationDialog
          Porg={userDetails.porg}
          Handler={Number(userDetails.handlercode)}
          isOpen={isCreateENegotiationDialogOpen}
          onCancel={() => setIsCreateENegotiationDialogOpen(false)}
          onCreate={handleCreateENegotiation}
        />
      )}
    </Stack>
  );
};

export default PriceChangeRequest;
