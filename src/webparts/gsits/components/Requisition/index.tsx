import * as React from "react";
import {useState, useEffect, useContext} from "react";
import {
    Stack,
    TextField,
    Dropdown,
    PrimaryButton,
    DetailsList,
    //DetailsListLayoutMode,
    Icon,
    Label,
    DatePicker,
    Selection,
    TooltipHost,
    Dialog,
    DialogFooter,
    DialogType,
    ComboBox,
    IComboBox,
    IComboBoxOption, SelectionMode
} from "@fluentui/react";
import {useNavigate} from "react-router-dom";
import {IColumn} from "@fluentui/react";
import "./index.css";
import {useTranslation} from "react-i18next";
//import { useRequisition } from "../../../../hooks/useRequisition";
import {Spinner, SpinnerSize} from "@fluentui/react";
// import {IRequisitionGrid, IRequisitionQueryModel} from "../../../../model/requisition";
//import {IRequisitionGrid} from "../../../../model/requisition";
// import { useUser } from "../../../../hooks";
// import { Logger, LogLevel } from "@pnp/logging";
import AppContext from "../../../../AppContext";
import Pagination from "./page";
import {getAADClient} from "../../../../pnpjsConfig";
import {AadHttpClient} from "@microsoft/sp-http";
import {CONST} from "../../../../config/const";
import theme from "../../../../config/theme";
import {useUDGSPart} from "../../../../hooks-v2/use-udgs-part";
import {IUDGSNewPartCreteriaModel, IUDGSNewPartGridModel} from "../../../../model-v2/udgs-part-model";
import {useUDGSUser} from "../../../../hooks-v2/use-udgs-user";

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function areWeeksWithinOneYear(initialWeek: string, comparisonWeek: string) {
    // 提取年份和周数
    const initialYear = parseInt(initialWeek.slice(0, 4), 10);
    const initialWeekNumber = parseInt(initialWeek.slice(4), 10);

    const comparisonYear = parseInt(comparisonWeek.slice(0, 4), 10);
    const comparisonWeekNumber = parseInt(comparisonWeek.slice(4), 10);

    // 计算年差
    const yearDifference = comparisonYear - initialYear;

    // 如果在同一年，直接判断周数差值
    if (yearDifference === 0) {
        const weekDifference = comparisonWeekNumber - initialWeekNumber;
        return Math.abs(weekDifference) <= 52; // 在同一年内，不超过52周
    }

    // 计算总周数差，包括跨年的处理
    const totalWeeksDifference = yearDifference * 52 + (comparisonWeekNumber - initialWeekNumber);

    // 判断总周数差是否在52周之内
    return Math.abs(totalWeeksDifference) <= 52;
}

const PAGE_SIZE = 20;
const Requisition: React.FC = () => {
    const [, , , , , , , getSections,] = useUDGSUser();
    const comboBoxRef = React.useRef<IComboBox>(null);
    const comboBoxRefSec = React.useRef<IComboBox>(null);
    const [filteredBuyerOptions, setFilteredBuyerOptions] = useState<IComboBoxOption[]>([]);
    const [selectedBuyerValue, setSelectedBuyerValue] = useState<string | undefined>();
    const [filteredSectionOptions, setFilteredSectionOptions] = useState<IComboBoxOption[]>([]);
    const [selectedSectionValue, setSelectedSectionValue] = useState<string | undefined>();

    let userEmail = "";
    let userName = "";
    const {t} = useTranslation(); // 使用 i18next 进行翻译
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
        userName: "",
        userEmail: ""
    });
    const code = React.useRef(null)
    // const [currentUserIDCode, setCurrentUserIDCode] = useState<string>("");
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [columnsPerRow, setColumnsPerRow] = useState<number>(5);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sets, setSets] = useState<any>({})
    //const [isFetching, allRequisitions, , getAllRequisitions, ,] = useRequisition();
    const [isFetching, , , , currentParts, queryParts, , , , ,] = useUDGSPart()
    //const [isFetching, allRequisitions, , , ,queryRequisition] = useRequisition();
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredItems, setFilteredItems] = useState<IUDGSNewPartGridModel[]>([]);
    //const [filteredItems, setFilteredItems] = useState<IRequisitionGrid[]>([]);
    const [msg, setMsg] = useState('')
    const [msgTo, setMsgTo] = useState('')

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    const status = React.useRef(false)
    // 定义 Selection，用于 DetailsList 的选择
    const [selection, setSelection] = useState(new Selection({
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
                //return !item.Parma
                return !item.RFQIDRef
            } else {
                return !item.RFQIDRef && String(item?.Handler.toString().replace(/,/g, '')) === code?.current
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
                setSets({...sets})
            })
            // setSelectedItems(selection.getSelection() as Item[]);
        },
    }))

    useEffect(() => {
        setSelectedItems(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (currentParts as any).filter((val: any) => {
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
        navigate("/requisition/create-rfq", {state: {selectedItems, userDetails,type:"Part"}});
    };

    // 切换搜索区域的显示状态
    const toggleSearchVisibility = (): void => {
        setIsSearchVisible(!isSearchVisible);
    };


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

    useEffect(() => {
        const s = new Selection({
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
                    //return !item.Parma
                    return !item.RFQIDRef
                } else {
                    return !item.RFQIDRef && String(item?.Handler.toString().replace(/,/g, '')) === code?.current
                }

            },
            onSelectionChanged: () => {
                if (status.current) return
                const allItems = s.getItems()
                const selets = s.getSelection()
                allItems.forEach(val => {
                    if (selets.includes(val)) {
                        sets[val.ID] = true
                    } else {
                        sets[val.ID] = false
                    }
                })
                setSets({...sets})
                // setSelectedItems(selection.getSelection() as Item[]);
            },
        })
        setSelection(s)
    }, [userDetails])

    const itemWidth = `calc(${100 / columnsPerRow}% - ${((columnsPerRow - 1) * 10) / columnsPerRow
    }px)`;

    const columns: IColumn[] = [
        {
            key: "PartNumber",
            name: t("Part Number"),
            fieldName: "PartNumber",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.PartNumber}</div>
        },
        {
            key: "Qualifier",
            name: t("Qualifier"),
            fieldName: "Qualifier",
            minWidth: 50,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.Qualifier}</div>
        },
        {
            key: "PartDescription",
            name: t("Part Description"),
            fieldName: "PartDescription",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.PartDescription}</div>
        },
        {
            key: "MaterialUser",
            name: t("Material User"),
            fieldName: "MaterialUser",
            minWidth: 100,
            isResizable: true,
            onRender: item => {
                // 将值转换为字符串，并去掉千分符
                const materialUserText = item.MaterialUser.toString().replace(/,/g, '');

                return <span style={{userSelect: "text"}}>{materialUserText}</span>; // 返回去掉千分符的文本
            }

        },
        {
            key: "Parma",
            name: t("Parma"),
            fieldName: "Parma",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.Parma}</div>
        },
        {
            key: "RequisitionType",
            name: t("Requisition Type"),
            fieldName: "RequisitionType",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.RequisitionType}</div>
        },
        {
            key: "AnnualQty",
            name: t("Annual Qty"),
            fieldName: "AnnualQty",
            minWidth: 80,
            isResizable: true,
            onRender: item => {
                // 将值转换为字符串，并去掉千分符
                const AnnualQtyUserText = item.AnnualQty.toString().replace(/,/g, '');

                return <span style={{userSelect: "text"}}>{AnnualQtyUserText}</span>; // 返回去掉千分符的文本
            }
        },
        {
            key: "OrderQty",
            name: t("Order Qty"),
            fieldName: "OrderQty",
            minWidth: 80,
            isResizable: true,
            onRender: item => {
                // 将值转换为字符串，并去掉千分符
                const OrderQtyUserText = item.OrderQty.toString().replace(/,/g, '');

                return <span style={{userSelect: "text"}}>{OrderQtyUserText}</span>; // 返回去掉千分符的文本
            }
        },
        {
            key: "RequiredWeek",
            name: t("Required Week"),
            fieldName: "RequiredWeek",
            minWidth: 100,
            isResizable: true,
            onRender: item => {
                // 将值转换为字符串，并去掉千分符
                const RequiredWeekText = item.RequiredWeek.toString().replace(/,/g, '');

                return <span style={{userSelect: "text"}}>{RequiredWeekText}</span>; // 返回去掉千分符的文本
            }
        },
        {
            key: "CreateDate",
            name: t("Created Date"),
            fieldName: "CreateDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => {
                // 假设 item.CreateDate 是一个日期字符串或日期对象
                const date = new Date(item.CreateDate); // 创建日期对象

                // 格式化日期，例如 YYYY-MM-DD
                const dateString = date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd

                return <span style={{userSelect: "text"}}>{dateString}</span>; // 返回格式化后的日期字符串
            }
        },
        {
            key: "RfqNo", name: t("RFQ No."), fieldName: "RFQNo", minWidth: 150, isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.RFQNo}</div>
        },
        {
            key: "ReqBuyer",
            name: t("Req. Buyer"),
            fieldName: "RequisitionBuyer",
            minWidth: 80,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.RequisitionBuyer}</div>
        },
        {
            key: "HandlerName",
            name: t("Handler Name"),
            fieldName: "HandlerName",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.HandlerName}</div>
        },
        {
            key: "Status", name: t("Status"), fieldName: "PartStatus", minWidth: 80, isResizable: true,
            onRender: (item) => <div style={{userSelect: "text"}}>{item.PartStatus}</div>
        },
    ];

    const RequisitionsType = [
        {key: "NP", text: "NP"},
        {key: "RB", text: "RB"},
        {key: "PP", text: "PP"},
    ];
    const StatesType = [
        {key: "", text: "Blank"},
        {key: "New", text: "New"},
        {key: "Draft", text: "Draft"},
        {key: "Quoted", text: "Quoted"},
        {key: "Returned", text: "Returned"},
        {key: "Accepted", text: "Accepted"},
        {key: "Sent to GPS", text: "Sent to GPS"},
        {key: "Closed", text: "Closed"},
    ];
    // const QualifierType = [
    //   { key: "V", text: "V" },
    //   { key: "X", text: "X" },
    //   { key: "4", text: "4" },
    //   { key: "7", text: "7" },
    // ];
    // const parseYYMMDD = (dateStr: string): Date => {
    //   const year = 2000 + parseInt(dateStr.slice(0, 2), 10); // 假设是 21 世纪
    //   const month = parseInt(dateStr.slice(2, 4), 10) - 1; // 月份从 0 开始
    //   const day = parseInt(dateStr.slice(4, 6), 10);
    //   return new Date(year, month, day);
    // };
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
    console.log(filters)
    // const applyFilters = (): IRequisitionGrid[] => {
    //   return allRequisitions.filter((item) => {
    //     const {
    //       requisitionType,
    //       buyer,
    //       parma,
    //       section,
    //       status,
    //       partNumber,
    //       qualifier,
    //       project,
    //       materialUser,
    //       rfqNumber,
    //       requiredWeekFrom,
    //       requiredWeekTo,
    //       createdDateFrom,
    //       createdDateTo,
    //     } = filters;
    //
    //     return (
    //         (requisitionType.length === 0 || requisitionType.includes(item.RequisitionType)) &&
    //         (!buyer || (item.ReqBuyer && item.ReqBuyer.toLowerCase().includes(buyer.toLowerCase()) || (item.HandlerName && item.HandlerName.toLowerCase().includes(buyer.toLowerCase())) || (item.Porg && item.Porg.toLowerCase().includes(buyer.toLowerCase())))) &&
    //         (!parma || item.Parma?.toLowerCase().includes(parma.toLowerCase())) &&
    //         (!section ||
    //             (item.Section?.toLowerCase().includes(section.toLowerCase())) || (item.SectionDescription && item.SectionDescription.toLowerCase().includes(section.toLowerCase()))) &&
    //         ((!status || status.length === 0) ||
    //             (status.includes("") && (!item.Status || item.Status === null || item.Status === "")) || // 处理选择 Empty 的情况
    //             (item.Status && status.includes(item.Status))) && // 处理其他状态
    //         (!partNumber ||
    //             item.PartNumber.toLowerCase().includes(partNumber.toLowerCase())) &&
    //         (!qualifier || item.Qualifier === qualifier) &&
    //         (!project ||
    //             item.Project?.toLowerCase().includes(project.toLowerCase())) &&
    //         (!materialUser || item.MaterialUser.toString() === materialUser) &&
    //         (!rfqNumber ||
    //             item.RfqNo?.toLowerCase().includes(rfqNumber.toLowerCase())) &&
    //         (!requiredWeekFrom || (item.RequiredWeek ?? "") >= requiredWeekFrom) &&
    //         (!requiredWeekTo || (item.RequiredWeek ?? "") <= requiredWeekTo) &&
    //         (!createdDateFrom ||
    //             (item.CreateDate && new Date(parseYYMMDD(item.CreateDate)) >= createdDateFrom)) &&
    //         (!createdDateTo ||
    //             (item.CreateDate && new Date(parseYYMMDD(item.CreateDate)) <= createdDateTo))
    //     );
    //
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   }).sort((a: any, b: any) => {
    //     return b.RequiredWeek - a.RequiredWeek
    //   });
    // };


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
        setMessage("")
        setIsDialogVisible(false);
    };

    const fetchBuyerdropdown = async (input: string): Promise<IComboBoxOption[]> => {
        try {
            const client = getAADClient();
            const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser?q=${input}`;
            const response = await client.get(
                functionUrl,
                AadHttpClient.configurations.v1
            );
            const result = await response.json();
            // 返回前10个结果
            return Array.isArray(result)
                ? result.slice(0, 10).map((item) => ({
                    key: `${item.handler}`, // 唯一标识符
                    text: `${item.porg} ${item.handler} (${item.name})`, // 拼接显示内容
                    title: `${item.porg} ${item.handler} (${item.name})`, // 鼠标悬停完整显示
                }))
                : [];
        } catch (error) {
            console.error("Error fetching data:", error);
            return []; // 或者抛出错误，根据你的逻辑需求
        }
    };
    const handleInputBuyerChange = async (text: string): Promise<void> => {
        if (text) {
            try {
                comboBoxRef.current?.focus(true)
                const options = await fetchBuyerdropdown(text);
                setFilteredBuyerOptions(options); // 更新下拉框选项
            } catch (error) {
                console.error("Error fetching buyer options:", error);
            }
        } else {
            setFilteredBuyerOptions([]); // 如果输入为空，清空下拉选项
        }
    };
    const handleBuyerSelectionChange = (e: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
        if (option) {
            setSelectedBuyerValue(option.key as string); // 保存选中的 key
            // handleSearchChange('Buyer', option.key as string);
            setFilters((prev) => ({
                ...prev,
                buyer: option.key as string,
                //[userDetails.porg, userDetails.handlercode, userDetails.name]
                // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
                // .join(" "), // 用空格拼接,
            }));
            console.log("Selected Key:", option.key);
        } else {
            setSelectedBuyerValue(undefined);
            setFilters((prev) => ({
                ...prev,
                buyer: "",

            }));
            console.log("Buyer field cleard")
        }
    };
    const fetchSectionDropdown = async (input: string): Promise<IComboBoxOption[]> => {
        try {

            const response = await getSections(); // 获取所有 section 数据
            console.log("all sections: ", response);
            //const result = await response.json();
            // 过滤条件，检查 SectionCode 或 SectionDescription 是否包含用户输入
            const filteredSections = response.filter(
                (item: { SectionCode: string; SectionDescription: string }) =>
                    item.SectionCode.toLowerCase().includes(input.toLowerCase()) ||
                    item.SectionDescription.toLowerCase().includes(input.toLowerCase())
            );

            console.log("Filtered Sections: ", filteredSections);
            return filteredSections.slice(0, 10).map((item) => ({
                //key: `${item.SectionCode} ${item.SectionDescription}`, // 唯一标识符
                key: `${item.SectionCode}`, // 唯一标识符
                text: `${item.SectionCode} ${item.SectionDescription}`, // 拼接显示内容
                title: `${item.SectionCode} ${item.SectionDescription}`, // 鼠标悬停完整显示
            }))
                ;

        } catch (error) {
            console.error("Error fetching section options:", error);
            return [];
        }
    };

    const handleInputSectionChange = async (text: string): Promise<void> => {
        if (text) {
            try {
                comboBoxRefSec.current?.focus(true)
                const options = await fetchSectionDropdown(text);
                setFilteredSectionOptions(options); // 更新下拉框选项
                console.log("inputsectiontext: ", text);
            } catch (error) {
                console.error("Error fetching section options:", error);
            }
        } else {
            setFilteredSectionOptions([]); // 如果输入为空，清空下拉选项
            console.log("Input cleared, options reset.");
        }
    };

    const handleSectionSelectionChange = (e: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
        if (option) {
            setSelectedSectionValue(option.key as string); // 保存选中的 key
            setFilters((prev) => ({
                ...prev,
                section: option.key as string,
            }));
            console.log("Selected Section Key:", option.key);
        } else {
            setSelectedSectionValue(undefined);
            setFilters((prev) => ({
                ...prev,
                section: "",
            }));
            console.log("Section field cleared");
        }
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
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const initpartload = async () => {
            const curDate = getCurrentWeekYYYYWW()
            if (userDetails.role === "Manager") {

                setSelectedSectionValue(userDetails.sectionCode);
                setFilteredSectionOptions([
                    {
                        key: userDetails.sectionCode,
                        text: userDetails.sectionCode,
                    }
                ])
                setFilters((prev) => ({
                    ...prev,
                    section: userDetails.sectionCode || "",
                    requiredWeekFrom: addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12)
                }));
                await queryParts({
                    Section: userDetails.sectionCode,
                    RequiredWeekFrom: Number(addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12))
                }).then((initdata) => setFilteredItems(initdata))
            } else if (userDetails.role === "Buyer") {
                const buyerDisplayValue = `${userDetails.porg} ${userDetails.handlercode} (${userDetails.name})`;
                const buyerSelectedValue = `${userDetails.handlercode}`;
                setSelectedBuyerValue(buyerSelectedValue); // 设置选中值
                setFilteredBuyerOptions([
                    {
                        key: userDetails.handlercode, // 唯一标识符
                        text: buyerDisplayValue, // 显示内容
                    },
                ]); // 初始化下拉选项
                setFilters((prev) => ({
                    ...prev,
                    buyer: userDetails.handlercode || "",
                    requiredWeekFrom: addWeeksToYYYYWW(curDate, -12),
                    // requiredWeekTo: addWeeksToYYYYWW(curDate, 12)
                }));
                await queryParts({
                    Buyer: userDetails.handlercode,
                    RequiredWeekFrom: Number(addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12))
                }).then((initdata) => setFilteredItems(initdata))
            } else if (userDetails.role === "BizAdmin") {
                setFilters((prev) => ({
                    ...prev,
                    requiredWeekFrom: addWeeksToYYYYWW(curDate, -12),
                }));
                await queryParts({
                    RequiredWeekFrom: Number(addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12))
                }).then((initdata) => setFilteredItems(initdata))
            }
            console.log("UserDetials: ", userDetails);
            console.log("buyervalue", selectedBuyerValue)
        }
        initpartload().then(_ => _, _ => _);
    }, [userDetails]);

    console.log("currentparts", currentParts)

    // useEffect(() => {
    //   const query:IUDGSNewPartCreteriaModel = {
    //     RequisitionType: filters.requisitionType,
    //     Buyer: filters.buyer,
    //     Parma: filters.parma,
    //     Status: filters.status,
    //     Section:filters.section,
    //     PartNumber: filters.partNumber,
    //     MaterialUser:Number(filters.materialUser),
    //
    //   }
    //   console.log(query,"init")
    //   const fetchData = async ():Promise<void> => {
    //     await queryParts(query);
    //     // 你可以在这里调其他的处理函数
    //     // await searchByCondition();
    //     setFilteredItems(currentParts)
    //   };
    //
    //   fetchData().then(_ => _, _ => _); // 调用异步函数
    //
    //
    // }, [])
    //console.log(currentParts);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const SearchParts = async () => {
        if (filters.requiredWeekFrom === "") {
            showDialog('The selected Period exceeds one year, please reselect Required Week From and Required Week To')
            return
        } else if (filters.requiredWeekFrom.length > 0 && filters.requiredWeekTo === "" && !areWeeksWithinOneYear(filters.requiredWeekFrom, getCurrentWeekYYYYWW())) {
            showDialog('The selected Period exceeds one year, please reselect Required Week From and Required Week To')
            return
        } else if ((filters.requiredWeekFrom.length > 0 && filters.requiredWeekTo.length > 0) &&
            !areWeeksWithinOneYear(filters.requiredWeekTo, filters.requiredWeekFrom)) {
            console.log(filters.requiredWeekFrom, filters.requiredWeekTo)
            showDialog('The selected Period exceeds one year, please reselect Required Week From and Required Week To')
            return
        }

        const query: IUDGSNewPartCreteriaModel = {
            RequisitionType: filters.requisitionType,
            Buyer: filters.buyer,
            Parma: filters.parma,
            Status: filters.status,
            Section: filters.section,
            PartNumber: filters.partNumber,
            MaterialUser: Number(filters.materialUser),
            RequiredWeekFrom: Number(filters.requiredWeekFrom),
            RequiredWeekTo: Number(filters.requiredWeekTo),
            CreatedDateFrom: filters.createdDateFrom?.toISOString(),
            CreatedDateTo: filters.createdDateTo?.toISOString(),
            RFQNumber: filters.rfqNumber

        }
        console.log(query, "queryserch")
        setCurrentPage(1)
        const result = await queryParts(query)
        setFilteredItems(result)
        // 你可以在这里调其他的处理函数
        // await searchByCondition();


    }

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

                if (result && result.role && result.name && result.sectionCode && result.handlercode) {
                    // 如果所有字段都有值，更新状态
                    setUserDetails({
                        role: result.role,
                        name: result.name,
                        sectionCode: result.sectionCode,
                        handlercode: result.handlercode,
                        porg: result?.porg,
                        userName: userName,
                        userEmail: userEmail
                    });
                    code.current = result.handlercode
                    //await queryParts({RequiredWeekFrom:Number(addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12)),Buyer:result.handlercode,Section:result.sectionCode})

                    // console.log('tioajina',result,{RequiredWeekFrom:addWeeksToYYYYWW(getCurrentWeekYYYYWW(), -12),Buyer:result.handlercode,Section:result.sectionCode});
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
    // useEffect(() => {
    //   const fetchData = async (): Promise<void> => {
    //     await queryParts({});
    //     // 你可以在这里调其他的处理函数
    //     // await searchByCondition();
    //   };
    //
    //   fetchData().then(_ => _, _ => _); // 调用异步函数
    // }, []); // 空依赖数组确保只在组件挂载时调用
    // //searchByCondition()
    // //}, [getAllRequisitions]);

    const fieldWithTooltip = (
        label: string,
        tooltip: string,
        field: JSX.Element
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ) => {
        return (
            <div
                style={{display: "grid", gridTemplateRows: "auto auto", gap: "4px"}}
            >
                <div
                    style={{display: "flex", alignItems: "center", marginBottom: "4px"}}
                >
          <span
              style={{marginRight: "8px", fontSize: "14px", fontWeight: "500"}}
          >
            {label}
          </span>
                    <TooltipHost content={tooltip} calloutProps={{gapSpace: 0}}>
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
        <Stack className="Requisition" tokens={{childrenGap: 20,}} styles={{
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
                tokens={{childrenGap: 10}}
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
                    style={{fontSize: 16}}
                />
                <Label styles={{root: {fontWeight: "bold"}}}>{t("Search")}</Label>
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
                        style={{width: Number(itemWidth) - 30}}
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

                    {fieldWithTooltip(
                        t("Buyer"),
                        "Search by Org/Handler Code/Name",
                        <ComboBox
                            componentRef={comboBoxRef}

                            options={filteredBuyerOptions}
                            autoComplete="on"
                            allowFreeform={true}
                            openOnKeyboardFocus={true}
                            onInputValueChange={handleInputBuyerChange}
                            //onBlur={handleBlur}
                            useComboBoxAsMenuWidth={false}
                            // text={form.parma}
                            selectedKey={selectedBuyerValue}
                            //styles={comboBoxStyles}
                            onChange={handleBuyerSelectionChange}

                        />)}

                    <TextField
                        label={t("Parma")}
                        style={{width: Number(itemWidth) - 30}}
                        onChange={(e, newValue) =>
                            setFilters((prev) => ({...prev, parma: newValue || ""}))
                        }
                    />
                    {/* {fieldWithTooltip(t("Section"),
            "Search by Section code/Section Description",
            <TextField
              // label={t("Section")}
              value={filters.section}
              style={{ width: Number(itemWidth) - 30 }}
              onChange={(e, newValue) =>
                setFilters((prev) => ({ ...prev, section: newValue || "" }))
              }
            />
          )} */}
                    {fieldWithTooltip(
                        t("Section"),
                        "Search by Section code/Section Description", <ComboBox
                            componentRef={comboBoxRefSec}

                            options={filteredSectionOptions}
                            autoComplete="on"
                            allowFreeform={true}
                            openOnKeyboardFocus={true}
                            onInputValueChange={handleInputSectionChange}
                            //onBlur={handleBlur}
                            useComboBoxAsMenuWidth={false}
                            // text={form.parma}
                            selectedKey={selectedSectionValue}
                            //styles={comboBoxStyles}
                            onChange={handleSectionSelectionChange}

                        />)}
                    <Dropdown
                        label={t("Status")}
                        multiSelect
                        options={StatesType}
                        style={{width: Number(itemWidth) - 30}}
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
                    {/*<Dropdown*/}
                    {/*    label={t("Qualifier")}*/}
                    {/*    options={QualifierType}*/}
                    {/*    onChange={(e, option) =>*/}
                    {/*      setFilters((prev) => ({*/}
                    {/*        ...prev,*/}
                    {/*        qualifier: String(option?.key || ""),*/}
                    {/*      }))*/}
                    {/*    }*/}
                    {/*  />*/}

                    {/*<TextField*/}
                    {/*  label={t("Project")}*/}
                    {/*  onChange={(e, newValue) =>*/}
                    {/*    setFilters((prev) => ({ ...prev, project: newValue || "" }))*/}
                    {/*  }*/}
                    {/*/>*/}
                    <Dropdown
                        label={t("Material User")}
                        options={[
                            {key: "8374", text: "8374"},
                            {key: "2921", text: "2921"},
                            {key: "2924", text: "2924"},
                            {key: "2920", text: "2920"},
                            {key: "2922", text: "2922"},
                            {key: "8371", text: "8371"},
                            {key: "8462", text: "8462"}
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
                        label={t("RFQ No.")}
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
                            if (isValidYYYYWW(newValue) || newValue === "") {
                                setFilters((prev) => ({
                                    ...prev,
                                    // requiredWeekTo: addWeeksToYYYYWW(newValue, -12) || "",
                                }));
                                setMsg('')
                            } else {
                                setMsg('Format should be YYYYWW')
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
                        onChange={(e, newValue) => {
                            if (isValidYYYYWW(newValue) || newValue === "") {
                                setFilters((prev) => ({
                                    ...prev,
                                    // requiredWeekTo: addWeeksToYYYYWW(newValue, -12) || "",
                                }));
                                setMsgTo('')
                            } else {
                                setMsgTo('Format should be YYYYWW')
                            }
                            setFilters((prev) => ({
                                ...prev,
                                requiredWeekTo: newValue || "",
                            }))
                        }
                        }
                        errorMessage={msgTo}
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
                    <Stack.Item style={{gridRow: "3", gridColumn: "5", justifySelf: "end"}}>
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
                            onClick={async () => {
                                //const result = applyFilters();
                                await SearchParts()
                                //setFilteredItems(result);
                            }}
                        />
                    </Stack.Item>
                </Stack>
            )}

            {/* 表格和按钮区域
            <h3 className="mainTitle noMargin">{t('title')}</h3> */}
            {isFetching ? (
                <Spinner label={t("Loading...")} size={SpinnerSize.large}/>
            ) : (
                <Stack>
                    <DetailsList
                        // className="detailList"
                        items={paginatedItems} //filteredItems allRequisitions
                        columns={columns.map((col) => ({
                            ...col,
                            onColumnClick: undefined, // 禁用点击功能
                            styles: {root: {textAlign: "center"}}, // 单元格居中


                        }))}
                        setKey="ID"
                        selection={selection}
                        //layoutMode={DetailsListLayoutMode.fixedColumns}
                        selectionMode={SelectionMode.multiple}
                        styles={{
                            root: theme.detaillist.root,
                            contentWrapper: theme.detaillist.contentWrapper,
                            headerWrapper: theme.detaillist.headerWrapper,
                        }}

                        viewport={{
                            height: 0,
                            width: 0,
                        }}

                        // selectionPreservedOnEmptyClick={true}
                        // ariaLabelForSelectionColumn="Toggle selection"
                        // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        // checkButtonAriaLabel="select row"
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
            <Stack horizontal tokens={{childrenGap: 10, padding: 10}}>
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
                        if (res.length > 1 && res.includes("PP")) {
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
                    <PrimaryButton onClick={closeDialog} text="OK"/>
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