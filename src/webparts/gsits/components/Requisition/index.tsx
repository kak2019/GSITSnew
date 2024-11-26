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
import { IRequisitionGrid } from "../../../../model/requisition";
// import { useUser } from "../../../../hooks";
// import { Logger, LogLevel } from "@pnp/logging";
import AppContext from "../../../../AppContext";
import Pagination from "./page";
import { getAADClient } from "../../../../pnpjsConfig";
import { AadHttpClient } from "@microsoft/sp-http";
import { CONST } from "../../../../config/const";
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
  createdDate: string;
  rfqNo: string;
  reqBuyer: string;
  handlerName: string;
  status: string;
}
const PAGE_SIZE = 20;
const Requisition: React.FC = () => {
  let userEmail = "";
  const { t } = useTranslation(); // 使用 i18next 进行翻译
  const navigate = useNavigate();
  // const { getUserIDCode } = useUser(); // 引入 useUser 钩子
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.context) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
  }
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: ""
  });
  //console.log(userEmail);
  // const [currentUserIDCode, setCurrentUserIDCode] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [columnsPerRow, setColumnsPerRow] = useState<number>(5);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sets, setSets] = useState<any>({})
  const [isFetching, allRequisitions, , getAllRequisitions, ,] =
      useRequisition();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] =
      useState<IRequisitionGrid[]>(allRequisitions);

  const paginatedItems = filteredItems.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
  );
  const status = React.useRef(false)
  // 定义 Selection，用于 DetailsList 的选择
  const [selection] = useState(new Selection({
    getKey(item: any, index) {
      return item.ID
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canSelectItem: (item: any) => {

      // const arr: Item[] = selection.getSelection()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // 如果 Parma 有值，返回 false，否则返回 true //&& item.handler === userDetails.handlercode;
      return !item.Parma
    },
    onSelectionChanged: () => {
      if(status.current) return
      const allItems = selection.getItems()
      const selets = selection.getSelection()
      allItems.forEach(val => {
        if(selets.includes(val)) {
          sets[val.ID] = true
        } else {
          sets[val.ID] = false
        }
        setSets({...sets})
      })
      // setSelectedItems(selection.getSelection() as Item[]);
    },
  }))

  useEffect(() => {
    setSelectedItems(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (allRequisitions as any).filter((val:any) => {
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
    navigate("/create-rfq", { state: { selectedItems } });
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
          });

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

  const itemWidth = `calc(${100 / columnsPerRow}% - ${
      ((columnsPerRow - 1) * 10) / columnsPerRow
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
      fieldName: "CreatedDate",
      minWidth: 100,
    },
    { key: "RfqNo", name: t("RFQ No."), fieldName: "RfqNo", minWidth: 80 },
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
    { key: "In Progress", text: "In Progress" },
    { key: "Sent to GPS", text: "Sent to GPS" },
  ];
  const QualifierType = [
    { key: "V", text: "V" },
    { key: "X", text: "X" },
    { key: "4", text: "4" },
    { key: "7", text: "7" },
  ];

  const [filters, setFilters] = useState<{
    requisitionType: any[];
    buyer: string;
    parma: string;
    section: string;
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
          (!buyer || (item.ReqBuyer.toLowerCase().includes(buyer.toLowerCase()) || item.HandlerName.toLowerCase().includes(buyer.toLowerCase()))) &&
          (!parma || item.Parma?.toLowerCase().includes(parma.toLowerCase())) &&
          (!section ||
              item.Section.toLowerCase().includes(section.toLowerCase()) || item.SectionDescription.toLowerCase().includes(section.toLowerCase()) ) &&
          (status.length===0 || status.includes(item.Status)) &&
          (!partNumber ||
              item.PartNumber.toLowerCase().includes(partNumber.toLowerCase())) &&
          (!qualifier || item.Qualifier === qualifier) &&
          (!project ||
              item.Project?.toLowerCase().includes(project.toLowerCase())) &&
          (!materialUser || item.MaterialUser.toString() === materialUser) &&
          (!rfqNumber ||
              item.RfqNo?.toLowerCase().includes(rfqNumber.toLowerCase())) &&
          (!requiredWeekFrom || (item.RequiredWeek??"") >= requiredWeekFrom) &&
          (!requiredWeekTo || (item.RequiredWeek??"") <= requiredWeekTo) &&
          (!createdDateFrom ||
              (item.CreateDate && new Date(item.CreateDate) >= createdDateFrom)) &&
          (!createdDateTo ||
              (item.CreateDate && new Date(item.CreateDate) <= createdDateTo))
      );
    }).sort((a:any, b:any) => {
      return b.RequiredWeek - a.RequiredWeek
    });
  };


  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [message, setMessage] = React.useState<string>("");

  // 弹出对话框时触发的函数
  const showDialog = (msg: string) => {
    setMessage(msg);
    setIsDialogVisible(true);
  };

  // 关闭对话框
  const closeDialog = () => {
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
      setFilters((prev) => ({
        ...prev,
        buyer: userDetails.handlercode || "",
      }));
    }
  }, [userDetails]);
  useEffect(() => {
    getAllRequisitions();
  }, [getAllRequisitions]);


  useEffect(() => {
    const result = applyFilters()
    setFilteredItems(result)
  }, [allRequisitions])
  console.log(allRequisitions);
  return (
      <Stack className="Requisition" tokens={{ childrenGap: 20, padding: 20 }}>
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
                padding: "10px 20px",
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
        {isSearchVisible  && (
            <Stack tokens={{ padding: 10 }} className="noMargin">
              <Stack
                  tokens={{ childrenGap: 10, padding: 20 }}
                  styles={{
                    root: { backgroundColor: "#CCEEFF", borderRadius: "4px" },
                  }}
              >
                <Stack
                    horizontal
                    wrap
                    tokens={{ childrenGap: 10 }}
                    verticalAlign="start"
                >
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <Dropdown
                        label={t("Requisition Type")}
                        placeholder="Please Select"
                        multiSelect={true}
                        options={RequisitionsType}
                        style={{ width: Number(itemWidth) - 30 }}
                        onChange={(e, option) =>{
                          if (option) {
                            const newSelectedKeys = option.selected
                                ? [...filters.requisitionType, option.key as string] // 添加选中项
                                : filters.requisitionType.filter((key) => key !== option.key); // 移除未选中项

                            return setFilters((prev: any) => ({
                              ...prev,
                              requisitionType: newSelectedKeys,
                            }))
                          }
                        }
                        }
                    />
                  </Stack.Item>
                  {/* <Stack.Item grow styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}>
                                <TextField label={t("Buyer")} placeholder="Entered text" style={{width: Number(itemWidth) - 30}}
                                defaultValue={currentUserIDCode}
                                onChange={(e, newValue) => setFilters(prev => ({ ...prev, buyer: newValue || '' }))}
                                />
                            </Stack.Item> */}
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                          marginTop: "4px",
                        }}
                    >
                  <span
                      style={{
                        marginRight: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                  >
                    {t("Buyer")}
                  </span>
                      <TooltipHost
                          content={t("Search by Org/Handler Code/Name")}
                          calloutProps={{ gapSpace: 0 }}
                      >
                        <Icon
                            iconName="Info"
                            styles={{
                              root: {
                                fontSize: "16px", // 增大字体大小
                                cursor: "pointer",
                                color: "#0078D4", // 使用更显眼的颜色（蓝色）
                              },
                            }}
                        />
                      </TooltipHost>
                    </div>
                    <TextField
                        placeholder="Entered text"
                        style={{ width: Number(itemWidth) - 30 }}
                        value={filters.buyer}
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({ ...prev, buyer: newValue || "" }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("Parma")}
                        placeholder="Placeholder text"
                        style={{ width: Number(itemWidth) - 30 }}
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({ ...prev, parma: newValue || "" }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                          marginTop: "4px",
                        }}
                    >
                  <span
                      style={{
                        marginRight: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                  >
                    {t("Section")}
                  </span>
                      <TooltipHost
                          content={'Search by Section code/Section Description'}
                          calloutProps={{ gapSpace: 0 }}
                      >
                        <Icon
                            iconName="Info"
                            styles={{
                              root: {
                                fontSize: "16px", // 增大字体大小
                                cursor: "pointer",
                                color: "#0078D4", // 使用更显眼的颜色（蓝色）
                              },
                            }}
                        />
                      </TooltipHost>
                    </div>
                    <TextField
                        // label={t("Section")}
                        placeholder="Placeholder text"
                        value={filters.section}
                        style={{ width: Number(itemWidth) - 30 }}
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({ ...prev, section: newValue || "" }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <Dropdown
                        label={t("Status")}
                        placeholder="Optional"
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
                  </Stack.Item>

                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("Part Number")}
                        placeholder="Placeholder text"
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({
                              ...prev,
                              partNumber: newValue || "",
                            }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <Dropdown
                        label={t("Qualifier")}
                        placeholder="Optional"
                        options={QualifierType}
                        onChange={(e, option) =>
                            setFilters((prev) => ({
                              ...prev,
                              qualifier: String(option?.key || ""),
                            }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("Project")}
                        placeholder="Placeholder text"
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({ ...prev, project: newValue || "" }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    {/*<TextField*/}
                    {/*    label={t("Material User")}*/}
                    {/*    onChange={(e, newValue) =>*/}
                    {/*        setFilters((prev) => ({*/}
                    {/*          ...prev,*/}
                    {/*          materialUser: newValue || "",*/}
                    {/*        }))*/}
                    {/*    }*/}
                    {/*/>*/}
                    <Dropdown
                        label={t("Material User")}
                        placeholder="Please select"
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
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("RFQ Number")}
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({
                              ...prev,
                              rfqNumber: newValue || "",
                            }))
                        }
                    />
                  </Stack.Item>

                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("Required Week From")}
                        placeholder="YYYYWW"
                        onChange={(e, newValue) => {
                          if (isValidYYYYWW(newValue)) {
                            setFilters((prev) => ({
                              ...prev,
                              requiredWeekTo: addWeeksToYYYYWW(newValue, 12) || "",
                            }));
                          }
                          setFilters((prev) => ({
                            ...prev,
                            requiredWeekFrom: newValue || "",
                          }));
                        }}
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <TextField
                        label={t("Required Week To")}
                        value={filters.requiredWeekTo}
                        placeholder="YYYYWW"
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({
                              ...prev,
                              requiredWeekTo: newValue || "",
                            }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <DatePicker
                        label={t("Created Date From")}
                        placeholder="Select Date"
                        ariaLabel="Select a date"
                        onSelectDate={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              createdDateFrom: date || null, // 确保 date 为 null，而不是 undefined
                            }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{ root: { flexBasis: itemWidth, maxWidth: itemWidth } }}
                  >
                    <DatePicker
                        label={t("Created Date To")}
                        placeholder="Select Date"
                        ariaLabel="Select a date"
                        onSelectDate={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              createdDateTo: date || null, // 确保 date 为 null，而不是 undefined
                            }))
                        }
                    />
                  </Stack.Item>
                  <Stack.Item
                      grow
                      styles={{
                        root: {
                          flexBasis: itemWidth,
                          maxWidth: itemWidth,
                          textAlign: "right",
                        },
                      }}
                  >
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
                  </Stack.Item>
                </Stack>
              </Stack>
            </Stack>
        )}

        {/* 表格和按钮区域
            <h3 className="mainTitle noMargin">{t('title')}</h3> */}
        {isFetching ? (
            <Spinner label={t("Loading...")} size={SpinnerSize.large} />
        ) : (
            <>
              <DetailsList
                  className="detailList"
                  items={paginatedItems} //filteredItems allRequisitions
                  columns={columns}
                  setKey="ID"
                  selection={selection}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  styles={{
                    root: {
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    },
                    headerWrapper: {
                      backgroundColor: "#AFAFAF",
                      selectors: {
                        ".ms-DetailsHeader": {
                          backgroundColor: "#BDBDBD",
                          fontWeight: 600,
                        },
                      },
                    },
                  }}
                  viewport={{
                    height: 0,
                    width: 0,
                  }}
                  // onRenderDetailsFooter={() => {
                  //   const el = document.getElementsByClassName("ms-DetailsHeader")[0];
                  //   const width = (el && el.clientWidth) || "100%";
                  //   return (

                  //   );
                  // }}
                  selectionPreservedOnEmptyClick={true}
                  ariaLabelForSelectionColumn="Toggle selection"
                  ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                  checkButtonAriaLabel="select row"
              />
              <div
                  style={{
                    width: '100%',
                    height: "50px",
                    backgroundColor: "#BDBDBD",
                    display: 'flex',
                    paddingRight: '10px',
                    justifyContent: "flex-end", // 让内容靠右对齐
                    alignItems: "center",      // 垂直居中对齐
                  }}
              >
                <Pagination
                    totalItems={filteredItems.length}
                    pageSize={PAGE_SIZE}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
              </div>
            </>
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
                if(res.length>1) {
                  showDialog(res.join('、') + ` type cannot be selected together, please select again`)
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
              title: "提示",
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


function getDifferentTypes(arr: any) {
  // 使用 Set 获取所有唯一的 type
  const types = new Set(arr.map((item:any) => item.RequisitionType));

  // 如果 Set 的 size 大于 1，说明有不同的类型
  if (types.size > 1) {
    return Array.from(types);  // 返回所有不同的 type
  }

  return [];  // 如果只有一种 type，返回空数组
}