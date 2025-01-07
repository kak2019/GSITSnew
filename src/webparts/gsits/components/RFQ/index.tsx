import {
    ComboBox,
    DatePicker,

    DetailsList,
    Dropdown,
    IColumn,
    IComboBox,
    IComboBoxOption,
    Icon,
    IconButton,
    IDropdownOption,
    Label,
    PrimaryButton,
    Selection,
    SelectionMode,
    Spinner,
    SpinnerSize,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
//import { useRFQ } from "../../../../hooks/useRFQ";
import { useUser } from "../../../../hooks";
import AppContext from "../../../../AppContext";
//import { getAADClient } from "../../../../pnpjsConfig";
//import { CONST } from "../../../../config/const";
//import { AadHttpClient } from "@microsoft/sp-http";
import { useNavigate } from "react-router-dom";
import theme from "../../../../config/theme";
// import styles from "./index.module.scss";
// import styles from "../App.module.scss";
import styles from "./index.module.scss";
import { useUDGSRFQ } from "../../../../hooks-v2/use-udgs-rfq";
import { getAADClient } from "../../../../pnpjsConfig";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
import { useUDGSUser } from "../../../../hooks-v2/use-udgs-user";


// 定义接口
interface Item {
    //ID: string,
    key: string;
    Parma: string;
    RFQNo: string;
    BuyerInfo: string;
    HandlerName: string;
    RFQType: string;
    ReasonOfRFQ: string;
    Created: Date;
    RFQDueDate: Date;
    RFQStatus: string;
    EffectiveDateSupplier: string;

}


const RFQ: React.FC = () => {
    const comboBoxRef = React.useRef<IComboBox>(null);
    const comboBoxRefSec = React.useRef<IComboBox>(null);
    //const [, , , getSupplierId] = useUsers();
    const [, , , , , getSupplierId, , getSections,] = useUDGSUser();
    let userEmail = "";
    // const [isFetchingRFQ,
    //     allRFQs,
    //     ,
    //     ,
    //     ,
    //     ,
    //     ,
    //     ,
    //     ,
    //     queryRFQs,] = useRFQ();
    const [isFetching,
        ,
        queriedRFQs,
        ,
        queryRFQs,
        ,
        ,
        ,] = useUDGSRFQ();
    const { getUserType } = useUser();
    const [userType, setUserType] = useState<string>("Unknown");
    const { t } = useTranslation();
    const [isSearchVisible, setIsSearchVisible] = useState(true);

    const [isItemSelected, setIsItemSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [filteredBuyerOptions, setFilteredBuyerOptions] = useState<IComboBoxOption[]>([]);
    const [selectedBuyerValue, setSelectedBuyerValue] = useState<string | undefined>();
    const [filteredSectionOptions, setFilteredSectionOptions] = useState<IComboBoxOption[]>([]);
    const [selectedSectionValue, setSelectedSectionValue] = useState<string | undefined>();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return queriedRFQs.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, queriedRFQs]);
    const totalPages = Math.max(1, Math.ceil(queriedRFQs.length / itemsPerPage));
    const goToPage = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const [searchConditions, setSearchConditions] = useState({
        RFQNo: '',
        RFQType: '',
        Buyer: '',
        Section: '',
        Status: [],
        ParmaAccurate: '',
        ParmaBlur: '',
        RFQReleaseDateFrom: undefined,
        RFQReleaseDateTo: undefined,
        RFQDueDateFrom: undefined,
        RFQDueDateTo: undefined,
    });

    // const [userDetails, setUserDetails] = useState({
    //     role: "",
    //     name: "",
    //     sectionCode: "",
    //     handlercode: "",
    //     porg: ""
    // });
    // const ctx = React.useContext(AppContext);
    // if (!ctx || !ctx.context) {
    //     throw new Error("AppContext is not provided or context is undefined");
    // } else {
    //     userEmail = ctx.context._pageContext._user.email;
    //     console.log("useremail", userEmail)
    // }

    const selection = React.useRef<Selection>(new Selection({
        onSelectionChanged: () => {
            const selected = selection.current.getSelection() as Item[]; // 使用 Item 类型断言
            setSelectedItems(selected);
            // const selectedCount = selection.getSelectedCount();
            setIsItemSelected(selected.length > 0);
            // console.log("isselected: ", isItemSelected)
            console.log("Selected item: ", selected);


        },
    }));
    const navigate = useNavigate();

    const handleViewRFQ = (): void => {
        navigate("/rfq/quotation", { state: { selectedItems } });
    };



    const typeOptions = [
        { key: "", text: "All" },
        { key: "New Part Price", text: "New Part Price" },
        { key: "Price Change", text: "Price Change" },
    ];
    const statusOptions = [

        { key: "New", text: "New" },
        { key: "In Progress", text: "In Progress" },
        { key: "Sent to GPS", text: "Sent to GPS" },
        { key: "Closed", text: "Closed" },
    ];

    const columns: IColumn[] = [
        { key: "Parma", name: t("Parma"), fieldName: "Parma", minWidth: 100, isResizable: true, },
        { key: "RFQNo", name: t("RFQ No."), fieldName: "RFQNo", minWidth: 140, isResizable: true, },
        {
            key: "BuyerInfo",
            name: t("Buyer"),
            fieldName: "BuyerInfo",
            minWidth: 100,
            isResizable: true,
            // maxWidth: 150
        },
        {
            key: "HandlerName",
            name: t("Handler Name"),
            fieldName: "HandlerName",
            minWidth: 100,
            isResizable: true,

        },
        { key: "RFQType", name: t("Type"), fieldName: "RFQType", minWidth: 100, isResizable: true, },
        // {
        //     key: "ReasonOfRFQ",
        //     name: t("Reason of RFQ"),
        //     fieldName: "ReasonOfRFQ",
        //     minWidth: 150,
        //     isResizable: true,
        // },
        {
            key: "Created",
            name: t("RFQ Release Date"),
            fieldName: "Created",
            minWidth: 120,
            isResizable: true,
            onRender: (item: Item) => {
                const utcDate = item.Created;
                if (!utcDate) return "";
                const date = new Date(utcDate);
                // date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
                return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
            }
        },

        {
            key: "RFQDueDate",
            name: t("RFQ Due Date"),
            fieldName: "RFQDueDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item: Item) => {
                const utcDate = item.RFQDueDate;
                if (!utcDate) return "";
                const date = new Date(utcDate);
                date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
                return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
            }
        },
        {
            key: "RFQStatus",
            name: t("Status"),
            fieldName: "RFQStatus",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "EffectiveDateSupplier",
            name: t("Effective Date (Supplier)"),
            fieldName: "EffectiveDateSupplier",
            minWidth: 150,
            isResizable: true,
            onRender: (item: Item) => {
                const utcDate = item.EffectiveDateSupplier;
                if (!utcDate) return "";
                const date = new Date(utcDate);
                date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
                return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
            },

        },

    ];

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份需要加 1，且补齐两位
        const day = String(date.getDate()).padStart(2, "0"); // 补齐两位
        return `${year}/${month}/${day}`;
    };

    const fieldStyles = { root: { width: "100%" } };

    const toggleSearchBar = (): void => {
        setIsSearchVisible(!isSearchVisible);
    };

    const buttonStyles = {
        root: {
            backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
            color: "black", // 设置文字颜色为黑色
            width: "100px", // 设置按钮宽度
            height: "36px", // 设置按钮高度
            border: "none", // 去掉边框
            borderRadius: "4px", // 设置按钮的圆角
        },
        rootHovered: {
            backgroundColor: "#0F6CBD", // 设置悬停时的背景色，更深的蓝色
            color: "white",
        },
        rootPressed: {
            backgroundColor: "#0F6CBD",
        },
    };

    const ctx = React.useContext(AppContext);

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
                    key: `${item.porg} ${item.handler}`, // 唯一标识符
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
            setSearchConditions((prev) => ({
                ...prev,
                Buyer: option.key as string,
                //[userDetails.porg, userDetails.handlercode, userDetails.name]
                // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
                // .join(" "), // 用空格拼接,
            }));
            console.log("Selected Key:", option.key);
        }
        else {
            setSelectedBuyerValue(undefined);
            setSearchConditions((prev) => ({
                ...prev,
                Buyer: "",

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
                key: `${item.SectionCode} ${item.SectionDescription}`, // 唯一标识符
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
            setSearchConditions((prev) => ({
                ...prev,
                Section: option.key as string,
            }));
            console.log("Selected Section Key:", option.key);
        } else {
            setSelectedSectionValue(undefined);
            setSearchConditions((prev) => ({
                ...prev,
                Section: "",
            }));
            console.log("Section field cleared");
        }
    };


    //console.log(userEmail);
    // const [currentUserIDCode, setCurrentUserIDCode] = useState<string>("");
    // React.useEffect((): void => {
    //     // Dome function app
    //     const fetchData = async (): Promise<void> => {
    //         try {

    //             const u = useUser();
    //             userEmail = u.getUserEmail(ctx);
    //             console.log(userEmail);
    //             // const r = await u.getUserType(userEmail);
    //             // console.log(r);
    //             const result = await u.getGPSUser(userEmail);
    //             console.log(result);
    //             if (result) {
    //                 setUserDetails({
    //                     role: result?.role,
    //                     name: result.name,
    //                     sectionCode: result.sectionCode,
    //                     handlercode: result.handlercode,
    //                     porg: result?.porg,
    //                 });

    //             }
    //         }
    //         catch (error) {
    //             console.error(error);

    //         }
    //     };
    //     fetchData().then(_ => _, _ => _);

    // }, []);

    // React.useEffect(() => {

    //     //const r=await u.getUserType('gmanuel@magnistrucks.com');
    //     //const r=await u.getUserSupplierId('gmanuel@magnistrucks.com');

    //     //const email = ctx.context._pageContext._user.email;
    //     const creteria = JSON.parse(JSON.stringify(searchConditions));
    //     if (userEmail) {
    //         getUserType(userEmail).then(async (type) => {
    //             if (userType !== type) { // 只有当 userType 变化时才更新状态
    //                 setUserType(type);
    //                 console.log("UserType updated to: ", userType);
    //             }
    //             if (type === "Guest") {
    //                 const supplierId = await getSupplierId(userEmail);
    //                 console.log("Supplier id: ", supplierId);
    //                 creteria.ParmaAccurate = supplierId.toString() || "";
    //             }
    //             setSearchConditions((prev) => ({
    //                 ...prev,
    //                 ParmaAccurate: creteria.ParmaAccurate,
    //             }));
    //             console.log("creteria condition: ",creteria);
    //             console.log("searchcondition: ",searchConditions);
    //             queryRFQs(creteria).then(_ => _, _ => _);
    //         }).catch((err) => { console.log(err) });
    //     }
    // }, [])



    // React.useEffect(() => {
    //     if (userDetails.role === "Manager") {
    //         setSelectedSectionValue(userDetails.sectionCode);
    //         setFilteredSectionOptions([
    //             {
    //                 key: userDetails.sectionCode,
    //                 text: userDetails.sectionCode,
    //             }
    //         ])
    //         setSearchConditions((prev) => ({
    //             ...prev,
    //             Section: userDetails.sectionCode || "",

    //         }));
    //     }
    //     //${userDetails.porg} 
    //     else if (userDetails.role === "Buyer") {
    //         const buyerDisplayValue = `${userDetails.porg} ${userDetails.handlercode} (${userDetails.name})`;
    //         const buyerSelectedValue = `${userDetails.porg} ${userDetails.handlercode}`;
    //         setSelectedBuyerValue(buyerSelectedValue); // 设置选中值
    //         setFilteredBuyerOptions([
    //             {
    //                 key: buyerSelectedValue, // 唯一标识符
    //                 text: buyerDisplayValue, // 显示内容
    //             },
    //         ]); // 初始化下拉选项
    //         setSearchConditions((prev) => ({
    //             ...prev,
    //             Buyer: buyerSelectedValue || "",
    //             //Buyer: userDetails.handlercode || "",
    //             //[userDetails.porg, userDetails.handlercode, userDetails.name]
    //             // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
    //             // .join(" "), // 用空格拼接,
    //         }));
    //     }
    //     console.log("UserDetials: ", userDetails);
    //     console.log("buyervalue", selectedBuyerValue)

    // }, [userDetails]);

    React.useEffect(() => {
        const initializeFilters = async ():Promise<void>=> {
            try {
                // 获取用户信息
                const u = useUser();
                userEmail = u.getUserEmail(ctx);
                console.log("supplierdetail: ",ctx);
                console.log("User Email:", userEmail);

                // 并行调用获取用户类型和角色的方法
                const [usertype, UserDetails] = await Promise.all([
                    getUserType(userEmail),
                    u.getGPSUser(userEmail),
                ]);
                setUserType(usertype);
                console.log("User Type:", usertype);
                console.log("GPS User Details:", UserDetails);
    
                const defaultConditions = { ...searchConditions };
    
                // 根据用户类型和角色设置默认条件
                if (usertype === "Guest") {
                    const supplierId = await getSupplierId(userEmail);
                    console.log("Supplier ID:", supplierId);
    
                    defaultConditions.ParmaAccurate = supplierId.toString() || "";
                } else if (UserDetails?.role === "Manager") {
                    defaultConditions.Section = UserDetails.sectionCode || "";
                    setSelectedSectionValue(UserDetails.sectionCode);
                    setFilteredSectionOptions([
                        {
                            key: UserDetails.sectionCode,
                            text: UserDetails.sectionCode,
                        },
                    ]);
                } else if (UserDetails?.role === "Buyer") {
                    const buyerDisplayValue = `${UserDetails.porg} ${UserDetails.handlercode} (${UserDetails.name})`;
                    const buyerSelectedValue = `${UserDetails.porg} ${UserDetails.handlercode}`;
                    defaultConditions.Buyer = buyerSelectedValue || "";
                    setSelectedBuyerValue(buyerSelectedValue);
                    setFilteredBuyerOptions([
                        {
                            key: buyerSelectedValue,
                            text: buyerDisplayValue,
                        },
                    ]);
                }
    
                // 更新搜索条件并查询
                console.log("Default Conditions:", defaultConditions);
                setSearchConditions(defaultConditions);
                await queryRFQs(defaultConditions);
            } catch (error) {
                console.error("Error initializing filters:", error);
            }
        };
    
        const executeInitialization = () :void => {
            initializeFilters().catch(error => {
                console.error("Initialization error:", error);
            });
        };
    
        executeInitialization();
    }, []);
    



    const applyFilters = (): void => {
        const filters = {
            ...searchConditions,
            rfqreleasedateto: searchConditions.RFQReleaseDateTo
                ? new Date(new Date(searchConditions.RFQReleaseDateTo).getTime())
                : '',
            rfqduedateto: searchConditions.RFQDueDateTo
                ? new Date(new Date(searchConditions.RFQDueDateTo).getTime())
                : '',
        };
        setCurrentPage(1);

        queryRFQs(filters).then(_ => _, _ => _); // 调用 queryRFQs 方法传递过滤参数
    };

    //React.useEffect(() => {
    //    if (searchConditions.ParmaAccurate) {
    //        queryRFQs(searchConditions);
    //    }
    //}, [searchConditions]);


    const handleMultiSelectChange = <K extends keyof typeof searchConditions>(
        key: K,
        option?: IDropdownOption
    ): void => {
        setSearchConditions(prev => {
            const currentSelection = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
            const updatedSelection = option?.selected
                ? [...currentSelection, option.key as string] // 如果选中，添加到数组
                : currentSelection.filter(item => item !== option?.key); // 如果取消选中，从数组中移除
            return {
                ...prev,
                [key]: updatedSelection, // 更新状态
            };
        });
    };
    const handleSearchChange = (key: keyof typeof searchConditions, value: string | string[] | Date): void => {
        setSearchConditions(prev => ({
            ...prev,
            [key]: value,
        }));
    };

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
        <Stack tokens={{ childrenGap: 20 }} styles={{
            root: {
                width: "100%",
                paddingTop: 0, // 去掉顶部空白
                paddingLeft: 20, // 保留左右空白
                paddingRight: 20,
                paddingBottom: 0, // 保留左右空白
                margin: "0"
            }
        }} >
            <h2 className={styles.mainTitle}>RFQ & Quote</h2>

            {/* 搜索栏标题 */}
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
                        //marginBottom: 0,
                        margin: 0,
                    },

                }}
                onClick={toggleSearchBar}
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
                            ...theme.searchbar
                        },
                    }}
                >


                    {/* 第一行 */}

                    <Dropdown
                        label={t("Type")}
                        placeholder="Optional"
                        selectedKey={searchConditions.RFQType}
                        onChange={(e, option) => handleSearchChange('RFQType', option?.key?.toString() as string || '')}
                        options={typeOptions}
                        styles={fieldStyles}
                    />
                    <TextField
                        label={t("RFQ No.")}
                        value={searchConditions.RFQNo}
                        onChange={(e, newValue) => handleSearchChange('RFQNo', newValue || "")}
                        styles={fieldStyles}
                    />
                    {/* {fieldWithTooltip(
                        t("Buyer"),
                        "Search by Org/Handler Code/Name",
                        <TextField
                            value={searchConditions.Buyer}
                            onChange={(e, newValue) => handleSearchChange('Buyer', newValue || "")}
                            styles={fieldStyles}
                        />
                    )} */}

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
                    {/* {fieldWithTooltip(
                        t("Section"),
                        "Search by Section code/Section Description",
                        <TextField
                            value={searchConditions.Section}

                            onChange={(e, newValue) => handleSearchChange('Section', newValue || "")}
                            styles={fieldStyles}
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
                        selectedKeys={searchConditions.Status}
                        multiSelect
                        onChange={(e, option) => {
                            if (option) { console.log("Selected status: ", option) }
                            handleMultiSelectChange('Status', option)
                        }}
                        options={statusOptions}

                        styles={fieldStyles}
                    />


                    {/* 第二行 */}

                    {userType === "Member" && (<TextField
                        label={t("Parma")}
                        value={searchConditions.ParmaBlur}
                        onChange={(e, newValue) => handleSearchChange('ParmaBlur', newValue || "")}
                        styles={fieldStyles}
                    />)}

                    <DatePicker
                        label={t("RFQ Released Date From")}
                        value={searchConditions.RFQReleaseDateFrom ? new Date(searchConditions.RFQReleaseDateFrom) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RFQReleaseDateFrom", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RFQReleaseDateFrom", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Released Date To")}
                        value={searchConditions.RFQReleaseDateTo ? new Date(searchConditions.RFQReleaseDateTo) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                console.log("Selected Date:", date);
                                console.log("ISO String:", date.toISOString()); // 转为 UTC 时间的字符串
                                console.log("Locale String:", date.toLocaleString()); // 转为本地时间字符串
                                console.log("Time Zone Offset (minutes):", date.getTimezoneOffset()); // 获取时区偏移量，单位是分钟
                                console.log("searchConditions:", searchConditions.Section);


                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RFQReleaseDateTo", formattedDate); // 保存格式化后的日期
                            } else handleSearchChange("RFQReleaseDateTo", "")
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Due Date From")}
                        value={searchConditions.RFQDueDateFrom ? new Date(searchConditions.RFQDueDateFrom) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RFQDueDateFrom", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RFQDueDateFrom", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Due Date To")}
                        value={searchConditions.RFQDueDateTo ? new Date(searchConditions.RFQDueDateTo) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RFQDueDateTo", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RFQDueDateTo", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />

                    {/* 搜索按钮 */}
                    <Stack.Item style={{ gridRow: "3", gridColumn: "5", justifySelf: "end" }}>
                        <PrimaryButton
                            text={t("Search")}
                            styles={buttonStyles}
                            onClick={applyFilters}
                        />
                    </Stack.Item>

                </Stack>
            )}

            {/* 结果展示区域 */}
            {isFetching ? (
                <Spinner label={t("Loading...")} size={SpinnerSize.large} />
            ) : (
                <Stack>
                    <DetailsList
                        items={paginatedItems}
                        columns={columns.map((col) => ({
                            ...col,
                            onColumnClick: undefined, // 禁用点击功能
                            styles: { root: { textAlign: "center" } }, // 单元格居中


                        }))}
                        selection={selection.current}
                        selectionMode={SelectionMode.single} // single select

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

                    {/* 分页控件 */}
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
                                    ...theme.paginated.paginatedicon.root
                                },
                                icon: {
                                    ...theme.paginated.paginatedicon.icon

                                },
                                rootHovered: {
                                    ...theme.paginated.paginatedicon.rootHovered
                                },
                                rootDisabled: {
                                    ...theme.paginated.paginatedicon.rootDisabled
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
                                    ...theme.paginated.paginatedicon.root
                                },
                                icon: {
                                    ...theme.paginated.paginatedicon.icon

                                },
                                rootHovered: {
                                    ...theme.paginated.paginatedicon.rootHovered
                                },
                                rootDisabled: {
                                    ...theme.paginated.paginatedicon.rootDisabled
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
                                    ...theme.paginated.paginatedicon.root
                                },
                                icon: {
                                    ...theme.paginated.paginatedicon.icon

                                },
                                rootHovered: {
                                    ...theme.paginated.paginatedicon.rootHovered
                                },
                                rootDisabled: {
                                    ...theme.paginated.paginatedicon.rootDisabled
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
                                    ...theme.paginated.paginatedicon.root
                                },
                                icon: {
                                    ...theme.paginated.paginatedicon.icon

                                },
                                rootHovered: {
                                    ...theme.paginated.paginatedicon.rootHovered
                                },
                                rootDisabled: {
                                    ...theme.paginated.paginatedicon.rootDisabled
                                },
                            }}
                        />
                    </Stack>
                </Stack>
            )}

            {/* <Stack.Item style={{ gridColumn: '5', justifySelf: 'end' }}>
              <PrimaryButton text="View" styles={buttonStyles} onClick={() => console.log('Button clicked')} />
                      </Stack.Item> */}
            <Stack.Item style={{ gridColumn: "5", justifySelf: "end" }}>
                <PrimaryButton
                    text={t("View")}
                    disabled={!isItemSelected}
                    styles={buttonStyles}
                    onClick={() => {
                        // alert(
                        //     `Selected items: ${selectedItems
                        //         .map((item) => item.Parma)
                        //         .join(", ")}`
                        // );
                        // const selectedItems = selection.getSelection() as Item[];
                        handleViewRFQ();
                    }}
                />
            </Stack.Item>
        </Stack>
    );
};

export default RFQ;

