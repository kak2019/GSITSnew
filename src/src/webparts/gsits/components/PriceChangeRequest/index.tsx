/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState } from "react";
import { Stack, TextField, Dropdown, PrimaryButton, DetailsList, IColumn, Selection, SelectionMode, Icon, Label, TooltipHost, DatePicker, DefaultButton, Spinner, SpinnerSize, IconButton, IComboBox, IComboBoxOption, ComboBox } from "@fluentui/react";
import CreatePriceChangeRequest from "./CreatePriceChangeRequestDialog";
import { useTranslation } from "react-i18next";
import theme from "../../../../config/theme";
import styles from "./index.module.scss";
import AppContext from "../../../../AppContext";
import { getAADClient } from "../../../../pnpjsConfig";
import { useUser } from "../../../../hooks";
import { useUsers } from "../../../../hooks/useUsers";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
import ForwardDialog from "./ForwardDialog";
import ReturnDialog from "./ReturnDialog";
import { usePriceChange } from "../../../../hooks/usePriceChange";
import { useNavigate } from "react-router-dom";
import { ISupplierRequestSubItemFormModel, ISupplierRequest } from '../../../../model/priceChange';

// 定义数据项的类型
// interface RequestItem {
//     key: string;
//     RequestID: string;
//     PARMA: string;
//     HostBuyer: string;
//     HostBuyerName: string;
//     ExpectedEffectiveDate: string;
//     Status: string;
//     SupplierRequestedDate: string;
//     LastUpdateDate: string;
// }

const PriceChangeRequest: React.FC = () => {
    const comboBoxRefHostBuyer = React.useRef<IComboBox>(null);
    const comboBoxRefResponsibleBuyer = React.useRef<IComboBox>(null);
    const [filteredHostBuyerOptions, setFilteredHostBuyerOptions] = useState<IComboBoxOption[]>([]);
    const [selectedHostBuyerValue, setSelectedHostBuyerValue] = useState<string | undefined>();
    const [filteredResponsibleBuyerOptions, setFilteredResponsibleBuyerOptions] = useState<IComboBoxOption[]>([]);
    const [selectedResponsibleBuyerValue, setSelectedResponsibleBuyerValue] = useState<string | undefined>();
    const [isFetching, , priceChangeRequestList, , , getSupplierRequestList, , , , , , createSupplierRequestSubitems,
    ] = usePriceChange();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const { t } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const handleConfirm = (formData: any) => {
    //     console.log("Form Data Submitted:", formData);
    //     setIsDialogOpen(false);
    // };
    const { getUserType } = useUser();
    const [, supplierId, , getSupplierId] = useUsers();
    let userEmail = "";
    //let loginuserdetail = "";
    const [loginuserdetail, setLoginUserDetail] = useState<string | undefined>();
    // const [userDetails, setUserDetails] = useState({
    //     role: "",
    //     name: "",
    //     sectionCode: "",
    //     handlercode: "",
    //     porg: ""
    // });
    const [userType, setUserType] = useState<string>("Unknown");
    // const [isBuyer, setIsBuyer] = useState(false);
    const ctx = React.useContext(AppContext);

    if (!ctx || !ctx.context) {
        throw new Error("AppContext is not provided or context is undefined");
    } else {
        userEmail = ctx.context._pageContext._user.email;
        console.log("useremail", userEmail)
    }
    // 定义数据状态
    const [searchConditions, setSearchConditions] = React.useState({
        HostBuyer: "",
        SupplierRequestStatus: [] as string[],
        ExpectedEffectiveDateTo: undefined,
        ExpectedEffectiveDateFrom: undefined,
        ParmaAccurate: '',
        ParmaBlur: '',
        ResponsibleBuyer: '',
        Parma: '',
        ID: '',
    });
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份需要加 1，且补齐两位
        const day = String(date.getDate()).padStart(2, "0"); // 补齐两位
        return `${year}/${month}/${day}`;
    };
    const StatusOptions = [
        { key: "New", text: "New" },
        { key: "Returned", text: "Returned" },
        { key: "In Progress", text: "In Progress" },
        { key: "Closed", text: "Closed" },
        { key: "Cancelled", text: "Cancelled" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return priceChangeRequestList.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, priceChangeRequestList]);
    const totalPages = Math.max(1, Math.ceil(priceChangeRequestList.length / itemsPerPage));
    const goToPage = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //const creteria = JSON.parse(JSON.stringify(searchConditions));
    const navigate = useNavigate();
    //const [items, setItems] = React.useState<RequestItem[]>([]);

    const [selectedItems, setSelectedItems] = useState<ISupplierRequest[]>(
        []
    );

    const requestCreateSupplierRequestSubItem = async (items: any[]) => {
        if (!selectedItems.length) return;
        const forms: ISupplierRequestSubItemFormModel[] = items.map(item => ({
            Porg: item.porg,
            Handler: item.handlerCode,
            HandlerName: item.handlerName,
            Section: item.sectionCode,
            RequestIDRef: selectedItems[0].ID,
        }))
        console.log('forms', forms);
        const ids = await createSupplierRequestSubitems(forms)
        console.log('ids', ids);
        setIsForwardDialogOpen(false);
    }
    const handleForwardConfirm = (items: any[]): void => {
        console.log("Forwarded Items:", items);
        requestCreateSupplierRequestSubItem(items)
    };

    const handleReturnConfirm = (comments: string): void => {
        console.log("Return Comments:", comments);
        setIsReturnDialogOpen(false);
    };

    // 模拟表格数据
    // const requestData: RequestItem[] = [
    //     {
    //         key: "1",
    //         RequestID: "345678901234",
    //         PARMA: "212432",
    //         HostBuyer: "UDT 21",
    //         HostBuyerName: "First Last Name",
    //         ExpectedEffectiveDate: "MM/DD/YYYY",
    //         Status: "Requested",
    //         SupplierRequestedDate: "YYYY/MM/DD",
    //         LastUpdateDate: "YYYY/MM/DD",
    //     },
    //     {
    //         key: "2",
    //         RequestID: "345678901234",
    //         PARMA: "V",
    //         HostBuyer: "UDT 21",
    //         HostBuyerName: "First Last Name",
    //         ExpectedEffectiveDate: "MM/DD/YYYY",
    //         Status: "Requested",
    //         SupplierRequestedDate: "YYYY/MM/DD",
    //         LastUpdateDate: "YYYY/MM/DD",
    //     },
    // ];
    const fieldWithTooltip = (
        label: string,
        tooltip: string,
        field: JSX.Element
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ) => {
        return (
            <div
                style={{ display: "grid", gridTemplateRows: "auto auto", gap: "3px" }}
            >
                <div
                    style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}
                >
                    <span
                        style={{ marginRight: "8px", fontSize: "12px", fontWeight: "500" }}
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


    // 定义表格列
    const columns: IColumn[] = [
        {
            key: "RequestID", name: t("Request ID"), fieldName: "RequestID", minWidth: 130, isResizable: true,
            onRender: (item) => (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/pricechange/detail", { state: { ID: item.ID } });
                        console.log("selectedID", item.ID)
                    }}
                    style={{ color: "#0078D4", textDecoration: "underline", cursor: "pointer" }}
                >
                    {item.RequestID}
                </a>
            ),
        },
        { key: "PARMA", name: t("Parma"), fieldName: "Parma", minWidth: 100, isResizable: true, },
        { key: "HostBuyer", name: t("Host Buyer"), fieldName: "HostBuyer", minWidth: 100, isResizable: true, },
        { key: "HostBuyerName", name: t("Host Buyer Name"), fieldName: "HostBuyerName", minWidth: 150, isResizable: true, },
        {
            key: "ExpectedEffectiveDate", name: t("Expected Effective Date"), fieldName: "ExpectedEffectiveDateFrom", minWidth: 150, isResizable: true,
            onRender: (item) => {
                const utcDate = item.ExpectedEffectiveDateFrom;
                if (!utcDate) return "";
                const date = new Date(utcDate);
                // date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
                return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
            }
        },
        { key: "Status", name: t("Status"), fieldName: "SupplierRequestStatus", minWidth: 100, isResizable: true, },
        {
            key: "SupplierRequestedDate", name: t("Supplier Requested Date"), fieldName: "CreatedDate", minWidth: 150, isResizable: true,
            onRender: (item) => {
                const utcDate = item.CreatedDate;
                if (!utcDate) return "";
                const date = new Date(utcDate);
                // date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
                return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
            }
        },
        { key: "LastUpdateDate", name: t("Last Update Date"), fieldName: "LastUpdateDate", minWidth: 150, isResizable: true, },
    ];

    // const handleSearch = () => {
    //     console.log("Search Conditions:", searchConditions);
    //     // 这里可以添加过滤逻辑
    // };
    const toggleSearchBar = (): void => {
        setIsSearchVisible(!isSearchVisible);
    };

    //const fieldStyles = { root: { width: "100%" } };
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
    const selection = new Selection({
        onSelectionChanged: () => {
            console.log("Selected Items:", selection.getSelection());
            const items = selection.getSelection();
            setSelectedItems(items as ISupplierRequest[]);
        },
    });

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
    const handleInputHostBuyerChange = async (text: string): Promise<void> => {
        if (text) {
            try {
                comboBoxRefHostBuyer.current?.focus(true)
                const options = await fetchBuyerdropdown(text);
                setFilteredHostBuyerOptions(options); // 更新下拉框选项
            } catch (error) {
                console.error("Error fetching buyer options:", error);
            }
        } else {
            setFilteredHostBuyerOptions([]); // 如果输入为空，清空下拉选项
        }
    };
    const handleHostBuyerSelectionChange = (e: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
        if (option) {
            setSelectedHostBuyerValue(option.key as string); // 保存选中的 key
            // handleSearchChange('Buyer', option.key as string);
            setSearchConditions((prev) => ({
                ...prev,
                HostBuyer: option.key as string,
                //[userDetails.porg, userDetails.handlercode, userDetails.name]
                // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
                // .join(" "), // 用空格拼接,
            }));
            console.log("Selected Key:", option.key);
        }
        else {
            setSelectedHostBuyerValue(undefined);
            setSearchConditions((prev) => ({
                ...prev,
                HostBuyer: "",

            }));
            console.log("Buyer field cleard")
        }
    };

    const fetchResponsibleBuyerdropdown = async (input: string): Promise<IComboBoxOption[]> => {
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
    const handleInputResponsibleBuyerChange = async (text: string): Promise<void> => {
        if (text) {
            try {
                comboBoxRefResponsibleBuyer.current?.focus(true)
                const options = await fetchResponsibleBuyerdropdown(text);
                setFilteredResponsibleBuyerOptions(options); // 更新下拉框选项
            } catch (error) {
                console.error("Error fetching buyer options:", error);
            }
        } else {
            setFilteredResponsibleBuyerOptions([]); // 如果输入为空，清空下拉选项
        }
    };
    const handleResponsibleBuyerSelectionChange = (e: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined): void => {
        if (option) {
            setSelectedResponsibleBuyerValue(option.key as string); // 保存选中的 key
            // handleSearchChange('Buyer', option.key as string);
            setSearchConditions((prev) => ({
                ...prev,
                ResponsibleBuyer: option.key as string,
                //[userDetails.porg, userDetails.handlercode, userDetails.name]
                // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
                // .join(" "), // 用空格拼接,
            }));
            console.log("Selected Key:", option.key);
        }
        else {
            setSelectedResponsibleBuyerValue(undefined);
            setSearchConditions((prev) => ({
                ...prev,
                ResponsibleBuyer: "",

            }));
            console.log("Buyer field cleard")
        }
    };
    React.useEffect(() => {
        const initializeFilters = async (): Promise<void> => {
            try {
                // 获取用户信息
                const u = useUser();
                userEmail = u.getUserEmail(ctx);
                console.log("User Email:", userEmail);

                // 并行调用获取用户类型和角色的方法
                const [usertype, UserDetails] = await Promise.all([
                    getUserType(userEmail),
                    u.getGPSUser(userEmail),
                ]);
                setUserType(usertype);

                setLoginUserDetail(`${UserDetails?.porg} ${UserDetails?.handlercode}`);
                console.log("loginuserdetail", loginuserdetail);
                console.log("User Type:", usertype);
                console.log("GPS User Details:", UserDetails);

                const defaultConditions = { ...searchConditions };

                // 根据用户类型和角色设置默认条件
                if (usertype === "Guest") {
                    const supplierId = await getSupplierId(userEmail);
                    console.log("Supplier ID:", supplierId);

                    defaultConditions.Parma = supplierId.toString() || "";
                    setSearchConditions((prev) => ({
                        ...prev,
                        Parma: defaultConditions.Parma

                    }));
                }

                // 更新搜索条件并查询
                console.log("Default Conditions:", defaultConditions);
                setSearchConditions(defaultConditions);
                await getSupplierRequestList(defaultConditions).then(_ => _, _ => _).catch(e => console.log(e));
                console.log("initialfilter", defaultConditions)
            } catch (error) {
                console.error("Error initializing filters:", error);
            }
        }
        const executeInitialization = (): void => {
            initializeFilters().catch(error => {
                console.error("Initialization error:", error);
            });
        };

        executeInitialization();
    }, []);

    // React.useEffect(() => {
    //     setItems(requestData); // 初始化数据
    // }, []);
    // React.useEffect(() => {
    //     // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    //     const fetchData = async () => {
    //         try {
    //             const client = getAADClient(); // 请确保getAADClient()已正确实现

    //             // 使用模板字符串构建完整的函数URL
    //             const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser/${userEmail}`;

    //             const response = await client.get(
    //                 functionUrl,
    //                 AadHttpClient.configurations.v1
    //             );

    //             // 确保解析 response 时不抛出错误
    //             const result = await response.json();
    //             console.log(result);
    //             if (result && result.role && result.name && result.sectionCode && result.handlercode) {
    //                 // 如果所有字段都有值，更新状态
    //                 setUserDetails({
    //                     role: result.role,
    //                     name: result.name,
    //                     sectionCode: result.sectionCode,
    //                     handlercode: result.handlercode,
    //                     porg: result?.porg,
    //                 });


    //             } else {
    //                 console.warn("Incomplete data received:", result);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching GPS user props:", error);
    //         }
    //     };

    //     fetchData().then(
    //         (_) => _,
    //         (_) => _
    //     );
    // }, []);
    // React.useEffect(() => {
    //     // 确保仅在 userEmail 存在时调用
    //     // const creteria = JSON.parse(JSON.stringify(searchConditions));
    //     if (userEmail) {
    //         getUserType(userEmail)
    //             .then(async type => {
    //                 if (userType !== type) { // 只有当 userType 变化时才更新状态
    //                     setUserType(type);
    //                     console.log("UserType updated to: ", type);

    //                 }
    //                 if (type === "Guest") {


    //                     const supplierId = await getSupplierId(userEmail);
    //                     creteria.Parma = supplierId.toString() || "";

    //                     setSearchConditions((prev) => ({
    //                         ...prev,
    //                         Parma: creteria.Parma

    //                     }));

    //                 }
    //                 getSupplierRequestList(creteria).then(_ => _, _ => _).catch(e => console.log(e));
    //                 console.log("initialfilter", creteria)
    //             })
    //             .catch(error => console.error("Error fetching user type:", error));
    //     }
    // }, []); // 将依赖减少为关键变量


    // React.useEffect(() => {
    //     if (userDetails.role === "Manager") {

    //         setSearchConditions((prev) => ({
    //             ...prev,
    //             Section: userDetails.sectionCode || "",

    //         }));
    //     }
    //     else if (userDetails.role === "Buyer") {
    //         setSearchConditions((prev) => ({
    //             ...prev,
    //             Buyer: userDetails.handlercode || "",
    //             //[userDetails.porg, userDetails.handlercode, userDetails.name]
    //             // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
    //             // .join(" "), // 用空格拼接,
    //         }));
    //     }
    //     console.log("UserDetials: ", userDetails);

    // }, [userDetails]);

    const handleSearchChange = (key: keyof typeof searchConditions, value: string | string[] | Date | undefined): void => {
        setSearchConditions(prev => ({
            ...prev,
            [key]: value,
        }));
    };
    const applyFilters = (): void => {
        const filters = {
            ...searchConditions,
            expectedeffectivedatefrom: searchConditions.ExpectedEffectiveDateFrom
                ? new Date(new Date(searchConditions.ExpectedEffectiveDateFrom).getTime())
                : '',
            expectedeffectivedateto: searchConditions.ExpectedEffectiveDateTo
                ? new Date(new Date(searchConditions.ExpectedEffectiveDateTo).getTime())
                : '',
        };
        //setCurrentPage(1);
        console.log("filtercondition", filters);
        getSupplierRequestList(filters).then(_ => _, _ => _).catch(e => console.log(e)); // 调用 queryRFQs 方法传递过滤参数

    };

    const filterasHostBuyer = (): void => {
        const filtercondition = {           
            HostBuyer: loginuserdetail,
        }
        console.log("filterasHostBuyer", filtercondition);
        console.log("loginuserdetail", loginuserdetail);
        getSupplierRequestList(filtercondition).then(_ => _, _ => _).catch(e => console.log(e)); // 调用 queryRFQs 方法传递过滤参数
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateConfirm = (formData: any): void => {
        console.log("Create Request Data:", formData);
        setIsCreateDialogOpen(false);

        applyFilters(); // 重新加载数据
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
        }}>

            <h2 className={styles.mainTitle}>Price Change Request - Supplier</h2>

            {/* 搜索栏标题 */}
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
                            ...theme.searchbarforPriceChange
                        },
                    }}
                >

                    {fieldWithTooltip(t("Host Buyer"),
                        t("Search by Org/Handler Code/Name"),
                        // <TextField
                        //     styles={theme.TextfieldStyles}

                        //     value={searchConditions.HostBuyer}
                        //     onChange={(e, newValue) => handleSearchChange('HostBuyer', newValue || "")}
                        // />
                        <ComboBox
                            componentRef={comboBoxRefHostBuyer}

                            options={filteredHostBuyerOptions}
                            autoComplete="on"
                            allowFreeform={true}
                            openOnKeyboardFocus={true}
                            onInputValueChange={handleInputHostBuyerChange}
                            //onBlur={handleBlur}
                            useComboBoxAsMenuWidth={false}
                            // text={form.parma}
                            selectedKey={selectedHostBuyerValue}
                            //styles={comboBoxStyles}
                            onChange={handleHostBuyerSelectionChange}

                        />
                    )}
                    <Dropdown
                        label={t("Status")}
                        styles={theme.DropDownfieldStyles}
                        selectedKey={searchConditions.SupplierRequestStatus}
                        options={StatusOptions}
                        onChange={(e, option) => handleSearchChange('SupplierRequestStatus', option ? [option.key as string] : [])}
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
                        value={searchConditions.ExpectedEffectiveDateFrom ? new Date(searchConditions.ExpectedEffectiveDateFrom) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("ExpectedEffectiveDateFrom", formattedDate); // 保存格式化后的日期
                                console.log("date: ", date)
                                console.log("selected expectedEffectiveDate: ", formattedDate);
                            } else {
                                handleSearchChange("ExpectedEffectiveDateFrom", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                    // value={searchConditions.ExpectedEffectiveDateFrom}
                    // onChange={(e, newValue) =>
                    //     setSearchConditions({ ...searchConditions, ExpectedEffectiveDateFrom: newValue || "" })
                    // }
                    />
                    <DatePicker
                        label={t("Expected Effective Date To")}
                        //styles={theme.datePickerStyles}
                        allowTextInput
                        value={searchConditions.ExpectedEffectiveDateTo ? new Date(searchConditions.ExpectedEffectiveDateTo) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("ExpectedEffectiveDateTo", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("ExpectedEffectiveDateTo", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                    // styles={{
                    //     root: {
                    //       width: "100%", // 宽度占满父容器
                    //     },
                    //     textField: {
                    //       selectors: {
                    //         ".ms-TextField-fieldGroup": {
                    //           height: "30px", // 设置输入框高度
                    //           borderRadius: "4px", // 圆角边框
                    //         },
                    //         ".ms-TextField": {
                    //           fontSize: "12px", // 输入框字体大小
                    //         },
                    //       },
                    //     },
                    //   }}
                    // value={searchConditions.ExpectedEffectiveDateTo}
                    // onChange={(e, newValue) =>
                    //     setSearchConditions({ ...searchConditions, ExpectedEffectiveDateTo: newValue || "" })
                    // }
                    />


                    {userType === "Member" && (<TextField
                        label={t("Parma")}
                        value={searchConditions.Parma}
                        onChange={(e, newValue) => handleSearchChange('Parma', newValue || "")}
                        styles={theme.TextfieldStyles}
                    />)}
                    {
                        userType === "Member" && <>{fieldWithTooltip(t("Responsible Buyer"),
                            t("Search by Org/Handler Code/Name"),
                            //     <TextField
                            //     // label={t("Responsible Buyer")}
                            //     value={searchConditions.ResponsibleBuyer}
                            //     onChange={(e, newValue) => handleSearchChange('ResponsibleBuyer', newValue || "")}
                            //     styles={theme.TextfieldStyles}
                            // />

                            <ComboBox
                                componentRef={comboBoxRefResponsibleBuyer}

                                options={filteredResponsibleBuyerOptions}
                                autoComplete="on"
                                allowFreeform={true}
                                openOnKeyboardFocus={true}
                                onInputValueChange={handleInputResponsibleBuyerChange}
                                //onBlur={handleBlur}
                                useComboBoxAsMenuWidth={false}
                                // text={form.parma}
                                selectedKey={selectedResponsibleBuyerValue}
                                //styles={comboBoxStyles}
                                onChange={handleResponsibleBuyerSelectionChange}

                            />
                        )}</>
                    }

                    {/* 搜索按钮 */}
                    <Stack.Item style={{ gridRow: "2", gridColumn: "4", justifySelf: "end", alignSelf: "end" }}>
                        <PrimaryButton text={t("Search")} styles={buttonStyles} onClick={applyFilters} /></Stack.Item>


                    {/*buyer button */}
                    {userType === "Member" && (
                        <>
                            <PrimaryButton text={t("Show my request as Host Buyer")}
                                styles={{
                                    ...theme.buttonStyles,
                                    root: { ...buttonStyles.root, width: "100%" },
                                }} style={{ gridRow: "3", gridColumn: "3", justifySelf: "end" }}
                                onClick={filterasHostBuyer}
                            />

                            <PrimaryButton text={t("Show my request as Responsible Buyer")} styles={{
                                ...theme.buttonStyles,
                                root: { ...buttonStyles.root, width: "100%" },
                            }} style={{ gridRow: "3", gridColumn: "4", justifySelf: "end" }} />
                        </>
                    )}
                </Stack>

            )}
            {/* 表格区域 */}
            {/* <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                Request Info
            </Text> */}
            {isFetching ? (
                <Spinner label={t("Loading...")} size={SpinnerSize.large} />
            ) : (
                <Stack> <DetailsList
                    items={paginatedItems}
                    columns={columns}
                    selectionMode={userType === "Member" ? SelectionMode.single : SelectionMode.none}
                    //selection={userType === "Member" ? selection : undefined}
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
                </Stack>)}

            {/* 新建请求按钮 */}
            {userType === "Guest" && <><PrimaryButton text={t("Create New Request")}
                onClick={() => setIsCreateDialogOpen(true)}

                styles={{
                    ...theme.buttonStyles,
                    root: { ...buttonStyles.root, width: "170px" },
                }} />

            </>}
            {userType === "Member" && <>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <DefaultButton text={t("Forward to Responsible Buyers")}
                        onClick={() => setIsForwardDialogOpen(true)}
                        styles={{
                            ...theme.buttonStyles,
                            root: { ...buttonStyles.root, width: "170px" },
                        }} />

                    <PrimaryButton text={t("Return Reuqest")}
                        onClick={() => setIsReturnDialogOpen(true)}
                        styles={{
                            ...theme.buttonStyles,
                            root: { ...buttonStyles.root, width: "170px" },
                        }} /></Stack></>}
            <CreatePriceChangeRequest
                isOpen={isCreateDialogOpen}
                onDismiss={() => setIsCreateDialogOpen(false)}
                onConfirm={handleCreateConfirm} // 点击 Confirm 后触发重新加载数据
                parmaID={supplierId}
            //loginuserdetail = {`${userDetails.porg} ${userDetails.handlercode}`}
            />



            <ForwardDialog
                isOpen={isForwardDialogOpen}
                onDismiss={() => setIsForwardDialogOpen(false)}
                onConfirm={handleForwardConfirm}

            />
            <ReturnDialog
                isOpen={isReturnDialogOpen}
                onDismiss={() => setIsReturnDialogOpen(false)}
                onConfirm={handleReturnConfirm}

            />

        </Stack>
    );
};

export default PriceChangeRequest;
