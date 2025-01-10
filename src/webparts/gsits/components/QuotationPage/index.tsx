import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogType,
    DialogFooter,
    Stack,
    TextField,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    PrimaryButton,
    DefaultButton,
    Label,
    Text,
    Link,
    mergeStyleSets,
    DetailsRow,
    Selection,
    IDropdownOption,
    Dropdown,
    Spinner, IColumn,
    IconButton,
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import AppContext from "../../../../AppContext";
import { getAADClient } from "../../../../pnpjsConfig";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
//import { useRFQ } from "../../../../hooks/useRFQ";
//import { useDocument, useUser } from "../../../../hooks";
import { useUser } from "../../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { IComment } from "../../../../model/comment";
//import { useQuotation } from "../../../../hooks/useQuotation";
import exportToExcel from "./download";
import EditIcon from "./icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import "./index.css";
import { IMasterData } from "../PriceBreakDown/IPriceBreakDown";
import { boolean } from "yup";
//import { IProceedToPoFields } from "../../../../model/requisition";
import Download from "./generateFourTypesFile";
import { KnowledgeArticleIcon } from "@fluentui/react-icons-mdl2";
import theme from "../../../../config/theme";
//import {useUDGSQuotation} from "../../../../hooks-v2/use-udgs-quotation";
import { useUDGSPart } from "../../../../hooks-v2/use-udgs-part";
import { useUDGSRFQ } from "../../../../hooks-v2/use-udgs-rfq";
import { useUDGSAttachment } from "../../../../hooks-v2/use-udgs-attachment";
import { IUDGSAttachmentCreteriaModel } from "../../../../model-v2/udgs-attachment-model";
import { IUDGSAcceptReturnModel } from "../../../../model-v2/udgs-part-model";
import { IUDGSCommentModel } from "../../../../model-v2/udgs-comment-model";
import { useUDGSActionlog } from "../../../../hooks-v2/use-udgs-actionlog";
import { IUDGSActionlogFormModel } from "../../../../model-v2/udgs-actionlog-model";
import { useUDGSQuotation } from "../../../../hooks-v2/use-udgs-quotation";
import { IUDGSQuotationFormModel } from "../../../../model-v2/udgs-quotation-model";

const iconClass = mergeStyles({
    fontSize: 20,
    height: 20,
    width: 20,
    margin: "0 10px",
});

const classes = mergeStyleSets({
    fileList: {
        marginTop: "10px",
        position: "relative",
        height: "140px",
        overflow: "hidden",
        overflowY: "auto",
        border: "1px solid #ccc",
    },
    fileItem: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #e1dfdd",
        padding: "5px 10px",
        alignItems: "center",
        height: "35px",
        boxSizing: "border-box",
    },
    oddItem: {
        backgroundColor: "#fff",
    },
    evenItem: {
        backgroundColor: "#F6F6F6",
    },
    label: {
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        marginTop: "4px",
        fontWeight: "bold",
    },
    labelItem: {
        marginBottom: "10px",
    },
    labelValue: {
        lineHeight: "30px",
        minHeight: "30px",
    },
    fieldItem: {
        height: "60px",
        padding: "4px",
    },
});
const buttonStyles = {
    root: {
        backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
        color: "black", // 设置文字颜色为黑色
        width: "150px", // 设置按钮宽度
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
const PObuttonStyles = {
    root: {
        backgroundColor: "#99CCFF", // 设置按钮背景色，类似浅蓝色
        color: "black", // 设置文字颜色为黑色
        width: "180px", // 设置按钮宽度
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchData = async (parmaValue: string): Promise<any> => {
    try {
        const client = getAADClient();
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetSupplierInfo/${parmaValue}`;
        const response = await client.get(
            functionUrl,
            AadHttpClient.configurations.v1
        );

        // 检查响应状态
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null; // 返回 null 如果响应失败
        }

        const result = await response.json();
        console.log("Fetched data:", result);

        return result; // 返回结果
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // 发生异常时返回 null
    }
};

const QuoteCreation: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    //const [, , , , , , , , , , , , createActionLog, acceptOrReturn, , , proceedToPo,] = useQuotation();
    //const [, , , , , , , , , , , , createActionLog, acceptOrReturn, , , proceedToPo,] = useQuotation();
    //const [, , currentPartWithQuotation, , , , getPartWithQuotationByRFQID, , , , ] = useUDGSPart()
    const [, , , , , postActionlog] = useUDGSActionlog();
    const [, , , , , , putQuotation] = useUDGSQuotation()
    const [, , currentPartWithQuotation, , , , getPartWithQuotationByRFQID, , getPartsByRFQID, putPart, acceptReturn] = useUDGSPart()
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sets, setSets] = useState<any>({})
    const status = React.useRef(false)
    const [selection] = useState(new Selection({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getKey(item: any, index) {
            return item.ID
        },
        onSelectionChanged: () => {
            if (status.current) return
            const allItems = selection.getItems()
            const selets = selection.getSelection()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allItems.forEach((val:any) => {
                if (selets.includes(val)) {
                    sets[val.ID] = true
                } else {
                    sets[val.ID] = false
                }
                setSets({...sets})
            })
            // setSelectedItems(selection.getSelection() as Item[]);
        },
    }));
    useEffect(() => {
        setSelectedItems(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (currentPartWithQuotation as any).filter((val: any) => {
                return sets[val.ID]
            })
        )
    }, [sets])

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectedItems.forEach((val: any) => {
            selection.setKeySelected(val.ID, true, false)
        })
    }, [currentPage])
    const itemsPerPage = 20;
    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return currentPartWithQuotation.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, currentPartWithQuotation]);
    const totalPages = Math.max(1, Math.ceil(currentPartWithQuotation.length / itemsPerPage));
    const goToPage = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const [supplierinfo, setsupplierinfo] = useState({
        SupplierName: "",
        IsSme: boolean,
        CountryCode: "",
    });
    const { t } = useTranslation();
    // const [, , , rfqAttachments, , , , , getRFQAttachments] = useDocument();
    const [, , currentAttachments, getAttachments] = useUDGSAttachment()
    const [, , , currentRFQ, , getRFQByID, , putRFQ] = useUDGSRFQ()
    let userEmail = "";
    let userName = "";
    let webURL = "";
    let Site_Relative_Links = "";
    const [userType, setUserType] = useState<string>("Unknown");
    const { getUserType } = useUser();
    const location = useLocation();
    const state = location.state;
    const parma = state.selectedItems[0].Parma;
    console.log(state, "status");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [text, setText] = useState<any>("");
    const [userDetails, setUserDetails] = useState({
        role: "",
        name: "",
        sectionCode: "",
        handlercode: "",
    });
    const [returncomments, setreturnComments] = useState("");
    const [isLeavePageDialogVisible, setIsLeavePageDialogVisible] =
        useState(false);
    const closeLeavePageDialog = (): void => setIsLeavePageDialogVisible(false);
    const openLeavePageDialog = (): void => setIsLeavePageDialogVisible(true);
    // hint dialog
    const [isHintPageDialogVisible, setIsHintPageDialogVisible] = useState(false);
    const closeHintPageDialog = (): void => setIsHintPageDialogVisible(false);
    const openHintePageDialog = (): void => setIsHintPageDialogVisible(true);
    // 在 QuoteCreation 组件或者相应父组件中
    const [dialogTitle, setDialogTitle] = useState("Hint information"); // 初始化标题
    const [dialogSubText, setDialogSubText] = useState("File Document Generation Successful"); // 初始化子标题

    // 处理输入框变化的方法
    const handleInputChange = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
    ): void => {
        setreturnComments(newValue || ""); // 更新状态
    };

    // 输入框变化处理函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChangeOrderno = (newValue: string | undefined, props: any, i?: any): void => {
        console.log("Changed Value:", newValue, "Row Data:", props);

        const obj = selectedItems.map((val) => ({ ...val }));
        obj[i].OrderNumber = newValue;
        setSelectedItems(obj);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dialog, setDialog] = useState<any>({});

    const ctx = React.useContext(AppContext);
    if (!ctx || !ctx.context) {
        throw new Error("AppContext is not provided or context is undefined");
    } else {
        userEmail = ctx.context._pageContext._user.email;
        userName = ctx.context._pageContext._user?.displayName;
        webURL = ctx.context?._pageContext?._web?.absoluteUrl;
        console.log("weburl: ",webURL);
        Site_Relative_Links = webURL.slice(webURL.indexOf("/sites"));
        console.log("Site_Relative_Links", Site_Relative_Links);
        // console.log("useremail1", userEmail1)
    }
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
                console.log(result, "dsdsd");
                if (
                    result &&
                    result.role &&
                    result.name &&
                    result.sectionCode &&
                    result.handlercode
                ) {
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

        // 调用 getUserType 并根据结果执行逻辑
        getUserType(userEmail)
            .then((type) => {
                if (userType !== type) {
                    // 只有当 userType 变化时才更新状态
                    setUserType(type);
                    console.log("UserType updated to: ", userType);
                }
                if (type !== "Guest") {
                    fetchData().then(
                        (_) => _,
                        (_) => _
                    );
                }
            })
            .catch((e) => console.error("Error fetching GPS user props:", e));
    }, [userType]);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const init = async () => {
        setIsLoading(true);
        const ID = state.selectedItems[0].ID;

        console.log("ID", state.selectedItems[0].ID, state.selectedItems);
        const attobj: IUDGSAttachmentCreteriaModel = {
            FolderName: "RFQ Attachments",
            SubFolderName: ID,
            IsDataNeeded: false
        }
        // 使用 Promise.all 并行调用两个 API
        await Promise.all([
            getPartWithQuotationByRFQID(ID && ID),
            getRFQByID(ID && ID + ""),
            //getRFQAttachments(ID && ID + ""),
            getAttachments(attobj),
        ]);

        setIsLoading(false);
    };
    console.log("currentPartWithQuotation", currentPartWithQuotation)
    React.useEffect(() => {
        init().then(
            (_) => _,
            (_) => _
        );
    }, [state]);
    useEffect(() => {
        console.log(parma, "par");
        if (parma && parma + "") {
            fetchData(currentRFQ.Parma + "")
                .then((a) =>
                    setsupplierinfo({
                        SupplierName: a?.name,
                        IsSme: a?.smallMediumCapital,
                        CountryCode: a?.country,
                    })
                )
                .catch((e) => console.error(e));
        }
    }, [userType]);
    console.log("all2", userDetails);
    // console.log("curretRFQ", currentRFQ);
    //console.log("currentRFQRequisitions", currentRFQRequisitions);
    console.log("documents", currentAttachments);
    const onclickAddComment = async (): Promise<void> => {
        if (text) {
            // 新的评论对象
            const newComment: IComment = {
                CommentDate: new Date(),
                CommentBy: userName || "",
                CommentText: text,
                CommentType: "comment",
            };
            // 解析现有的 CommentHistory，如果为空则初始化为空数组
            const existingComments: IComment[] = currentRFQ?.CommentHistory
                ? JSON.parse(currentRFQ.CommentHistory)
                : [];
            // 将新的评论追加到历史评论中
            const updatedComments = [newComment, ...existingComments];
            // 更新 RFQ
            //updateRFQ({
            await putRFQ({
                ID: currentRFQ?.ID,
                CommentHistory: JSON.stringify(updatedComments), // 序列化成字符串
                Modified: currentRFQ?.Modified,
            });
            setText("");
            const ID = state.selectedItems[0]?.ID;
            if (ID) {
                // getRFQ(ID.toString());
                await getRFQByID(ID.toString());
            }
        }
    };
    console.log("selectitems", selectedItems);
    //userDetails.role === "Buyer"
    //                     ? false
    //                     : supplierinfo.IsSme !== undefined
    //                         ? Boolean(supplierinfo.IsSme)
    //                         : undefined,
    const navigateToPriceBreakDown = (PartID: string, QuotationID: string): void => {
        const PriceObi_temp: IMasterData = {
            role: userDetails.role === "Buyer" ? "Buyer" : "Supplier",
            supplierId: currentRFQ.Parma,
            quotationID: QuotationID ? Number(QuotationID) : 0,
            rfqID: Number(currentRFQ.ID),
            userEmail: userEmail,
            userName: userName,
            isSME: String(supplierinfo.IsSme) === "true",
            countryCode: supplierinfo.CountryCode,
            partID: Number(PartID),
        };
        //console.log("priceObi_temp", PriceObi_temp,supplierinfo.IsSme,typeof(supplierinfo.IsSme));
        navigate("price-breakdown", { state: PriceObi_temp });
    };

    // 处理 Dropdown 值变化的函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, props?: any, i?: any, columnObj?: any
    ): void => {
        console.log("Selected Option:", option?.text, "Row Data:", columnObj);
        const obj = selectedItems.map((val) => ({ ...val }));
        obj[i][columnObj.fieldName] = option?.key;
        setSelectedItems(obj);
    };

    const columns:IColumn[] = [
        {
            key: "column1",
            name: t("Part Number"),
            fieldName: "PartNumber",
            minWidth: 100,
        },
        {
            key: "column2",
            name: t("Qualifier"),
            fieldName: "Qualifier",
            minWidth: 100,
        },
        {
            key: "column3",
            name: t("Part Description"),
            fieldName: "PartDescription",
            minWidth: 150,
        },
        {
            key: "column4",
            name: t("Material User"),
            fieldName: "MaterialUser",
            minWidth: 100,
        },
        {
            key: "column5",
            name: t("Price Type"),
            fieldName: "PriceType",
            minWidth: 100,
        },
        {
            key: "column6",
            name: t("Annual Qty"),
            fieldName: "AnnualQty",
            minWidth: 100,
        },
        {
            key: "column7",
            name: t("Order Qty"),
            fieldName: "OrderQty",
            minWidth: 100,
        },
        {
            key: "column8",
            name: t("Quoted Unit Price"),
            fieldName: "QuotedUnitPriceTtl",
            minWidth: 150,
        },
        {
            key: "column9",
            name: t("Currency"),
            fieldName: "Currency",
            minWidth: 100,
        },
        { key: "column10", name: t("UOP"), fieldName: "UOP", minWidth: 100 },
        // {
        //     key: "column11",
        //     name: t("Effective Date"),
        //     fieldName: "EffectiveDate",
        //     minWidth: 150,
        // },
        {
            key: "column12",
            name: t("Part Status"),
            fieldName: "PartStatus",
            minWidth: 100,
            onRender:(item) =>{
                let displayStatus;

                // 检查用户类型是否为 Guest
                if (userType === "Guest") {
                    switch (item.PartStatus) {
                        case 'Quoted':
                        case 'Accepted':
                        case 'Sent to GPS':
                            displayStatus = 'Quoted'; // 对于 Guest 用户，显示为 "Quoted"
                            break;
                        default:
                            displayStatus = item.PartStatus; // 显示其他状态
                    }
                } else {
                    // 对于非 Guest 用户，直接显示 PartStatus
                    displayStatus = item.PartStatus;
                }

                return <span>{displayStatus}</span>;
            }},
        {
            key: "column13", name: t("Parma"), fieldName: "Parma", minWidth: 100,
            onRender: () => {
                return <span >{currentRFQ?.Parma}</span>
            }
        },
        {
            key: "column14",
            name: t("Last Comment By"),
            fieldName: "LastCommentBy",
            minWidth: 180,

        },
        {
            key: "column15",
            name: t("Action"),
            minWidth: 100,
            fieldName: "Action",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any) => {
                console.log("props", props, userDetails);
                return (
                    <>
                        {
                            //props.PartStatus === 'Quoted' &&  <KnowledgeArticleIcon className={iconClass}/>
                        }
                        {userType === "Guest" &&
                        ["New", "Draft", "Returned"].includes(props.PartStatus) ? (
                            <button
                                style={{ margin: "5px", width: "56px", border: 0 }}
                                onClick={() => {
                                    navigateToPriceBreakDown(props.ID, props.QuotationID);
                                }}
                            >
                                <EditIcon />
                            </button>
                        ) : (
                            <button
                                style={{ margin: "5px", width: "56px", border: 0 }}
                                disabled={["New", "Draft"].includes(props.PartStatus)}
                            >
                                <KnowledgeArticleIcon
                                    className={iconClass}
                                    onClick={() => {
                                        navigateToPriceBreakDown(props.ID, props.QuotationID);
                                    }}
                                />
                            </button>
                        )}
                    </>
                );
            },
        },
        {
            key: "column16",
            name: t("First Lot"),
            fieldName: "FirstLot",
            minWidth: 75,
        },
        {
            key: "column17",
            name: t("Order No."),
            fieldName: "OrderNumber",
            minWidth: 75,
            styles: { root: { minHeight: "40px" } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any, i: any) => {
                return (
                    <TextField
                        value={props.OrderNumber || ""} // 当前单元格的值
                        onChange={(event, newValue) =>
                            handleInputChangeOrderno(newValue, props, i)
                        } // 输入框变化时处理函数
                        styles={{
                            root: { width: "100%" }, // 输入框宽度与单元格匹配
                            field: { padding: "0 4px" }, // 可选：调整内部样式
                        }}
                    />
                );
            },
        },
        {
            key: "column18",
            name: t("Standard Text Per Order 1"),
            fieldName: "StandardOrderText1",
            minWidth: 220,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any, i: any, column: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    { key: "Std Text 1", text: "Std Text 1" },
                    { key: "Option2", text: "Option 2" },
                    { key: "Option3", text: "Option 3" },
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props[column.fieldName]} // 传入当前选中的值
                        options={options} // 传入选项
                        onChange={(e, option) =>
                            handleDropdownChange(e, option, props, i, column)
                        } // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc",
                                width: 120,
                            },
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column19",
            name: t("Standard Text Per Order 2"),
            fieldName: "StandardOrderText2",
            minWidth: 220,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any, i: any, column: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    { key: "Std Text 1", text: "Std Text 1" },
                    { key: "Option2", text: "Option 2" },
                    { key: "Option3", text: "Option 3" },
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props[column.fieldName]} // 传入当前选中的值
                        options={options} // 传入选项
                        onChange={(e, option) =>
                            handleDropdownChange(e, option, props, i, column)
                        } // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc",
                                width: 120,
                            },
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column20",
            name: t("Standard Text Per Order 3"),
            fieldName: "StandardOrderText3",
            minWidth: 220,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any, i: any, column: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    { key: "Std Text 1", text: "Std Text 1" },
                    { key: "Option2", text: "Option 2" },
                    { key: "Option3", text: "Option 3" },
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props[column.fieldName]} // 传入当前选中的值
                        options={options} // 传入选项
                        onChange={(e, option) =>
                            handleDropdownChange(e, option, props, i, column)
                        } // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc",
                                width: 120,
                            },
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column21",
            name: t("Free Text per Part"),
            fieldName: "FreePartText",
            minWidth: 120,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any, i: any) => {
                return (
                    <TextField
                        value={props.FreePartText} // 当前单元格的值
                        onChange={(event, newValue) => {
                            const obj = selectedItems.map((val) => ({ ...val }));
                            obj[i].FreePartText = newValue;
                            setSelectedItems(obj);
                        }} // 输入框变化时处理函数
                        styles={{
                            root: { width: "100%" }, // 输入框宽度与单元格匹配
                            field: { padding: "0 4px" }, // 可选：调整内部样式
                        }}
                    />
                );
            },
        },
    ];

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function formatCommentHistory(commentHistory: string | undefined) {
        if (!commentHistory) return ""; // 如果没有值，返回空字符串

        let commentsArray = [];

        try {
            // 解析 JSON 字符串为数组
            commentsArray = JSON.parse(commentHistory);
        } catch (error) {
            console.error("Invalid Comment History Format", error);
            return "";
        }

        // 确保解析结果是数组
        if (!Array.isArray(commentsArray)) {
            console.error("CommentHistory is not an array");
            return "";
        }

        // 格式化每条评论
        return commentsArray
            .filter((comment) => comment !== null) // 过滤掉 null 值
            .map((comment) => {
                const commentDate = new Intl.DateTimeFormat("ja-JP", {
                    timeZone: "Asia/Tokyo",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }).format(new Date(comment.CommentDate));
                const commentBy = comment.CommentBy || "Unknown";
                const commentText = comment.CommentText || "No text";
                return `${commentDate} ${commentBy}: ${commentText}`;
            })
            .join("\n"); // 用换行符分隔每条评论
    }

    // const toJST = (date: Date): Date => {
    //   const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    //   return new Date(utc + 9 * 3600000); // 添加9小时的偏移量
    // };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const proceedToPo = async (tempo: IUDGSQuotationFormModel) => {

        await putQuotation(tempo)
        await putPart({
            ID: tempo.PartIDRef,
            PartStatus: "Sent to GPS",
        })
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const changeRequisition = async (statusType: string, comment: string) => {
        console.log(statusType, comment, selectedItems);

        try {
            setIsLoading(true);
            // 遍历选中记录，逐一更新
            const acceptReturnArray: IUDGSAcceptReturnModel[] = []
            for (const item of selectedItems) {
                const newComment: IUDGSCommentModel = {
                    CommentDate: new Date(),
                    CommentBy: userName || "",
                    CommentText: comment,
                    CommentType: statusType,
                };

                // 解析现有的 CommentHistory，如果为空则初始化为空数组
                const existingComments: IUDGSCommentModel[] =
                    currentRFQ && currentRFQ.CommentHistory
                        ? JSON.parse(currentRFQ.CommentHistory)
                        : [];
                const updatedComments = [...existingComments, newComment];
                // 根据 statusType 执行不同的操作
                if (statusType === "Sent to GPS") {
                    console.log(item, "item");
                    const temppo: IUDGSQuotationFormModel = {
                        PartIDRef: item.ID,
                        ID: item.QuotationID,
                        Modified: item.QuotationModified,
                        StandardOrderText1: item.StandardOrderText1 || "",
                        StandardOrderText2: item.StandardOrderText2 || "",
                        StandardOrderText3: item.StandardOrderText3 || "",
                        FreePartText: item.FreePartText ?? "",
                        OrderNumber: item.OrderNumber ?? "",
                    };
                    console.log(updatedComments, temppo);
                    //await proceedToPo(temppo); // 等待 proceedToPo 完成

                    await proceedToPo(temppo); // 等待 proceedToPo 完成
                } else {
                    const temp_acceptreturn_obi: IUDGSAcceptReturnModel = {
                        Action: statusType === "Accepted" ? "Accepted" : "Returned",
                        PartID: item.ID,
                        QuotationID: item.QuotationID,
                        QuotationModified: item.quotationModified,
                        Comment: newComment,
                    };
                    //await acceptReturn(temp_acceptreturn_obi);
                    //等待 acceptOrReturn 完成
                    acceptReturnArray.push(temp_acceptreturn_obi);
                }

                // 创建操作日志
                const actionLog: IUDGSActionlogFormModel = {
                    LogType:
                        statusType === "Returned"
                            ? "Return Quote"
                            : statusType === "Sent to GPS"
                                ? "Sent to GPS"
                                : "Accept Quote",
                    User: userEmail || "",
                    Date: new Date(),
                    RFQIDRef: currentRFQ.ID,
                    PartIDRef: item.ID,
                };
                // console.log(actionLog);
                await postActionlog(actionLog); // 等待日志创建完成
                console.log(`Action log created successfully for item ID: ${item.ID}`);
            }

            if (acceptReturnArray.length > 0) {
                // console.log(acceptReturnArray, "acceptReturnArray");
                await acceptReturn(acceptReturnArray);
            }
            // 更新 RFQ 数据
            const ID = state.selectedItems[0]?.ID;
            if (ID) {
                console.log("Updating RFQ for ID:", ID);

                const parts = await getPartsByRFQID(ID)

                //if (currentPartWithQuotation.every(part => part.PartStatus === "Sent to GPS")) {
                if (parts.every(part => part.PartStatus === "Sent to GPS")) {
                    await putRFQ({
                        ID: currentRFQ?.ID,
                        RFQStatus: "Sent to GPS",
                        Modified: currentRFQ?.Modified,
                    });
                }


                await getRFQByID(ID);
            }
            if (statusType === "Sent to GPS") {
                Download(
                    selectedItems,
                    Site_Relative_Links,
                    currentRFQ,
                    currentPartWithQuotation
                )
                    .then((a) => {
                        if (a) {
                            openHintePageDialog();
                            setDialog({ isOpen: false });
                            setIsLoading(false);
                            setDialog({ isOpen: false });
                            //setIsLoading(false)
                        } else {
                            setDialogTitle("Hint information");
                            setDialogSubText("Document Generation Failed");
                            openHintePageDialog();
                            setDialog({ isOpen: false });
                            setIsLoading(false);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            } else {
                setDialog({ isOpen: false });
                setIsLoading(false);
            }
            // 关闭对话框
            // setDialog({isOpen: false});
            // setIsLoading(false)
            await getPartWithQuotationByRFQID(ID)
            await getRFQByID(ID);
        } catch (error) {
            console.error("Error in changeRequisition method:", error);
        }
    };

    return (
        <Stack tokens={{childrenGap: 20}} styles={{
            root: {
                width: "100%",
                paddingTop: 0, // 去掉顶部空白
                paddingLeft: 20, // 保留左右空白
                paddingRight: 20,
                paddingBottom: 0, // 保留左右空白
                margin: "0"
            }
        }}>
            {/* Header */}
            {/*<Text*/}
            {/*    variant="xxLarge"*/}
            {/*    style={{ backgroundColor: "#99CCFF", padding: "10px" }}*/}
            {/*>*/}
            {/*    {t("Creation of Quote")}*/}
            {/*</Text>*/}
            <h2 className="mainTitle">{t("Creation of Quote")}</h2>

            {/* RFQ Basic Info */}
            <Stack
                tokens={{childrenGap: 10}}
                styles={{root: {border: "1px solid #0f6cbd", paddingLeft: 10,paddingRight:10}}}
            >
                <Text variant="large">{t("RFQ Basic Info")}</Text>
                <Stack horizontal tokens={{childrenGap: 100}}>
                    <Stack
                        tokens={{childrenGap: 10}}
                        styles={{root: {width: "50%"}}}
                    >
                        <Stack
                            horizontal
                            tokens={{childrenGap: 10}}
                            horizontalAlign="space-between"
                        >
                            <Stack tokens={{childrenGap: 10}}>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("RFQ Number")}</div>
                                    <div className={classes.labelValue}>
                                        {currentRFQ?.RFQNo || " "}
                                    </div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("Parma")}</div>
                                    <div className={classes.labelValue}>{currentRFQ?.Parma}</div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("RFQ Due Date")}</div>
                                    <div className={classes.labelValue}>
                                        {formatDate(currentRFQ?.RFQDueDate)}
                                    </div>
                                </div>
                            </Stack>
                            <Stack tokens={{childrenGap: 10}}>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("RFQ Release Date")} </div>
                                    <div className={classes.labelValue}>
                                        {formatDate(currentRFQ?.Created)}
                                    </div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("Supplier Name")}</div>
                                    <div className={classes.labelValue}>
                                        {currentRFQ.SupplierName}
                                    </div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> {t("Order Type")}</div>
                                    <div className={classes.labelValue}>
                                        {currentRFQ?.OrderType}
                                    </div>
                                </div>
                            </Stack>
                        </Stack>
                        <Label className={classes.label}>{t("RFQ Attachments")}</Label>
                        <Stack className={classes.fileList}>
                            {currentAttachments
                                .concat(Array.from({length: 4 - currentAttachments.length}))
                                .map((val, i) => {
                                    return !!val ? (
                                        <div
                                            className={
                                                classes.fileItem +
                                                " " +
                                                (i % 2 === 0 ? classes.oddItem : classes.evenItem)
                                            }
                                        >
                                            {<Link href={val.URL} target="_blank">{val.Name}</Link>}


                                        </div>
                                    ) : i <= 3 ? (
                                        <div
                                            className={
                                                classes.fileItem +
                                                " " +
                                                (i % 2 === 0 ? classes.oddItem : classes.evenItem)
                                            }
                                        />
                                    ) : null;
                                })}
                        </Stack>
                    </Stack>
                    <Stack
                        tokens={{childrenGap: 10}}
                        styles={{root: {width: "50%",}}}
                    >
                        <Label className={classes.label}>{t("Contact")}</Label>
                        <DetailsList
                            items={JSON.parse(currentRFQ?.SupplierContact ?? "[]")}
                            columns={[
                                {
                                    key: "contact",
                                    name: "Contact",
                                    fieldName: "name",
                                    minWidth: 160,
                                    onRender: (item) => {
                                        return <span>{item.lastName + " " + item.firstName}</span>
                                    }
                                },
                                {
                                    key: "email",
                                    name: "Email",
                                    fieldName: "email",
                                    minWidth: 240,
                                },
                                // {key: "title", name: "title", fieldName: "title", minWidth: 100},
                                // {key: "role", name: "Role", fieldName: "functions", minWidth: 100},
                            ]}
                            layoutMode={DetailsListLayoutMode.fixedColumns}
                            selectionMode={SelectionMode.none}
                            onRenderDetailsHeader={() => null}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onRenderRow={(props: any) => {
                                return (
                                    <DetailsRow
                                        {...props}
                                        className={
                                            props.itemIndex % 2 === 0
                                                ? classes.evenItem
                                                : classes.oddItem
                                        }
                                    />
                                );
                            }}
                            styles={{
                                root: {
                                    border: "1px solid black", // 添加黑色边框
                                    // borderRadius: "4px", // 可选：添加圆角
                                }
                            }}

                        />
                        <Label className={classes.label}>{t("RFQ Instruction to Supplier")} </Label>
                        <TextField
                            // label={t("RFQ Instruction to Supplier")}
                            multiline
                            rows={3}
                            value={currentRFQ?.RFQInstructionToSupplier}
                            disabled
                        />
                    </Stack>
                </Stack>{" "}
            </Stack>

            {/* Quote Basic Info */}
            <Stack
                tokens={{childrenGap: 10}}
                styles={{root: {border: "1px solid #0f6cbd", padding: 20}}}
            >
                <Text variant="large">{t("Quote Basic Info")}</Text>
                <Stack horizontal tokens={{childrenGap: 100}}>
                    <Stack tokens={{childrenGap: 10}} grow>
                        <Stack
                            horizontal
                            tokens={{childrenGap: 10}}
                            //horizontalAlign="space-between"
                            horizontalAlign="start"
                        >
                            <div className={classes.labelItem} >
                                <div className={classes.label}> {t("Status")}</div>
                                <div className={classes.labelValue}>
                                    {
                                        userType === "Guest" && currentRFQ.RFQStatus === "Sent to GPS"
                                            ? "In Progress"
                                            : currentRFQ.RFQStatus

                                    }
                                </div>
                            </div>
                            <div className={classes.labelItem} style={{ marginLeft: 100 }}>
                                <div className={classes.label}>{t("Last Quote Date")}</div>
                                <div className={classes.labelValue}>
                                    {formatDate(currentRFQ?.LatestQuoteDate)}
                                </div>
                            </div>
                        </Stack>
                        <Stack tokens={{childrenGap: 10}} grow>
                            <TextField
                                label={t("Input Comments")}
                                value={text}
                                multiline
                                rows={3}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e, v: any) => setText(v)}
                            />
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <PrimaryButton
                                    onClick={onclickAddComment}
                                    text={t("Add")}
                                    // styles={{root: { backgroundColor: 'skyblue', width: '50px', textAlign: 'right' }}}
                                    styles={buttonStyles}
                                />
                            </div>
                        </Stack>
                    </Stack>

                    <Stack tokens={{childrenGap: 10}} grow>
                        <Label style={{fontWeight: "bold"}}>{t("Comment History")}</Label>
                        <TextField
                            multiline
                            rows={3}
                            value={formatCommentHistory(currentRFQ?.CommentHistory)}
                            disabled
                        />
                    </Stack>
                </Stack>
            </Stack>

            {/* Quote Breakdown Info */}
            <Stack
                tokens={{childrenGap: 10}}
                styles={{root: {border: "1px solid #ccc"}}}
            >
                <Text className="mainTitle" variant="large">
                    {t("Quote Breakdown Info")}
                </Text>
                <DetailsList
                    items={paginatedItems}
                    //items={currentPartWithQuotation}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    columns={columns.filter((item) => [
                            "PartNumber",
                            "Qualifier",
                            "PartDescription",
                            "MaterialUser",
                            "PriceType",
                            "PriceType",
                            "AnnualQty",
                            "OrderQty",
                            "QuotedUnitPriceTtl",
                            "Currency",
                            "UOP",
                            "EffectiveDate",
                            "PartStatus",
                            "LastCommentBy",
                            "Action",
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ].includes(item.fieldName as any)
                    )}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionMode={SelectionMode.multiple}
                    selection={selection}
                    // styles={{
                    //     root: {
                    //         backgroundColor: "#FFFFFF",
                    //         border: "1px solid #ddd",
                    //         borderRadius: "4px",
                    //     },
                    //     headerWrapper: {
                    //         backgroundColor: "#AFAFAF",
                    //         selectors: {
                    //             ".ms-DetailsHeader": {
                    //                 backgroundColor: "#BDBDBD",
                    //                 fontWeight: 600,
                    //             },
                    //         },
                    //     },
                    // }}
                    styles={{
                        root: theme.detaillist.root,
                        contentWrapper: theme.detaillist.contentWrapper,
                        headerWrapper: theme.detaillist.headerWrapper,
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

            {/* Footer Buttons */}
            <Stack
                horizontal
                tokens={{childrenGap: 10, padding: 10}}
                horizontalAlign="start"
            >
                <DefaultButton
                    text={t("Back")}
                    onClick={() => {
                        if (text.length > 0) {
                            openLeavePageDialog();
                        } else {
                            navigate("/rfq");
                        }
                    }}
                />
                <Stack horizontal tokens={{childrenGap: 10}}>
                    <DefaultButton
                        text={t("Excel Download")}
                        styles={buttonStyles}
                        disabled={selectedItems.length === 0}
                        onClick={() =>
                            exportToExcel(
                                selectedItems,
                                Site_Relative_Links,
                                currentRFQ,
                                currentPartWithQuotation
                                //currentRFQRequisitions

                            )
                        }
                    />
                    {userType !== "Guest" && <DefaultButton
                        text={t("Accept")}
                        onClick={() => {
                            setDialog({
                                isOpen: true,
                                title: t("Accept Parts"),
                                tip: t(
                                    "Reminder: After accepting a part, please click “Proceed to PO creation: to post the order back to GPS"
                                ),
                                selectedItems: selectedItems || [],
                            });
                        }}
                        disabled={
                            selectedItems.length === 0 ||
                            !selectedItems.every(
                                (item) =>
                                    item.PartStatus === "Quoted" &&
                                    String(item.Handler) === String(userDetails.handlercode)
                            ) ||
                            userType === "Guest"
                        }
                        styles={buttonStyles}
                    />}
                    {userType !== "Guest" && <DefaultButton
                        text={t("Return")}
                        onClick={() => {
                            setDialog({
                                isOpen: true,
                                title: t("Return Parts"),
                                tip: t(
                                    "Reminder: The parts will be returned to the supplier to revise and re-submit"
                                ),
                                isInput: true,
                                selectedItems: selectedItems || [],
                            });
                        }}
                        disabled={
                            selectedItems.length === 0 ||
                            !selectedItems.every(
                                (item) =>
                                    (item.PartStatus === "Quoted" ||
                                        item.PartStatus === "Accepted" ||
                                        item.PartStatus === "Sent to GPS") &&
                                    String(item.Handler) === String(userDetails.handlercode)
                            ) ||
                            userType === "Guest"
                        }
                        styles={buttonStyles}
                    />}
                </Stack>
                {userType !== "Guest" && <DefaultButton
                    text={t("Proceed to PO Creation")}
                    onClick={() => {
                        setDialog({
                            isOpen: true,
                            title: t("Proceed to PO Creation"),
                            tip: t(
                                "Fields (i.e. “Order No.”) will follow UD-GPS default set up if no designated input/selection. " +
                                "Refer to UD-GPS screen 9.2.18 for Standard Text Contents."
                            ),
                            isProceed: true,
                            selectedItems: selectedItems || [],
                        });
                    }}
                    //                onClick={() => Download(selectedItems, Site_Relative_Links, currentRFQ, currentRFQRequisitions)}
                    styles={PObuttonStyles}
                    disabled={
                        selectedItems.length === 0 ||
                        !selectedItems.every(
                            (item) =>
                                item.PartStatus === "Accepted" &&
                                String(item.Handler) === String(userDetails.handlercode)
                        )
                    }
                />}
            </Stack>

            <Dialog
                hidden={!dialog.isOpen}
                onDismiss={() => setDialog({isOpen: false})}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: dialog.title,
                }}
                modalProps={{
                    isBlocking: true,
                }}
                maxWidth={800}
                minWidth={800}
            >
                <span style={{marginBottom: 10}}>{dialog.tip}</span>
                <DetailsList
                    items={selectedItems || []} //dialog.selectedItems
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    columns={
                        dialog.isProceed
                            ? columns.filter((item) =>
                                [
                                    "PartNumber",
                                    "Qualifier",
                                    "PartDescription",
                                    "MaterialUser",
                                    "Parma",
                                    "FirstLot",
                                    "OrderNumber",
                                    "StandardOrderText1",
                                    "StandardOrderText2",
                                    "StandardOrderText3",
                                    "FreePartText",
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ].includes(item.fieldName as any)
                            )
                            : columns.filter((item) =>
                                [
                                    "PartNumber",
                                    "Qualifier",
                                    "PartDescription",
                                    "MaterialUser",
                                    "QuotedUnitPriceTtl",
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ].includes(item.fieldName as any)
                            )
                    }
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={0} // Disable selection mode on DetailsList
                    styles={{
                        root: {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            "& .ms-List-cell, & .ms-DetailsRow, & .ms-DetailsRow-cell": {
                                //minHeight: 'auto',
                                height: "auto",
                                lineHeight: "normal",
                            },
                            "& .ms-DetailsRow-cell": {
                                padding: "10px 5px",
                            },
                            marginTop: 20,
                            marginBottom: 20,
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
                />

                {dialog.isInput && (
                    <Stack style={{marginBottom: 10}}>
                        <TextField
                            label={t("Input comments")}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            required
                            style={{width: "100%"}}
                            onChange={handleInputChange}
                        />
                    </Stack>
                )}

                <DialogFooter>
                    <DefaultButton
                        onClick={() => setDialog({isOpen: false})}
                        text={t("Cancel")}
                    />
                    <PrimaryButton
                        onClick={() => {
                            if (returncomments.length === 0 && dialog.isProceed) {
                                changeRequisition("Sent to GPS", "").then(
                                    (_) => _,
                                    (e) => console.log(e)
                                );
                            } else if (!dialog.isProceed && returncomments.length === 0) {
                                changeRequisition("Accepted", "").then(
                                    (_) => _,
                                    (e) => console.log(e)
                                );
                            } else {
                                changeRequisition("Returned", returncomments).then(
                                    (_) => _,
                                    (e) => console.log(e)
                                );
                            }
                            setreturnComments("");
                            setDialog({isOpen: false})
                        }}
                        disabled={returncomments.length === 0 && dialog.isInput}
                        text={t("OK")}


                    />
                </DialogFooter>
            </Dialog>

            {/* Leave Page Dialog */}
            <Dialog
                hidden={!isLeavePageDialogVisible}
                onDismiss={closeLeavePageDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Warning",
                    subText: t(
                        "Are you sure to leave this page without saving? All data will be lost."
                    ),
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => navigate("/rfq")} text={t("Yes")}/>
                    <DefaultButton onClick={closeLeavePageDialog} text={t("No")}/>
                </DialogFooter>
            </Dialog>
            {/* Hint info Page Dialog */}
            <Dialog
                hidden={!isHintPageDialogVisible}
                onDismiss={closeHintPageDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: t(dialogTitle),
                    subText: t(dialogSubText),
                }}
            >
                <DialogFooter>
                    {/*<PrimaryButton onClick={() => navigate("/rfq")} text={t("Yes")}/>*/}
                    <DefaultButton onClick={closeHintPageDialog} text={t("OK")}/>
                </DialogFooter>
            </Dialog>
            {isLoading && (
                <>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            zIndex: 1000001,
                        }}
                    >
                        {/* 蒙版层 */}
                    </div>
                    <Spinner
                        label={t("Loading...")}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1000002,
                        }}
                    />
                </>
            )}
        </Stack>
    );
};

export default QuoteCreation;

function formatDate(date?: Date): string {
    if (!date) {
        return "";
    }
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}
