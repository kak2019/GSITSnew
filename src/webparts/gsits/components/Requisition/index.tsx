import * as React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Stack,
  TextField,
  Dropdown,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  Icon,
  Label,
  DatePicker,
  Selection,
  TooltipHost,
  Dialog,
  DialogFooter,
  DialogType
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { IColumn } from "@fluentui/react";
import "./index.css";
import { useTranslation } from "react-i18next";
import { useRequisition } from "../../../../hooks/useRequisition";
import { Spinner, SpinnerSize } from "@fluentui/react";
// import {IRequisitionGrid, IRequisitionQueryModel} from "../../../../model/requisition";
import {IRequisitionGrid} from "../../../../model/requisition";
// import { useUser } from "../../../../hooks";
// import { Logger, LogLevel } from "@pnp/logging";
import AppContext from "../../../../AppContext";
import Pagination from "./page";
import { getAADClient } from "../../../../pnpjsConfig";
import { AadHttpClient } from "@microsoft/sp-http";
import { CONST } from "../../../../config/const";
import theme from "../../../../config/theme";
// 定义项目数据类型
interface Item {
  key: number;
  partNo: string;
  qualifier: string;
  partDescription: string;
  materialUser: string;
  reqType: string;
  annualQty: string;
  orderQty: string;
  reqWeekFrom: string;
  createDate: string;
  rfqNo: string;
  reqBuyer: string;
  handlerName: string;
  status: string;
}
const PAGE_SIZE = 20;
const Requisition: React.FC = () => {
  let userEmail = "";
  let userName = "";
  const { t } = useTranslation(); // 使用 i18next 进行翻译
  const navigate = useNavigate();
  // const { getUserIDCode } = useUser(); // 引入 useUser 钩子
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
    userName = ctx.context._pageContext._user?.displayName;
  }
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: "",
    porg: "",
    userName:"",
    userEmail:""
  });
  const code = React.useRef(null)
  // const [currentUserIDCode, setCurrentUserIDCode] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [columnsPerRow, setColumnsPerRow] = useState<number>(5);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sets, setSets] = useState<any>({})
  const [isFetching, allRequisitions, , getAllRequisitions, ,] = useRequisition();
  //const [isFetching, allRequisitions, , , ,queryRequisition] = useRequisition();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] =
    useState<IRequisitionGrid[]>(allRequisitions);
  const [msg, setMsg] = useState('')

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const status = React.useRef(false)
  // 定义 Selection，用于 DetailsList 的选择
  const [selection] = useState(new Selection({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getKey(item: any, index) {
      return item.ID
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canSelectItem: (item: any) => {

      // const arr: Item[] = selection.getSelection()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // 如果 Parma 有值，返回 false，否则返回 true //&& item.handler === userDetails.handlercode;
      if (userDetails.role === "BizAdmin") {
        return !item.Parma
      } else {
        return !item.Parma && String(item?.Handler) === code?.current
      }

    },
    onSelectionChanged: () => {
      if (status.current) return
      const allItems = selection.getItems()
      const selets = selection.getSelection()
      allItems.forEach(val => {
        if (selets.includes(val)) {
          sets[val.ID] = true
        } else {
          sets[val.ID] = false
        }
        setSets({ ...sets })
      })
      // setSelectedItems(selection.getSelection() as Item[]);
    },
  }))

  useEffect(() => {
    setSelectedItems(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (allRequisitions as any).filter((val: any) => {
        return sets[val.ID]
      })
    )
  }, [sets])
  const handlePageChange = (pageNumber: number): void => {
    status.current = true
    selection.setAllSelected(false)
    status.current = false
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedItems.forEach((val: any) => {
      selection.setKeySelected(val.ID, true, false)
    })
  }, [currentPage])

  // 跳转到 Create RFQ 页面，并传递选中的记录
  const handleCreateRFQ = (): void => {
    navigate("/requisition/create-rfq", { state: { selectedItems, userDetails } });
  };

  // 切换搜索区域的显示状态
  const toggleSearchVisibility = (): void => {
    setIsSearchVisible(!isSearchVisible);
  };
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
        console.log(result);
        if (result && result.role && result.name && result.sectionCode && result.handlercode) {
          // 如果所有字段都有值，更新状态
          setUserDetails({
            role: result.role,
            name: result.name,
            sectionCode: result.sectionCode,
            handlercode: result.handlercode,
            porg: result?.porg,
            userName: userName,
            userEmail : userEmail
          });
          code.current = result.handlercode

        } else {
          console.warn("Incomplete data received:", result);
        }
      } catch (error) {
        console.error("Error fetching GPS user props:", error);
      }
    };

    fetchData().then(
      (_) => _,
      (_) => _
    );
  }, []);

  // 根据屏幕宽度调整列数
  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      if (width > 1200) setColumnsPerRow(5.5);
      else if (width > 800) setColumnsPerRow(3);
      else setColumnsPerRow(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemWidth = `calc(${100 / columnsPerRow}% - ${((columnsPerRow - 1) * 10) / columnsPerRow
    }px)`;

  const columns: IColumn[] = [
    {
      key: "PartNumber",
      name: t("Part No."),
      fieldName: "PartNumber",
      minWidth: 100,
    },
    {
      key: "Qualifier",
      name: t("Qualifier"),
      fieldName: "Qualifier",
      minWidth: 50,
    },
    {
      key: "PartDescription",
      name: t("Part Description"),
      fieldName: "PartDescription",
      minWidth: 100,
    },
    {
      key: "MaterialUser",
      name: t("Material User"),
      fieldName: "MaterialUser",
      minWidth: 100,
    },
    {
      key: "Parma",
      name: t("Parma"),
      fieldName: "Parma",
      minWidth: 100,
    },
    {
      key: "RequisitionType",
      name: t("Req. Type"),
      fieldName: "RequisitionType",
      minWidth: 100,
    },
    {
      key: "AnnualQty",
      name: t("Annual Qty"),
      fieldName: "AnnualQty",
      minWidth: 80,
    },
    {
      key: "OrderQty",
      name: t("Order Qty"),
      fieldName: "OrderQty",
      minWidth: 80,
    },
    {
      key: "RequiredWeek",
      name: t("Req Week"),
      fieldName: "RequiredWeek",
      minWidth: 100,
    },
    {
      key: "CreateDate",
      name: t("Created Date"),
      fieldName: "CreateDate",
      minWidth: 100,
    },
    { key: "RfqNo", name: t("RFQ No."), fieldName: "RfqNo", minWidth: 150 },
    {
      key: "ReqBuyer",
      name: t("Req. Buyer"),
      fieldName: "ReqBuyer",
      minWidth: 80,
    },
    {
      key: "HandlerName",
      name: t("Handler Name"),
      fieldName: "HandlerName",
      minWidth: 100,
    },
    { key: "Status", name: t("Status"), fieldName: "Status", minWidth: 80 },
  ];

  const RequisitionsType = [
    { key: "NP", text: "NP" },
    { key: "RB", text: "RB" },
    { key: "PP", text: "PP" },
  ];
  const StatesType = [

    { key: "New", text: "New" },
    { key: "", text: "Blank" },
    { key: "In Progress", text: "In Progress" },
    { key: "Quoted", text: "Quoted" },
    { key: "Returned", text: "Returned" },
    { key: "Accepted", text: "Accepted" },
    { key: "Sent to GPS", text: "Sent to GPS" },
    { key: "Closed", text: "Closed" },
  ];
  const QualifierType = [
    { key: "V", text: "V" },
    { key: "X", text: "X" },
    { key: "4", text: "4" },
    { key: "7", text: "7" },
  ];
  const parseYYMMDD = (dateStr: string): Date => {
    const year = 2000 + parseInt(dateStr.slice(0, 2), 10); // 假设是 21 世纪
    const month = parseInt(dateStr.slice(2, 4), 10) - 1; // 月份从 0 开始
    const day = parseInt(dateStr.slice(4, 6), 10);
    return new Date(year, month, day);
  };
  const [filters, setFilters] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requisitionType: any[];
    buyer: string;
    parma: string;
    section: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: any[];
    partNumber: string;
    qualifier: string;
    project: string;
    materialUser: string;
    rfqNumber: string;
    requiredWeekFrom: string;
    requiredWeekTo: string;
    createdDateFrom: Date | null;
    createdDateTo: Date | null;
  }>({
    requisitionType: [],
    buyer: "",
    parma: "",
    section: "",
    status: [],
    partNumber: "",
    qualifier: "",
    project: "",
    materialUser: "",
    rfqNumber: "",
    requiredWeekFrom: "",
    requiredWeekTo: "",
    createdDateFrom: null,
    createdDateTo: null,
  });
  // console.log(filters)
  const applyFilters = (): IRequisitionGrid[] => {
    return allRequisitions.filter((item) => {
      const {
        requisitionType,
        buyer,
        parma,
        section,
        status,
        partNumber,
        qualifier,
        project,
        materialUser,
        rfqNumber,
        requiredWeekFrom,
        requiredWeekTo,
        createdDateFrom,
        createdDateTo,
      } = filters;

      return (
          (requisitionType.length === 0 || requisitionType.includes(item.RequisitionType)) &&
          (!buyer || (item.ReqBuyer && item.ReqBuyer.toLowerCase().includes(buyer.toLowerCase()) || (item.HandlerName && item.HandlerName.toLowerCase().includes(buyer.toLowerCase())) || (item.Porg && item.Porg.toLowerCase().includes(buyer.toLowerCase())))) &&
          (!parma || item.Parma?.toLowerCase().includes(parma.toLowerCase())) &&
          (!section ||
              (item.Section?.toLowerCase().includes(section.toLowerCase())) || (item.SectionDescription && item.SectionDescription.toLowerCase().includes(section.toLowerCase()))) &&
          ((!status || status.length === 0) ||
              (status.includes("") && (!item.Status || item.Status === null || item.Status === "")) || // 处理选择 Empty 的情况
              (item.Status && status.includes(item.Status))) && // 处理其他状态
          (!partNumber ||
              item.PartNumber.toLowerCase().includes(partNumber.toLowerCase())) &&
          (!qualifier || item.Qualifier === qualifier) &&
          (!project ||
              item.Project?.toLowerCase().includes(project.toLowerCase())) &&
          (!materialUser || item.MaterialUser.toString() === materialUser) &&
          (!rfqNumber ||
              item.RfqNo?.toLowerCase().includes(rfqNumber.toLowerCase())) &&
          (!requiredWeekFrom || (item.RequiredWeek ?? "") >= requiredWeekFrom) &&
          (!requiredWeekTo || (item.RequiredWeek ?? "") <= requiredWeekTo) &&
          (!createdDateFrom ||
              (item.CreateDate && new Date(parseYYMMDD(item.CreateDate)) >= createdDateFrom)) &&
          (!createdDateTo ||
              (item.CreateDate && new Date(parseYYMMDD(item.CreateDate)) <= createdDateTo))
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).sort((a: any, b: any) => {
      return b.RequiredWeek - a.RequiredWeek
    });
  };


  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [message, setMessage] = React.useState<string>("");
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份需要加 1，且补齐两位
    const day = String(date.getDate()).padStart(2, "0"); // 补齐两位
    return `${year}/${month}/${day}`;
  };
  // 弹出对话框时触发的函数
  const showDialog = (msg: string): void => {
    setMessage(msg);
    setIsDialogVisible(true);
  };

  // 关闭对话框
  const closeDialog = (): void => {
    setIsDialogVisible(false);
  };
  // useEffect(() => {
  //   // 获取当前登录用户信息
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
  //   const fetchUserInfo = async () => {
  //     try {
  //       // const userEmail = userEmail; // Replace with actual email if available
  //       const userIDCode = await getUserIDCode(userEmail);
  //       setCurrentUserIDCode(userIDCode);
  //
  //       //const userPicture = await getUserPicture(userIDCode);
  //     } catch (error) {
  //       Logger.write(`Failed to fetch user info: ${error}`, LogLevel.Error);
  //     }
  //   };
  //   fetchUserInfo().catch((e) => console.log(e));
  // }, []);
  // 更新 userDetails 后初始化 filters
  useEffect(() => {
    if (userDetails.role === "Manager") {
      setFilters((prev) => ({
        ...prev,
        section: userDetails.sectionCode || "",
      }));
    } else if (userDetails.role === "Buyer") {
      const curDate = getCurrentWeekYYYYWW()
      setFilters((prev) => ({
        ...prev,
        buyer: userDetails.handlercode || "",
        requiredWeekFrom: addWeeksToYYYYWW(curDate, -12),
        // requiredWeekTo: addWeeksToYYYYWW(curDate, 12)
      }));
    }
  }, [userDetails]);



  useEffect(() => {
    const result = applyFilters()
    setFilteredItems(result)
  }, [allRequisitions])
  console.log(allRequisitions);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //const searchByCondition = () =>{
    // const queryModel: IRequisitionQueryModel = {
    //   RequisitionType: filters.requisitionType.length > 0 ? filters.requisitionType : undefined,
    //   Buyer: filters.buyer || undefined,
    //   Parma: filters.parma || undefined,
    //   Section: filters.section || undefined,
    //   Status: filters.status.length > 0 ? filters.status : undefined,
    //   PartNumber: filters.partNumber || undefined,
    //   Qualifier: filters.qualifier || undefined,
    //   Project: filters.project || undefined,
    //   MaterialUser: filters.materialUser ? Number(filters.materialUser) : undefined,
    //   RFQNumber: filters.rfqNumber || undefined,
    //   RequiredWeekFrom: filters.requiredWeekFrom || undefined,
    //   RequiredWeekTo: filters.requiredWeekTo || undefined,
    //   CreatedDateFrom: filters.createdDateFrom
    //       ? formatDate(filters.createdDateFrom)
    //       : undefined,
    //   CreatedDateTo: filters.createdDateTo
    //       ? formatDate(filters.createdDateTo)
    //       : undefined,
    // };

    //queryRequisition({})
  //}
  useEffect(() => {
    getAllRequisitions();
    //searchByCondition()
  }, []);
  //}, [getAllRequisitions]);

  const fieldWithTooltip = (
    label: string,
    tooltip: string,
    field: JSX.Element
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ) => {
    return (
      <div
        style={{ display: "grid", gridTemplateRows: "auto auto", gap: "4px" }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
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
    <Stack className="Requisition" tokens={{ childrenGap: 20, }} styles={{
      root: {
        width: "100%",
        paddingTop: 0, // 去掉顶部空白
        paddingLeft: 20, // 保留左右空白
        paddingRight: 20,
        paddingBottom: 0, // 保留左右空白
        margin: "0"
      }
    }}>
      <h2 className="mainTitle">{t("Requisition for New Part Price")}</h2>
      {/* 搜索区域标题和切换图标 */}
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        className="noMargin"
        styles={{
          root: {
            backgroundColor: "white",
            padding: "0",
            cursor: "pointer",
            marginBottom: 0,
            marginTop: 0,
          },
        }}
        onClick={toggleSearchVisibility}
      >
        <Icon
          iconName={isSearchVisible ? "ChevronDown" : "ChevronRight"}
          style={{ fontSize: 16 }}
        />
        <Label styles={{ root: { fontWeight: "bold" } }}>{t("Search")}</Label>
      </Stack>

      {/* 搜索区域 */}
      {isSearchVisible && (
        // <Stack tokens={{ padding: 10 }} className="noMargin">
        //   <Stack
        //       tokens={{ childrenGap: 10, padding: 20 }}
        //       styles={{
        //         root: { backgroundColor: "#CCEEFF", borderRadius: "4px" },
        //       }}
        //   >
        //     <Stack
        //         horizontal
        //         wrap
        //         tokens={{ childrenGap: 10 }}
        //         verticalAlign="start"
        //     >
        <Stack
          className="noMargin"
          styles={{
            root: {
              ...theme.searchbar
            },
          }}
        >
          {/* <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  > */}
          <Dropdown
            label={t("Requisition Type")}
            multiSelect={true}
            options={RequisitionsType}
            style={{ width: Number(itemWidth) - 30 }}
            onChange={(e, option) => {
              if (option) {
                const newSelectedKeys = option.selected
                  ? [...filters.requisitionType, option.key as string] // 添加选中项
                  : filters.requisitionType.filter((key) => key !== option.key); // 移除未选中项
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return setFilters((prev: any) => ({
                  ...prev,
                  requisitionType: newSelectedKeys,
                }))
              }
            }
            }
          />

          {fieldWithTooltip(t("Buyer"),
            t("Search by Org/Handler Code/Name"),
            <TextField
              style={{ width: Number(itemWidth) - 30 }}
              value={filters.buyer}
              onChange={(e, newValue) =>
                setFilters((prev) => ({ ...prev, buyer: newValue || "" }))
              }
            />
          )}

          <TextField
            label={t("Parma")}
            style={{ width: Number(itemWidth) - 30 }}
            onChange={(e, newValue) =>
              setFilters((prev) => ({ ...prev, parma: newValue || "" }))
            }
          />
          {fieldWithTooltip(t("Section"),
            "Search by Section code/Section Description",
            <TextField
              // label={t("Section")}
              value={filters.section}
              style={{ width: Number(itemWidth) - 30 }}
              onChange={(e, newValue) =>
                setFilters((prev) => ({ ...prev, section: newValue || "" }))
              }
            />
          )}
          <Dropdown
            label={t("Status")}
            multiSelect
            options={StatesType}
            style={{ width: Number(itemWidth) - 30 }}
            onChange={(e, option) => {
              if (option) {
                const newSelectedKeys = option.selected
                  ? [...filters.status, option.key as string] // 添加选中项
                  : filters.status.filter((key) => key !== option.key); // 移除未选中项

                return setFilters((prev) => ({
                  ...prev,
                  status: newSelectedKeys,
                }))
              }
            }

            }
          />

          <TextField
            label={t("Part Number")}
            onChange={(e, newValue) =>
              setFilters((prev) => ({
                ...prev,
                partNumber: newValue || "",
              }))
            }
          />
          <Dropdown
              label={t("Qualifier")}
              options={QualifierType}
              onChange={(e, option) =>
                setFilters((prev) => ({
                  ...prev,
                  qualifier: String(option?.key || ""),
                }))
              }
            />

            <TextField
              label={t("Project")}
              onChange={(e, newValue) =>
                setFilters((prev) => ({ ...prev, project: newValue || "" }))
              }
            />
            <Dropdown
              label={t("Material User")}
              options={[
                { key: "8374", text: "8374" },
                { key: "2921", text: "2921" },
                { key: "2924", text: "2924" },
                { key: "2920", text: "2920" },
                { key: "2922", text: "2922" },
                { key: "8371", text: "8371" },
                { key: "8462", text: "8462" }
              ]}
              onChange={(e, option) =>
                setFilters((prev) => ({
                  ...prev,
                  materialUser: String(option?.key || ""),
                }))
              }
            />
          {/* </Stack.Item> */}
          {/* <Stack.Item
            grow
            styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
          > */}
            <TextField
              label={t("RFQ Number")}
              onChange={(e, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  rfqNumber: newValue || "",
                }))
              }
            />

            <TextField
              label={t("Required Week From")}
              defaultValue={addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12)}
              onChange={(e, newValue) => {
                if (isValidYYYYWW(newValue)) {
                  setFilters((prev) => ({
                    ...prev,
                    // requiredWeekTo: addWeeksToYYYYWW(newValue, -12) || "",
                  }));
                  setMsg('')
                } else {
                  setMsg('Format should be YYYYMM')
                }
                setFilters((prev) => ({
                  ...prev,
                  requiredWeekFrom: newValue || "",
                }));
              }}
              errorMessage={msg}
            />

            <TextField
              label={t("Required Week To")}
              value={filters.requiredWeekTo}
              onChange={(e, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  requiredWeekTo: newValue || "",
                }))
              }
            />

            <DatePicker
              label={t("Created Date From")}
              ariaLabel="Select a date"
              value={filters.createdDateFrom as Date}
              onSelectDate={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  createdDateFrom: date || null, // 确保 date 为 null，而不是 undefined
                }))
              }
              formatDate={formatDate}
              allowTextInput
            />

            <DatePicker
              label={t("Created Date To")}
              ariaLabel="Select a date"
              value={filters.createdDateTo as Date}
              onSelectDate={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  createdDateTo: date || null, // 确保 date 为 null，而不是 undefined
                }))
              }
              formatDate={formatDate}
              allowTextInput
            />
            <PrimaryButton
              text={t("Search")}
              styles={{
                root: {
                  marginTop: 28,
                  border: "none",
                  backgroundColor: "#99CCFF",
                  height: 36,
                  color: "black",
                  borderRadius: "4px",
                  width: 150,
                },
              }}
              onClick={() => {
                const result = applyFilters();
                setFilteredItems(result);
              }}
            />

        </Stack>
      )}

      {/* 表格和按钮区域
            <h3 className="mainTitle noMargin">{t('title')}</h3> */}
      {isFetching ? (
        <Spinner label={t("Loading...")} size={SpinnerSize.large} />
      ) : (
        <Stack>
          <DetailsList
            // className="detailList"
            items={paginatedItems} //filteredItems allRequisitions
            columns={columns.map((col) => ({
              ...col,
              onColumnClick: undefined, // 禁用点击功能
              styles: { root: { textAlign: "center" } }, // 单元格居中


          }))}
            setKey="ID"
            selection={selection}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            styles={{
              root: theme.detaillist.root,
              contentWrapper: theme.detaillist.contentWrapper,
              headerWrapper: theme.detaillist.headerWrapper,
          }}

            viewport={{
              height: 0,
              width: 0,
            }}

            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />

            <Pagination
              totalItems={filteredItems.length}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          {/* </div> */}
        </Stack>
      )}

      {/* 底部按钮 */}
      <Stack horizontal tokens={{ childrenGap: 10, padding: 10 }}>
        <PrimaryButton
          text={t("Create")}
          styles={{
            root: {
              border: "none",
              backgroundColor: "#99CCFF",
              height: 36,
              color: "black",
            },
          }}
          onClick={() => {
            const res = getDifferentTypes(selectedItems)
            if (res.length > 1) {
              // showDialog(res.join('、') + ` type cannot be selected together, please select again`)
              showDialog("It does not allow to combine PP and NP/RB in one RFQ, please create separately.")
              return
            }
            handleCreateRFQ()
          }}
          disabled={selectedItems.length === 0}
        />
      </Stack>
      <Dialog
        hidden={!isDialogVisible} // 控制对话框是否显示
        onDismiss={closeDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirmation",
          subText: message, // 动态设置消息内容
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={closeDialog} text="OK" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default Requisition;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function isValidYYYYWW(dateStr: any) {
  // 正则表达式匹配 yyyyww 格式
  const pattern = /^\d{4}(0[1-9]|[1-4][0-9]|5[0-3])$/;

  if (!pattern.test(dateStr)) {
    return false;
  }

  const year = parseInt(dateStr.slice(0, 4), 10);
  const week = parseInt(dateStr.slice(4), 10);

  // 使用 Date 对象验证日期合法性
  try {
    // 计算第一个日期
    const firstDay = new Date(year, 0, 1);
    const dayOfWeek = firstDay.getDay();
    const dayOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
    const firstWeekStart = new Date(firstDay);
    firstWeekStart.setDate(
      firstWeekStart.getDate() - dayOffset + (week - 1) * 7
    );

    // 确定日期是否在同一年
    return firstWeekStart.getFullYear() === year;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function addWeeksToYYYYWW(dateStr: any, weeksToAdd: any) {
  // 解析输入字符串
  const year = parseInt(dateStr.slice(0, 4), 10);
  const week = parseInt(dateStr.slice(4), 10);

  // 计算该年的第一周的开始日期（ISO标准）
  const firstDay = new Date(year, 0, 1);
  const dayOfWeek = firstDay.getUTCDay();
  const correction = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
  const firstWeekStart = new Date(
    firstDay.getTime() - correction * 24 * 60 * 60 * 1000
  );

  // 计算目标周的开始日期
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetDate: any = new Date(
    firstWeekStart.getTime() + (week - 1 + weeksToAdd) * 7 * 24 * 60 * 60 * 1000
  );

  // 计算目标日期的年和周数
  const targetYear = targetDate.getUTCFullYear();

  // 计算目标年的一月四日，以此计算出ISO周
  const jan4 = new Date(targetYear, 0, 4);
  const jan4DayOfWeek = jan4.getUTCDay();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jan4FirstWeekStart: any = new Date(
    jan4.getTime() -
    (jan4DayOfWeek <= 4 ? jan4DayOfWeek - 1 : jan4DayOfWeek - 8) *
    24 *
    60 *
    60 *
    1000
  );

  const diff = targetDate - jan4FirstWeekStart;
  const targetWeek = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;

  // 返回计算结果
  return `${targetYear}${String(targetWeek).padStart(2, "0")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function getDifferentTypes(arr: any) {
  // 使用 Set 获取所有唯一的 type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const types = new Set(arr.map((item: any) => item.RequisitionType));

  // 如果 Set 的 size 大于 1，说明有不同的类型
  if (types.size > 1) {
    return Array.from(types);  // 返回所有不同的 type
  }

  return [];  // 如果只有一种 type，返回空数组
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getCurrentWeekYYYYWW() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const today: any = new Date();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor((today - firstDayOfYear) / 86400000 + 1);
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return today.getFullYear().toString() + String(weekNumber).padStart(2, '0');
}