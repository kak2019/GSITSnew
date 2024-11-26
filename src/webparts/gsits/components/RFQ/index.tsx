import {
    DatePicker,
    DefaultPalette,
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
    RFQReleaseDate: string;
    RFQDueDate: string;
    RFQStatus: string;
    EffectiveDateRequest: string;

}

const RFQ: React.FC = () => {
    const [, supplierId, , getSupplierId] = useUsers() ;
    let userEmail = "";
    const [isFetchingRFQ, allRFQs, , getAllRFQs, , , ,] = useRFQ();
    const {getUserType} =useUser();
    const [userType, setUserType] = useState<string>("Unknown");
    
    // const [
    //     ,
    //     allRequisitions,
    //     errorMessage,
    //     getAllRequisitions,
    //     updateRequisition,
    //   ] = useRequisition();

    const { t } = useTranslation();
    const [isSearchVisibel, setIsSearchVisible] = useState(true);
    const [rfqReleaseDateTo, setRfqReleaseDateTo] = useState<Date | undefined>(undefined);
    const [rfqReleaseDateFrom, setRfqReleaseDateFrom] = useState<Date | undefined>(undefined);
    const [rfqDueDateFrom, setRfqDueDateFrom] = useState<Date | undefined>(undefined);
    const [rfqDueDateTo, setRfqDueDateTo] = useState<Date | undefined>(undefined);
    const [sortedItems, setSortedItems] = useState<Item[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchConditions, setSearchConditions] = useState({
        rfqno: '',
        rfqtype: '',
        buyer: '',
        section: '',
        status: [],
        parma: '',
        rfqreleasedatefrom: '',
        rfqreleasedateto: '',
        rfqduedatefrom: '',
        rfqduedateto: '',
    });
    const [appliedFilters, setAppliedFilters] = useState({
        rfqno: '',
        rfqtype: '',
        buyer: '',
        section: '',
        status: [] as string[],
        parma: '',
        rfqreleasedatefrom: '',
        rfqreleasedateto: '',
        rfqduedatefrom: '',
        rfqduedateto: '',
    });



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
        { key: "Parma", name: t("Parma"), fieldName: "Parma", minWidth: 100 },
        { key: "RFQNo", name: t("RFQNo"), fieldName: "RFQNo", minWidth: 100 },
        {
            key: "BuyerInfo",
            name: t("BuyerInfo"),
            fieldName: "BuyerInfo",
            minWidth: 100,
        },
        {
            key: "HandlerName",
            name: t("Handler Name"),
            fieldName: "HandlerName",
            minWidth: 100,
        },
        { key: "RFQType", name: t("RFQType"), fieldName: "RFQType", minWidth: 100 },
        {
            key: "ReasonOfRFQ",
            name: t("Reason of RFQ"),
            fieldName: "ReasonOfRFQ",
            minWidth: 150,
        },
        {
            key: "Created",
            name: t("Created"),
            fieldName: "RFQReleaseDate",
            minWidth: 80,
        },
        {
            key: "RFQDueDate",
            name: t("RFQ Due Date"),
            fieldName: "RFQDueDate",
            minWidth: 100,
        },
        {
            key: "RFQStatus",
            name: t("RFQStatus"),
            fieldName: "RFQStatus",
            minWidth: 100,
        },
        {
            key: "EffectiveDateRequest",
            name: t("Effective Date Request"),
            fieldName: "EffectiveDateRequest",
            minWidth: 100,
        },
    ];


    const fieldStyles = { root: { width: "100%" } };

    const toggleSearchBar = (): void => {
        setIsSearchVisible(!isSearchVisibel);
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
    if (!ctx || !ctx.context) {
      throw new Error("AppContext is not provided or context is undefined");
    } else {
      userEmail = ctx.context._pageContext._user.email;
      console.log("useremail",userEmail)
    }
    const [userDetails, setUserDetails] = useState({
      role: "",
      name: "",
      sectionCode: "",
      handlercode: ""
    });
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
                        console.log("UserType updated to: ", type);
                    }
                    if (type === "Guest") {
                        console.log("supplierID", supplierId);
                        setAppliedFilters((prev) => ({
                            ...prev,
                            parma: supplierId.toString() || "",
                            
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
           
            
        }
        
    }, [userType, userEmail, getSupplierId]);
    
      

    //   React.useEffect(()=>{
    //     if(userType === "Guest" && userEmail){
    //     getSupplierId(userEmail)}
    //   },[getSupplierId,userEmail]);

    //   // 获取用户类型
    //   React.useEffect(() => {
    //     const fetchUserType = async () => {
    //         const identifier = userEmail; // 替换为实际的用户标识符
    //         getUserType(identifier)
    // .then(type => {
    //     setUserType(type);
    //     if(type === "Member")
    //         {setAppliedFilters((prev) => ({
    //         ...prev,
    //         parma: supplierId.toString() || "",
    //       }));}
    //     console.log("UserType: ", type);
        
    // })

    // .catch(error => {
    //     console.error("Error fetching user type:", error);
    // });
    //     };

    //     void fetchUserType();
    // }, [getUserType]);
    

    // 创建 Selection 对象
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

    React.useEffect(() => {
        if (userDetails.role === "Manager") {
            setAppliedFilters((prev) => ({
            ...prev,
            section: userDetails.sectionCode || "",
          }));
        } 
        console.log("UserDetials: ", userDetails)
      }, [userDetails]);

    React.useEffect(() => {
        getAllRFQs();
    }, [getAllRFQs]);



    const applyFilters = () :void=> {

        setAppliedFilters({
            ...searchConditions,
            rfqreleasedatefrom: rfqReleaseDateFrom
                ? rfqReleaseDateFrom.toISOString()
                : "",
            rfqreleasedateto: rfqReleaseDateTo
                ? new Date(rfqReleaseDateTo.getTime() + 86400000).toISOString()
                : "",
            rfqduedatefrom: rfqDueDateFrom ? rfqDueDateFrom.toISOString() : "",
            rfqduedateto: rfqDueDateTo ? new Date(rfqDueDateTo.getTime() + 86400000).toISOString() : "",
        });
    };
    
    const handleMultiSelectChange = <K extends keyof typeof searchConditions>(
        key: K,
        option?: IDropdownOption
    ) => {
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
    

    const getFilteredItems = () => {
        return allRFQs.filter(item => {
            const releaseDate = new Date(item.Created || "");
            const dueDate = new Date(item.RFQDueDate || "");

            const releaseFrom = appliedFilters.rfqreleasedatefrom
                ? new Date(appliedFilters.rfqreleasedatefrom) // 转回 Date 对象
                : null;
            const releaseTo = appliedFilters.rfqreleasedateto
                ? new Date(appliedFilters.rfqreleasedateto)
                : null;
            const dueFrom = appliedFilters.rfqduedatefrom
                ? new Date(appliedFilters.rfqduedatefrom)
                : null;
            const dueTo = appliedFilters.rfqduedateto
                ? new Date(appliedFilters.rfqduedateto)
                : null;
            // 更新 status 过滤逻辑
        const statusFilter = appliedFilters.status.length === 0
        ? true // 如果没有选择任何状态，表示不过滤
        : appliedFilters.status.includes(item.RFQStatus || ""); // 检查记录的 RFQStatus 是否在选择列表中
        const parmaMatch = userType === "Guest" ? item.Parma === appliedFilters.parma // 严格匹配
        : !appliedFilters.parma || item.Parma?.toLowerCase().includes(appliedFilters.parma.toLowerCase());

            return (
                statusFilter && parmaMatch &&
                (!appliedFilters.rfqtype || item.RFQType?.toLowerCase() === appliedFilters.rfqtype.toLowerCase()) &&
                (!appliedFilters.rfqno || item.RFQNo?.toLowerCase().includes(appliedFilters.rfqno.toLowerCase())) &&
                (!appliedFilters.buyer || (item.BuyerInfo?.toLowerCase().includes(appliedFilters.buyer.toLowerCase())) || item.HandlerName?.toLowerCase().includes(appliedFilters.buyer.toLowerCase())) &&
                (!appliedFilters.section || item.SectionInfo?.toLowerCase().includes(appliedFilters.section.toLowerCase())) &&
                (!appliedFilters.parma || item.Parma?.toLowerCase().includes(appliedFilters.parma.toLowerCase())) &&
                (!releaseFrom ||
                    (releaseDate >= releaseFrom)) &&
                (!releaseTo ||
                    releaseDate <= releaseTo) &&
                (!dueFrom ||
                    dueDate >= dueFrom) &&
                (!dueTo ||
                    dueDate <= dueTo)
            );
        }).map(item => ({
            key: item.ID || '', // 使用 ID 或其他唯一标识符
            Parma: item.Parma || '',
            RFQNo: item.RFQNo || '',
            BuyerInfo: item.BuyerInfo || '',
            HandlerName: item.HandlerName || '',
            RFQType: item.RFQType || '',
            ReasonOfRFQ: item.ReasonOfRFQ || '',
            RFQReleaseDate: item.Created?.toString() || '',
            RFQDueDate: item.RFQDueDate?.toString() || '',
            RFQStatus: item.RFQStatus || '',
            EffectiveDateRequest: item.EffectiveDateRequest?.toString() || '',
        })
        ).sort((a, b) =>
            new Date(b.RFQReleaseDate || 0).getTime() -
            new Date(a.RFQReleaseDate || 0).getTime());

    };
    React.useEffect(() => {
        const filtered = getFilteredItems();
        setSortedItems(filtered);
        setCurrentPage(1);
    }, [appliedFilters]);

    const handleSearchChange = (key: string, value: string) => {
        setSearchConditions(prev => ({
            ...prev,
            [key]: value,
        }));
    };


    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedItems.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, sortedItems]);

    // 切换页码
    // const changePage = (page: number) => {
    //     setCurrentPage(page);
    // };
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    

    React.useEffect(() => {
        if (allRFQs.length > 0) {
            // 按 RFQReleaseDate 降序排序
            const sorted = [...allRFQs]
                .sort(
                    (a, b) =>
                        new Date(b.Created || 0).getTime() -
                        new Date(a.Created || 0).getTime()
                )
                .map((rfq) => ({
                    key: rfq.ID || "",
                    Parma: rfq.Parma || "",
                    RFQNo: rfq.RFQNo || "",
                    BuyerInfo: rfq.BuyerInfo || "",
                    HandlerName: rfq.HandlerName || "",
                    RFQType: rfq.RFQType || "",
                    ReasonOfRFQ: rfq.ReasonOfRFQ || "",
                    RFQReleaseDate: rfq.Created?.toString() || "",
                    RFQDueDate: rfq.RFQDueDate?.toString() || "",
                    RFQStatus: rfq.RFQStatus || "",
                    EffectiveDateRequest: rfq.EffectiveDateRequest?.toString() || "",
                }));
            setSortedItems(sorted);
        }
    }, [allRFQs]);

    React.useEffect(() => {
        if (currentPage === 1 && sortedItems.length > 0) {
            selection.current.setItems(sortedItems);
        }
    }, [currentPage, sortedItems]);






    const fieldWithTooltip = (
        label: string,
        tooltip: string,
        field: JSX.Element
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
        <Stack tokens={{ childrenGap: 20 }} styles={{ root: { width: "100%" } }}>
            <h2 className="mainTitle">RFQ & Quote</h2>

            {/* 搜索栏标题 */}
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                <IconButton
                    iconProps={{
                        iconName: isSearchVisibel ? "ChevronDown" : "ChevronRight",
                    }}
                    title="Toggle Search Bar"
                    ariaLabel="Toggle Search Bar"
                    onClick={toggleSearchBar}
                />
                <Label styles={{ root: { fontWeight: "bold", fontSize: 16 } }}>
                    Search
                </Label>
            </Stack>
            {/* 搜索区域 */}
            {isSearchVisibel && (
                <Stack
                    styles={{
                        root: {
                            background: "#CCEEFF",
                            padding: 20,
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)", // 五等分
                            gridTemplateRows: "auto auto auto", // 固定为 3 行
                            gap: "10px",
                        },
                    }}
                >
                    {/* 第一行 */}

                    <Dropdown
                        label="Type"
                        placeholder="Optional"
                        selectedKey={searchConditions.rfqtype}
                        onChange={(e, option) => handleSearchChange('rfqtype', option?.key?.toString() as string || '')}
                        options={typeOptions}
                        styles={fieldStyles}
                    />
                    <TextField
                        label="RFQ No."
                        value={searchConditions.rfqno}
                        onChange={(e, newValue) => handleSearchChange('rfqno', newValue || "")}
                        styles={fieldStyles}
                    />
                    {fieldWithTooltip(
                        t("Buyer"),
                        "Search by Org/Handler Code/Name",
                        <TextField
                            value={searchConditions.buyer}
                            onChange={(e, newValue) => handleSearchChange('buyer', newValue || "")}
                            styles={fieldStyles}
                        />
                    )}
                    {fieldWithTooltip(
                        t("Section"),
                        "Search by Section code/Section Description",
                        <TextField
                            value={searchConditions.section}
                            onChange={(e, newValue) => handleSearchChange('section', newValue || "")}
                            styles={fieldStyles}
                        />
                    )}
                    <Dropdown
                        label="Status"
                        selectedKeys={searchConditions.status}
                        multiSelect
                        onChange={(e, option) => {if(option)
                        {console.log("Selected status: ",option)}
                            handleMultiSelectChange('status', option)}}
                        options={statusOptions}
                         
                        styles={fieldStyles}
                    />

                    {/* 第二行 */}

                    {userType === "Member" && (<TextField
                        label="Parma"
                        value={searchConditions.parma}
                        onChange={(e, newValue) => handleSearchChange('parma', newValue || "")}
                        styles={fieldStyles}
                    />)}
                    <DatePicker
                        label="RFQ Release Date From"
                        value={rfqReleaseDateFrom}
                        onSelectDate={(date) => setRfqReleaseDateFrom(date || undefined)}
                        styles={fieldStyles}
                    />
                    <DatePicker
                        label="RFQ Release Date To"
                        value={rfqReleaseDateTo}
                        onSelectDate={(date) => {
                            if (date) {
                                console.log("Selected Date:", date);
                                console.log("ISO String:", date.toISOString()); // 转为 UTC 时间的字符串
                                console.log("Locale String:", date.toLocaleString()); // 转为本地时间字符串
                                console.log("Time Zone Offset (minutes):", date.getTimezoneOffset()); // 获取时区偏移量，单位是分钟
                            } setRfqReleaseDateTo(date || undefined)
                        }}
                        styles={fieldStyles}
                    />
                    <DatePicker
                        label="RFQ Due Date From"
                        value={rfqDueDateFrom}
                        onSelectDate={(date) => setRfqDueDateFrom(date || undefined)}
                        styles={fieldStyles}
                    />
                    <DatePicker
                        label="RFQ Due Date To"
                        value={rfqDueDateTo}
                        onSelectDate={(date) => setRfqDueDateTo(date || undefined)}
                        styles={fieldStyles}
                    />

                    {/* 搜索按钮 */}
                    <Stack.Item style={{ gridRow:"3",gridColumn: "5", justifySelf: "end" }}>
                        <PrimaryButton
                            text="Search"
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
                        columns={columns}
                        selection={selection.current}
                        selectionMode={SelectionMode.single} // single select
                        styles={{
                            root: {
                                marginTop: 20,
                                padding: 10,
                                borderTop: `1px solid ${DefaultPalette.neutralLight}`,
                                borderBottom: `1px solid ${DefaultPalette.neutralLight}`,
                            },
                        }}
                    />
                    {/* 分页控件
                   <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 10 }}>
                   {[...Array(totalPages)].map((_, index) => (
                       <PrimaryButton
                           key={index + 1}
                           text={(index + 1).toString()}
                           onClick={() => changePage(index + 1)}
                           styles={{
                               root: {
                                   backgroundColor: currentPage === index + 1 ? '#0078D4' : '#EDEDED',
                                   color: currentPage === index + 1 ? 'white' : 'black',
                               },
                           }}
                       />
                   ))}
               </Stack>
               </> */}
                    {/* 分页控件 */}
                    <Stack
                        horizontal
                        horizontalAlign="end"
                        verticalAlign="center"
                        tokens={{ childrenGap: 10 }}
                        styles={{
                            root: {
                                marginTop: 10,
                                justifyContent: "flex-end",
                            },
                        }}
                    >
                        <IconButton
                            iconProps={{ iconName: "DoubleChevronLeft" }}
                            title="First Page"
                            ariaLabel="First Page"
                            disabled={currentPage === 1}
                            onClick={() => goToPage(1)}
                        />
                        <IconButton
                            iconProps={{ iconName: "ChevronLeft" }}
                            title="Previous Page"
                            ariaLabel="Previous Page"
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
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
                        />
                        <IconButton
                            iconProps={{ iconName: "DoubleChevronRight" }}
                            title="Last Page"
                            ariaLabel="Last Page"
                            disabled={currentPage === totalPages}
                            onClick={() => goToPage(totalPages)}
                        />
                    </Stack>
                </Stack>
            )}

            {/* <Stack.Item style={{ gridColumn: '5', justifySelf: 'end' }}>
              <PrimaryButton text="View" styles={buttonStyles} onClick={() => console.log('Button clicked')} />
                      </Stack.Item> */}
            <Stack.Item style={{ gridColumn: "5", justifySelf: "end" }}>
                <PrimaryButton
                    text="View"
                    disabled={!isItemSelected}
                    styles={buttonStyles}
                    onClick={() => {
                        alert(
                            `Selected items: ${selectedItems
                                .map((item) => item.Parma)
                                .join(", ")}`
                        );
                        // const selectedItems = selection.getSelection() as Item[];
                    }}
                />
            </Stack.Item>
        </Stack>
    );
};

export default RFQ;