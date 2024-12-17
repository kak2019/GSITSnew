import React, { useState } from "react";
import { Stack, TextField, Dropdown, PrimaryButton, DetailsList, IColumn, SelectionMode, Text, Icon, Label } from "@fluentui/react";
import CreatePriceChangeRequest from "./dialog";
import { useTranslation } from "react-i18next";
import theme from "../../../../config/theme";

// 定义数据项的类型
interface RequestItem {
    key: string;
    RequestID: string;
    PARMA: string;
    HostBuyer: string;
    HostBuyerName: string;
    ExpectedEffectiveDate: string;
    Status: string;
    SupplierRequestedDate: string;
    LastUpdateDate: string;
}

const PriceChangeRequest: React.FC = () => {
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const { t } = useTranslation();
    const handleConfirm = (formData: any) => {
        console.log("Form Data Submitted:", formData);
        setIsDialogOpen(false);
    };

    // 定义数据状态
    const [searchConditions, setSearchConditions] = React.useState({
        HostBuyer: "",
        Status: "Requested",
        ExpectedEffectiveDateTo: "",
        ExpectedEffectiveDateFrom: "",
    });

    const [items, setItems] = React.useState<RequestItem[]>([]);

    // 模拟表格数据
    const requestData: RequestItem[] = [
        {
            key: "1",
            RequestID: "345678901234",
            PARMA: "212432",
            HostBuyer: "UDT 21",
            HostBuyerName: "First Last Name",
            ExpectedEffectiveDate: "MM/DD/YYYY",
            Status: "Requested",
            SupplierRequestedDate: "YYYY/MM/DD",
            LastUpdateDate: "YYYY/MM/DD",
        },
        {
            key: "2",
            RequestID: "345678901234",
            PARMA: "V",
            HostBuyer: "UDT 21",
            HostBuyerName: "First Last Name",
            ExpectedEffectiveDate: "MM/DD/YYYY",
            Status: "Requested",
            SupplierRequestedDate: "YYYY/MM/DD",
            LastUpdateDate: "YYYY/MM/DD",
        },
    ];

    React.useEffect(() => {
        setItems(requestData); // 初始化数据
    }, []);

    // 定义表格列
    const columns: IColumn[] = [
        { key: "RequestID", name: "Request ID", fieldName: "RequestID", minWidth: 100 },
        { key: "PARMA", name: "PARMA", fieldName: "PARMA", minWidth: 100 },
        { key: "HostBuyer", name: "Host Buyer", fieldName: "HostBuyer", minWidth: 100 },
        { key: "HostBuyerName", name: "Host Buyer Name", fieldName: "HostBuyerName", minWidth: 150 },
        { key: "ExpectedEffectiveDate", name: "Expected Effective Date", fieldName: "ExpectedEffectiveDate", minWidth: 150 },
        { key: "Status", name: "Status", fieldName: "Status", minWidth: 100 },
        { key: "SupplierRequestedDate", name: "Supplier Requested Date", fieldName: "SupplierRequestedDate", minWidth: 150 },
        { key: "LastUpdateDate", name: "Last Update Date", fieldName: "LastUpdateDate", minWidth: 150 },
    ];

    const handleSearch = () => {
        console.log("Search Conditions:", searchConditions);
        // 这里可以添加过滤逻辑
    };
    const toggleSearchBar = (): void => {
        setIsSearchVisible(!isSearchVisible);
    };

    const fieldStyles = { root: { width: "100%" } };
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

            <h2 className="mainTitle">Price Change Request - Supplier</h2>

            {/* 搜索栏标题 */}
            {/* 搜索栏 */}
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
            
                <TextField
                    label="Host Buyer"
                    styles={fieldStyles}
                    value={searchConditions.HostBuyer}
                    onChange={(e, newValue) => setSearchConditions({ ...searchConditions, HostBuyer: newValue || "" })}
                />
                <Dropdown
                    label="Status"
                    styles={fieldStyles}
                    selectedKey={searchConditions.Status}
                    options={[{ key: "Requested", text: "Requested" }, { key: "Approved", text: "Approved" }]}
                    onChange={(e, option) => setSearchConditions({ ...searchConditions, Status: option?.key as string })}
                />
                <TextField
                    label="Expected Effective Date To"
                    placeholder="yymmdd"
                    styles={fieldStyles}
                    value={searchConditions.ExpectedEffectiveDateTo}
                    onChange={(e, newValue) =>
                        setSearchConditions({ ...searchConditions, ExpectedEffectiveDateTo: newValue || "" })
                    }
                />
                <TextField
                    label="Expected Effective Date From"
                    placeholder="yymmdd"
                    styles={fieldStyles}
                    value={searchConditions.ExpectedEffectiveDateFrom}
                    onChange={(e, newValue) =>
                        setSearchConditions({ ...searchConditions, ExpectedEffectiveDateFrom: newValue || "" })
                    }
                />
                <PrimaryButton text="Search" styles={buttonStyles} onClick={handleSearch} />
            </Stack>
            )}
            {/* 表格区域 */}
            <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                Request Info
            </Text>
            <DetailsList
                items={items}
                columns={columns}
                selectionMode={SelectionMode.none}
                styles={{ root: { border: "1px solid #ddd" } }}
            />

            {/* 新建请求按钮 */}
            <PrimaryButton text="Create New Request"
                onClick={() => setIsDialogOpen(true)} />
            <CreatePriceChangeRequest
                isOpen={isDialogOpen}
                onDismiss={() => setIsDialogOpen(false)}
                onConfirm={handleConfirm}
            />
        </Stack>
    );
};

export default PriceChangeRequest;
