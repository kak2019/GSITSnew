import {
    DatePicker,

    DetailsList,
    Dropdown,
    IColumn,
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
import { useRFQ } from "../../../../hooks/useRFQ";
import { useUser } from "../../../../hooks";
import AppContext from "../../../../AppContext";
import { getAADClient } from "../../../../pnpjsConfig";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
import { useUsers } from "../../../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import theme from "../../../../config/theme";
import "./index.css"


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
    EffectiveDateRequest: string;

}

const RFQ: React.FC = () => {
    const [, supplierId, , getSupplierId] = useUsers();
    let userEmail = "";
    const [isFetchingRFQ,
        allRFQs,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        queryRFQs,] = useRFQ();
    const { getUserType } = useUser();
    const [userType, setUserType] = useState<string>("Unknown");
    const { t } = useTranslation();
    const [isSearchVisible, setIsSearchVisible] = useState(true);


    const [isItemSelected, setIsItemSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allRFQs.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, allRFQs]);
    const totalPages = Math.max(1, Math.ceil(allRFQs.length / itemsPerPage));
    const goToPage = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const [searchConditions, setSearchConditions] = useState({
        RfqNo: '',
        RfqType: '',
        Buyer: '',
        Section: '',
        Status: [],
        Parma: '',
        RfqReleaseDateFrom: undefined,
        RfqReleaseDateTo: undefined,
        RfqDueDateFrom: undefined,
        RfqDueDateTo: undefined,
    });

    const [userDetails, setUserDetails] = useState({
        role: "",
        name: "",
        sectionCode: "",
        handlercode: "",
        porg: ""
    });
    const ctx = React.useContext(AppContext);
    if (!ctx || !ctx.context) {
        throw new Error("AppContext is not provided or context is undefined");
    } else {
        userEmail = ctx.context._pageContext._user.email;
        console.log("useremail", userEmail)
    }

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
    ];

    const columns: IColumn[] = [
        { key: "Parma", name: t("Parma"), fieldName: "Parma", minWidth: 100, },
        { key: "RFQNo", name: t("RFQ No."), fieldName: "RFQNo", minWidth: 140, },
        {
            key: "BuyerInfo",
            name: t("Buyer"),
            fieldName: "BuyerInfo",
            minWidth: 100,
            // maxWidth: 150
        },
        {
            key: "HandlerName",
            name: t("Handler Name"),
            fieldName: "HandlerName",
            minWidth: 100,

        },
        { key: "RFQType", name: t("Type"), fieldName: "RFQType", minWidth: 100, },
        {
            key: "ReasonOfRFQ",
            name: t("Reason of RFQ"),
            fieldName: "ReasonOfRFQ",
            minWidth: 150,

        },
        {
            key: "Created",
            name: t("RFQ Release Date"),
            fieldName: "Created",
            minWidth: 120,

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

        },
        {
            key: "EffectiveDateRequest",
            name: t("Effective Date Request"),
            fieldName: "EffectiveDateRequest",
            minWidth: 150,

            onRender: (item: Item) => {
                const utcDate = item.EffectiveDateRequest;
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



    //console.log(userEmail);
    // const [currentUserIDCode, setCurrentUserIDCode] = useState<string>("");

    React.useEffect(() => {
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

    React.useEffect(() => {
        // 确保仅在 userEmail 存在时调用
        if (userEmail) {
            getUserType(userEmail)
                .then(type => {
                    if (userType !== type) { // 只有当 userType 变化时才更新状态
                        setUserType(type);
                        console.log("UserType updated to: ", userType);
                    }
                    if (type === "Guest") {
                        console.log("supplierID", supplierId);

                        setSearchConditions((prev) => ({
                            ...prev,
                            Parma: supplierId.toString() || "",

                        }));
                    }
                })
                .catch(error => console.error("Error fetching user type:", error));
        }
    }, [userEmail, supplierId]); // 将依赖减少为关键变量

    React.useEffect(() => {
        // 如果是 Guest，且 userEmail 存在，则调用 getSupplierId
        if (userType === "Guest" && userEmail) {
            getSupplierId(userEmail);
            console.log("Usertype: ", userType)
        }


    }, [userType, getSupplierId]);


    // 创建 Selection 对象

    React.useEffect(() => {
        if (userDetails.role === "Manager") {

            setSearchConditions((prev) => ({
                ...prev,
                Section: userDetails.sectionCode || "",

            }));
        }
        else if (userDetails.role === "Buyer") {
            setSearchConditions((prev) => ({
                ...prev,
                Buyer: userDetails.handlercode || "",
                //[userDetails.porg, userDetails.handlercode, userDetails.name]
                // .filter(Boolean) // 过滤掉 `null`、`undefined` 或空字符串的值
                // .join(" "), // 用空格拼接,
            }));
        }
        console.log("UserDetials: ", userDetails);

    }, [userDetails]);
    const applyFilters = (): void => {
        const filters = {
            ...searchConditions,
            rfqreleasedateto: searchConditions.RfqReleaseDateTo
                ? new Date(new Date(searchConditions.RfqReleaseDateTo).getTime())
                : '',
            rfqduedateto: searchConditions.RfqDueDateTo
                ? new Date(new Date(searchConditions.RfqDueDateTo).getTime())
                : '',
        };
        setCurrentPage(1);

        queryRFQs(filters); // 调用 queryRFQs 方法传递过滤参数
    };

    React.useEffect (() => {
        queryRFQs({})
    },[])



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
            <h2 className="mainTitle">RFQ & Quote</h2>

            {/* 搜索栏标题 */}
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
                    className="noMargin"
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
                        selectedKey={searchConditions.RfqType}
                        onChange={(e, option) => handleSearchChange('RfqType', option?.key?.toString() as string || '')}
                        options={typeOptions}
                        styles={fieldStyles}
                    />
                    <TextField
                        label={t("RFQ No.")}
                        value={searchConditions.RfqNo}
                        onChange={(e, newValue) => handleSearchChange('RfqNo', newValue || "")}
                        styles={fieldStyles}
                    />
                    {fieldWithTooltip(
                        t("Buyer"),
                        "Search by Org/Handler Code/Name",
                        <TextField
                            value={searchConditions.Buyer}
                            onChange={(e, newValue) => handleSearchChange('Buyer', newValue || "")}
                            styles={fieldStyles}
                        />
                    )}
                    {fieldWithTooltip(
                        t("Section"),
                        "Search by Section code/Section Description",
                        <TextField
                            value={searchConditions.Section}

                            onChange={(e, newValue) => handleSearchChange('Section', newValue || "")}
                            styles={fieldStyles}
                        />
                    )}
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
                        value={searchConditions.Parma}
                        onChange={(e, newValue) => handleSearchChange('Parma', newValue || "")}
                        styles={fieldStyles}
                    />)}
                    <DatePicker
                        label={t("RFQ Released Date From")}
                        value={searchConditions.RfqReleaseDateFrom ? new Date(searchConditions.RfqReleaseDateFrom) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RfqReleaseDateFrom", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RfqReleaseDateFrom", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Released Date To")}
                        value={searchConditions.RfqReleaseDateTo ? new Date(searchConditions.RfqReleaseDateTo) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                console.log("Selected Date:", date);
                                console.log("ISO String:", date.toISOString()); // 转为 UTC 时间的字符串
                                console.log("Locale String:", date.toLocaleString()); // 转为本地时间字符串
                                console.log("Time Zone Offset (minutes):", date.getTimezoneOffset()); // 获取时区偏移量，单位是分钟
                                console.log("searchConditions:", searchConditions.Section);


                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RfqReleaseDateTo", formattedDate); // 保存格式化后的日期
                            } else handleSearchChange("RfqReleaseDateTo", "")
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Due Date From")}
                        value={searchConditions.RfqDueDateFrom ? new Date(searchConditions.RfqDueDateFrom) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RfqDueDateFrom", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RfqDueDateFrom", "");
                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        styles={fieldStyles}
                        allowTextInput
                    />
                    <DatePicker
                        label={t("RFQ Due Date To")}
                        value={searchConditions.RfqDueDateTo ? new Date(searchConditions.RfqDueDateTo) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date); // 格式化日期为 yyyy/mm/dd
                                handleSearchChange("RfqDueDateTo", formattedDate); // 保存格式化后的日期
                            } else {
                                handleSearchChange("RfqDueDateTo", "");
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
            {isFetchingRFQ ? (
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