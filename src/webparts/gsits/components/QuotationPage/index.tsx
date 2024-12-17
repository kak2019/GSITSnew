import React, {useEffect, useState} from "react";
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
    Selection, IDropdownOption, Dropdown
} from "@fluentui/react";
import {useTranslation} from "react-i18next";
import AppContext from "../../../../AppContext";
import {getAADClient} from "../../../../pnpjsConfig";
import {CONST} from "../../../../config/const";
import {AadHttpClient} from "@microsoft/sp-http";
import {useRFQ} from "../../../../hooks/useRFQ";
import {useDocument, useUser} from "../../../../hooks"
import {useLocation, useNavigate} from "react-router-dom";
import {IComment} from "../../../../model/comment"
import {useQuotation} from "../../../../hooks/useQuotation";
import exportToExcel from "./download";
import EditIcon from "./icon";
import {mergeStyles} from '@fluentui/react/lib/Styling';
import {KnowledgeArticleIcon} from '@fluentui/react-icons-mdl2';
import "./index.css";
import {IMasterData} from "../PriceBreakDown/IPriceBreakDown";
import {boolean} from "yup";
import {IProceedToPoFields} from "../../../../model/requisition";
import Download from "./generateFourTypesFile";

const iconClass = mergeStyles({
    fontSize: 20,
    height: 20,
    width: 20,
    margin: '0 10px',
});

const classes = mergeStyleSets({
    fileList: {
        marginTop: '10px',
        position: 'relative',
        height: '140px',
        overflow: 'hidden',
        overflowY: 'auto',
        border: '1px solid #ccc'
    },
    fileItem: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e1dfdd',
        padding: '5px 10px',
        alignItems: 'center',
        height: '35px',
        boxSizing: 'border-box'
    },
    oddItem: {
        backgroundColor: '#fff',
    },
    evenItem: {
        backgroundColor: '#F6F6F6',
    },
    label: {
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        marginTop: "4px",
        fontWeight: 'bold'
    },
    labelItem: {
        marginBottom: '10px'
    },
    labelValue: {
        lineHeight: '30px',
        minHeight: "30px"
    }
})
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
    //const [, , , , , , , , , , , createActionLog, acceptOrReturn, , ] = useQuotation()
    const [, , , , , , , , , , , , createActionLog, acceptOrReturn, , ,proceedToPo] = useQuotation()
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const selection = new Selection({
        onSelectionChanged: () => {
            const items = selection.getSelection(); // 获取选中的记录
            setSelectedItems(items); // 将选中的记录存入状态
        },
    });
    const [supplierinfo, setsupplierinfo] = useState({SupplierName: "", IsSme: boolean, CountryCode: ""});
    const {t} = useTranslation();
    const [, , , rfqAttachments, , , , , getRFQAttachments] = useDocument()
    const [, , , currentRFQ, currentRFQRequisitions, , getRFQ, updateRFQ,] = useRFQ();
    let userEmail = "";
    let userName = "";
    let webURL = "";
    let Site_Relative_Links = ""
    const [userType, setUserType] = useState<string>("Unknown");
    const {getUserType} = useUser();
    const location = useLocation();
    const state = location.state;
    const parma = state.selectedItems[0].Parma;
    console.log(state, "status");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [text, setText] = useState<any>()
    const [userDetails, setUserDetails] = useState({
        role: "",
        name: "",
        sectionCode: "",
        handlercode: ""
    });
    const [returncomments, setreturnComments] = useState("");
    const [isLeavePageDialogVisible, setIsLeavePageDialogVisible] =
        useState(false);
    const closeLeavePageDialog = (): void => setIsLeavePageDialogVisible(false);
    const openLeavePageDialog = (): void => setIsLeavePageDialogVisible(true);
    // 处理输入框变化的方法
    const handleInputChange = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
    ): void => {
        setreturnComments(newValue || ""); // 更新状态
    };

    // 输入框变化处理函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChangeOrderno = (newValue: string | undefined, props: any): void => {
        console.log("Changed Value:", newValue, "Row Data:", props);
        // 在这里可以处理逻辑，例如更新状态或调用 API
        // 例如：props.FirstLot = newValue; (更新当前行数据)
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dialog, setDialog] = useState<any>({})

    const ctx = React.useContext(AppContext);
    if (!ctx || !ctx.context) {
        throw new Error("AppContext is not provided or context is undefined");
    } else {
        userEmail = ctx.context._pageContext._user.email;
        userName = ctx.context._pageContext._user?.displayName;
        webURL = ctx.context?._pageContext?._web?.absoluteUrl;
        Site_Relative_Links = webURL.slice(webURL.indexOf('/sites'))
        console.log("Site_Relative_Links", Site_Relative_Links)
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


        // 调用 getUserType 并根据结果执行逻辑
        getUserType(userEmail).then((type) => {
            if (userType !== type) { // 只有当 userType 变化时才更新状态
                setUserType(type);
                console.log("UserType updated to: ", userType);
            }
            if (type !== "Guest") {
                fetchData().then(_ => _, _ => _);
            }
        }).catch(e => console.error("Error fetching GPS user props:", e));
    }, [userType]);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const init = async () => {
        const ID = state.selectedItems[0].ID

        console.log("ID", state.selectedItems[0].ID)
        getRFQ(ID && (ID + ''));
        //getRFQ("84")
        getRFQAttachments(ID && (ID + ''))
        // console.log("all", rfqAttachments);
        // console.log("allewew",currentRFQRequisitions);
    }

    React.useEffect(() => {
        init().then(_ => _, _ => _);
    }, []);
    useEffect(() => {
        console.log(parma, "par")
        if (parma && (parma + "")) {
            fetchData(currentRFQ.Parma + "").then(a => setsupplierinfo({
                SupplierName: a?.name,
                IsSme: a?.smallMediumCapital,
                CountryCode: a?.country
            })).catch(e => console.error(e));
        }
    }, [userType]);
    // console.log("all2", userDetails);
    // console.log("curretRFQ", currentRFQ);
    // console.log("currentRFQRequisitions", currentRFQRequisitions);
    // console.log("documents", rfqAttachments);
    const onclickAddComment = (): void => {
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
            updateRFQ({
                ID: currentRFQ?.ID,
                CommentHistory: JSON.stringify(updatedComments), // 序列化成字符串
            });
            setText("");
            const ID = state.selectedItems[0]?.ID;
            if (ID) {
                getRFQ(ID.toString());
            }
        }
    }
    const navigateToPriceBreakDown = (qutationID: string): void => {
        const PriceObi_temp: IMasterData = {
            role: userDetails.role === "Buyer" ? "Buyer" : "Supplier",
            supplierId: currentRFQ.Parma,
            quotationId: qutationID,
            rfqId: String(currentRFQ.ID),
            userEmail: userEmail,
            userName: userName,
            isSME: userDetails.role === "Buyer" ? false : supplierinfo.IsSme !== undefined ? Boolean(supplierinfo.IsSme) : undefined,
            countryCode: supplierinfo.CountryCode


        }


        navigate("price-breakdown", {state: PriceObi_temp})
    }

    // 处理 Dropdown 值变化的函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, props?: any): void => {
        console.log("Selected Option:", option?.text, "Row Data:", props);
    };

    const columns = [
                {key: "column1", name: t("Part No."), fieldName: "PartNumber", minWidth: 100},
                {key: "column2", name: t("Qualifier"), fieldName: "Qualifier", minWidth: 100},
                {key: "column3", name: t("Part Description"), fieldName: "PartDescription", minWidth: 150},
                {key: "column4", name: t("Material User"), fieldName: "MaterialUser", minWidth: 100},
                {key: "column5", name: t("Price Type"), fieldName: "PriceType", minWidth: 100},
                {key: "column6", name: t("Annual QTY"), fieldName: "AnnualQty", minWidth: 100},
                {key: "column7", name: t("Order Qty"), fieldName: "OrderQty", minWidth: 100},
                {key: "column8", name: t("Quoted Unit Price"), fieldName: "QuotedUnitPrice", minWidth: 150},
                {key: "column9", name: t("Currency"), fieldName: "Currency", minWidth: 100},
                {key: "column10", name: t("UOP"), fieldName: "UOP", minWidth: 100},
                {key: "column11", name: t("Effective Date"), fieldName: "EffectiveDate", minWidth: 150},
                {key: "column12", name: t("Part Status"), fieldName: "PartStatus", minWidth: 100},
                {key: "column13", name: t("Parma"), fieldName: "Parma", minWidth: 100},
                {key: "column14", name: t("Last Comment By"), fieldName: "LastCommentBy", minWidth: 180},
                {
                    key: "column15",
                    name: "Action",
                    minWidth: 100,
                    fieldName: "Action",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onRender: (props: any) => {
                        console.log(props, props)
                        return <>{
                            //props.PartStatus === 'Quoted' &&  <KnowledgeArticleIcon className={iconClass}/>
                            props.PartStatus === 'Quoted' && <KnowledgeArticleIcon className={iconClass} onClick={() => {
                                navigateToPriceBreakDown(props.ID)
                            }}/>
                        }
                            {['New', 'In Progress', 'Returned'].includes(props.PartStatus) && <div onClick={() => {
                                navigateToPriceBreakDown(props.ID)
                            }}><EditIcon/></div>}
                        </>
                    }
                },
                {key: "column16", name: t("First Lot"), fieldName: "FirstLot", minWidth: 75},
                {
                    key: "column17", name: t("Order No."),fieldName:"OrderNo", minWidth: 75,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onRender: (props: any) => {
                        return (
                            <TextField
                                value={props.FirstLot} // 当前单元格的值
                                onChange={(event, newValue) => handleInputChangeOrderno(newValue, props)} // 输入框变化时处理函数
                                styles={{
                                    root: {width: '100%'}, // 输入框宽度与单元格匹配
                                    field: {padding: '0 4px'}, // 可选：调整内部样式
                                }}
                            />
                        );
                    },
                },
                {
                    key: "column18",
                    name: t("Std Text 1"),
            fieldName:"StdText1",
            minWidth: 150,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    {key: 'Std Text 1', text: 'Std Text 1'},
                    {key: 'Option2', text: 'Option 2'},
                    {key: 'Option3', text: 'Option 3'},
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props.selectedOption} // 传入当前选中的值
                        options={options}                  // 传入选项
                        onChange={(e, option) => handleDropdownChange(e, option, props)} // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc", width: 120,
                            }
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column19",
            name: t("Std Text 2"),
            fieldName:"StdText2",
            minWidth: 150,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    {key: 'Std Text 2', text: 'Std Text 2'},
                    {key: 'Option2', text: 'Option 2'},
                    {key: 'Option3', text: 'Option 3'},
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props.selectedOption} // 传入当前选中的值
                        options={options}                  // 传入选项
                        onChange={(e, option) => handleDropdownChange(e, option, props)} // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc", width: 120,
                            }
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column20",
            name: t("Std Text 3"),
            fieldName:"StdText3",
            minWidth: 150,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any) => {
                // 定义 Dropdown 的选项
                const options: IDropdownOption[] = [
                    {key: 'Std Text 3', text: 'Std Text 3'},
                    {key: 'Option2', text: 'Option 2'},
                    {key: 'Option3', text: 'Option 3'},
                ];

                // 渲染 Dropdown 组件
                return (
                    <Dropdown
                        selectedKey={props.selectedOption} // 传入当前选中的值
                        options={options}                  // 传入选项
                        onChange={(e, option) => handleDropdownChange(e, option, props)} // 处理值变化
                        styles={{
                            dropdown: {
                                margin: "1px",
                                border: "1px solid #cccccc", width: 120,
                            }
                        }} // 设置样式
                    />
                );
            },
        },
        {
            key: "column21", name: t("Free Text per Par"), fieldName: "FreeTextperPa",minWidth: 75,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRender: (props: any) => {
                return (
                    <TextField
                        value={props.FirstLot} // 当前单元格的值
                        onChange={(event, newValue) => handleInputChangeOrderno(newValue, props)} // 输入框变化时处理函数
                        styles={{
                            root: {width: '100%'}, // 输入框宽度与单元格匹配
                            field: {padding: '0 4px'}, // 可选：调整内部样式
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
                return `${commentDate} - ${commentBy} - ${commentText}`;
            })
            .join("\n"); // 用换行符分隔每条评论
    }

    // const toJST = (date: Date): Date => {
    //   const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    //   return new Date(utc + 9 * 3600000); // 添加9小时的偏移量
    // };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const changeRequisition = async (statusType: string, comment: string) => {
        console.log(statusType, comment, selectedItems);

        try {
            // 遍历选中记录，逐一更新
            for (const item of selectedItems) {
                const newComment: IComment = {
                    CommentDate: new Date(),
                    CommentBy: userName || "",
                    CommentText: comment,
                    CommentType: statusType,
                };

                // 解析现有的 CommentHistory，如果为空则初始化为空数组
                const existingComments: IComment[] =
                    currentRFQ && currentRFQ.CommentHistory
                        ? JSON.parse(currentRFQ.CommentHistory)
                        : [];
                const updatedComments = [...existingComments, newComment];

                // 根据 statusType 执行不同的操作
                if (statusType === "Sent to GPS") {
                    const temppo: IProceedToPoFields = {
                        ID: item.ID,
                        Status: "Sent to GPS",
                        StandardOrderText1: item.StandardOrderText1 || "",
                        StandardOrderText2: item.StandardOrderText2 || "",
                        StandardOrderText3: item.StandardOrderText3 || "",
                        FreePartText: item.FreePartText ?? "",
                        OrderNumber: item.OrderNumber ?? "",
                    };
                    await proceedToPo(temppo); // 等待 proceedToPo 完成
                } else {
                    await acceptOrReturn(statusType, item.ID, JSON.stringify(updatedComments)); // 等待 acceptOrReturn 完成
                }

                // 创建操作日志
                const actionLog = {
                    LogType:
                        statusType === "Returned"
                            ? "Return Quote"
                            : statusType === "Sent to GPS"
                                ? "Sent to GPS"
                                : "Accept Quote",
                    User: userEmail || "",
                    Date: new Date(),
                    RFQId: currentRFQ ? currentRFQ.ID : "",
                    RequisitionId: item.ID,
                };

                await createActionLog(actionLog); // 等待日志创建完成
                console.log(`Action log created successfully for item ID: ${item.ID}`);
            }
            if(statusType ==="Sent to GPS"){
                await Download(selectedItems, Site_Relative_Links, currentRFQ, currentRFQRequisitions)
            }

            // 更新 RFQ 数据
            const ID = state.selectedItems[0]?.ID;
            if (ID) {
                console.log("Updating RFQ for ID:", ID);
                await getRFQ(String(ID));
            }

            // 关闭对话框
            setDialog({ isOpen: false });
        } catch (error) {
            console.error("Error in changeRequisition method:", error);
        }
    };



    return (
        <Stack tokens={{childrenGap: 20, padding: 20}}>
            {/* Header */}
            <Text variant="xxLarge" style={{backgroundColor: "#99CCFF", padding: "10px"}}>
                Creation of Quote
            </Text>

            {/* RFQ Basic Info */}
            <Stack tokens={{childrenGap: 10}} styles={{root: {border: "1px solid #ccc", padding: 20}}}>
                <Text variant="large">RFQ Basic Info</Text>
                <Stack horizontal tokens={{childrenGap: 100}}>
                    <Stack tokens={{childrenGap: 10}} styles={{root: {width: '50%'}}}>
                        <Stack horizontal tokens={{childrenGap: 10}} horizontalAlign="space-between">
                            <Stack tokens={{childrenGap: 10}}>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> RFQ No</div>
                                    <div className={classes.labelValue}>{currentRFQ?.RFQNo || " "}</div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> Parma</div>
                                    <div className={classes.labelValue}>{currentRFQ?.Parma}</div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> RFQ Due Date</div>
                                    <div className={classes.labelValue}>{formatDate(currentRFQ?.RFQDueDate)}</div>
                                </div>
                            </Stack>
                            <Stack tokens={{childrenGap: 10}}>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> RFQ Release Date</div>
                                    <div className={classes.labelValue}>{formatDate(currentRFQ?.Created)}</div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> Supplier Name</div>
                                    <div className={classes.labelValue}>{currentRFQ.SupplierName}</div>
                                </div>
                                <div className={classes.labelItem}>
                                    <div className={classes.label}> Order Type</div>
                                    <div className={classes.labelValue}>{currentRFQ?.OrderType}</div>
                                </div>
                            </Stack>
                        </Stack>
                        <Label>RFQ Attachments</Label>
                        <Stack className={classes.fileList}>
                            {
                                rfqAttachments.concat(Array.from({length: 4 - rfqAttachments.length})).map((val, i) => {
                                    return !!val ? <div
                                        className={classes.fileItem + ' ' + (i % 2 === 0 ? classes.oddItem : classes.evenItem)}>
                                        <Link href={val.Url}>{val.File.name}</Link>
                                    </div> : (i <= 3 ? <div
                                        className={classes.fileItem + ' ' + (i % 2 === 0 ? classes.oddItem : classes.evenItem)}/> : null)
                                })
                            }
                        </Stack>


                    </Stack>
                    <Stack tokens={{childrenGap: 10}} styles={{root: {width: '50%'}}}>
                        <Label>Contact</Label>
                        <DetailsList
                            items={JSON.parse(currentRFQ?.SupplierContact ?? '[]')}
                            columns={[
                                {key: "contact", name: "Contact", fieldName: "name", minWidth: 100},
                                {key: "email", name: "Email", fieldName: "email", minWidth: 100},
                                {key: "title", name: "title", fieldName: "title", minWidth: 100},
                                {key: "role", name: "Role", fieldName: "functions", minWidth: 100},
                            ]}
                            layoutMode={DetailsListLayoutMode.fixedColumns}
                            selectionMode={SelectionMode.none}
                            onRenderDetailsHeader={() => null}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onRenderRow={(props: any) => {
                                return <DetailsRow {...props}
                                                   className={props.itemIndex % 2 === 0 ? classes.evenItem : classes.oddItem}/>
                            }}
                        />
                        <TextField label="RFQ Instruction to Supplier" multiline rows={3}
                                   value={currentRFQ?.RFQInstructionToSupplier} disabled/>
                    </Stack>
                </Stack> </Stack>


            {/* Quote Basic Info */}
            <Stack tokens={{childrenGap: 10}} styles={{root: {border: "1px solid #ccc", padding: 20}}}>
                <Text variant="large">Quote Basic Info</Text>
                <Stack horizontal tokens={{childrenGap: 100}}>
                    <Stack tokens={{childrenGap: 10}} grow>
                        <Stack horizontal tokens={{childrenGap: 10}} horizontalAlign="space-between">
                            <div className={classes.labelItem}>
                                <div className={classes.label}> Status</div>
                                <div className={classes.labelValue}>{userType === "Guest"
                                    ? currentRFQ.RFQStatus === "Sent to GPS"
                                        ? "In Progress"
                                        : currentRFQ.RFQStatus // Supplier 看到的状态
                                    : currentRFQ.RFQStatus// Buyer 看到的状态
                                }</div>
                            </div>
                            <div className={classes.labelItem}>
                                <div className={classes.label}>Last Quote Date</div>
                                <div className={classes.labelValue}>{formatDate(currentRFQ?.LatestQuoteDate)}</div>
                            </div>
                        </Stack>
                        <Stack tokens={{childrenGap: 10}} grow>

                            <TextField label="Input Comments" value={text} multiline rows={3}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                       onChange={(e, v: any) => setText(v)}/>
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <PrimaryButton onClick={onclickAddComment} text="Add"
                                    // styles={{root: { backgroundColor: 'skyblue', width: '50px', textAlign: 'right' }}}
                                               styles={buttonStyles}
                                />
                            </div>

                        </Stack>
                    </Stack>

                    <Stack tokens={{childrenGap: 10}} grow>
                        <Label style={{fontWeight: 'bold'}}>Comment History</Label>
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
            <Stack tokens={{childrenGap: 10}} styles={{root: {border: "1px solid #ccc"}}}>
                <Text className="mainTitle" variant="large">Quote Breakdown Info</Text>
                <DetailsList
                    items={currentRFQRequisitions}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    columns={columns.filter(item => ['PartNumber', 'Qualifier', 'PartDescription', 'MaterialUser', 'PriceType','PriceType','AnnualQty','OrderQty','QuotedUnitPric','Currency', 'UOP',"EffectiveDate",'PartStatus','LastCommentBy','Action'].includes(item.fieldName as any))}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionMode={SelectionMode.multiple}
                    selection={selection}
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
                />
            </Stack>

            {/* Footer Buttons */}
            <Stack horizontal tokens={{childrenGap: 10, padding: 10}} horizontalAlign="start">
                <DefaultButton text="Back" onClick={() => {
                    openLeavePageDialog();
                }}/>
                <Stack horizontal tokens={{childrenGap: 10}}>
                    <DefaultButton text="Excel Download"
                                   styles={buttonStyles}
                                   disabled={selectedItems.length === 0 || userType === "Guest"}
                                   onClick={() => exportToExcel(selectedItems, Site_Relative_Links, currentRFQ, currentRFQRequisitions)}
                    />
                    <DefaultButton text={t("Accept")} onClick={() => {
                        setDialog({
                            isOpen: true,
                            title: t('Accept Parts'),
                            tip: t('Reminder: After accepting a part, please click “Proceed to PO creation: to post the order back to GPS'),
                            selectedItems: selectedItems || [],
                        })

                    }}
                                   disabled={selectedItems.length === 0 || !selectedItems.every(item => item.PartStatus === 'Quoted') || userType === "Guest"}
                                   styles={buttonStyles}

                    />
                    <DefaultButton text={t("Return")} onClick={() => {
                        setDialog({
                            isOpen: true,
                            title: t('Return Parts'),
                            tip: t('Reminder: The parts will be returned to the supplier to revise and re-submit'),
                            isInput: true,
                            selectedItems: selectedItems || [],
                        })
                    }}

                                   disabled={selectedItems.length === 0 || (!selectedItems.every(item => item.PartStatus === 'Quoted' || item.PartStatus === 'Accepted' || item.PartStatus === 'Sent to GPS') )|| userType === "Guest"}
                                   styles={buttonStyles}
                    />
                </Stack>
                <DefaultButton text={t("Proceed to PO Creation")}
                               onClick={() => {
                    setDialog({
                        isOpen: true,
                        title: t('Proceed to PO Creation'),
                        tip: t('Please refer to GPS screen 9.2.18 for standard text contents.'),
                        isProceed: true,
                        selectedItems: selectedItems || [],
                    })
                }}
                //                onClick={() => Download(selectedItems, Site_Relative_Links, currentRFQ, currentRFQRequisitions)}
                               styles={PObuttonStyles}
                    // disabled={selectedItems.length === 0 || !selectedItems.every(item => item.status === 'Accepted')}

                />

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
            >
                <span>{dialog.tip}</span>
                <DetailsList
                    items={dialog.selectedItems || []}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    columns={dialog.isProceed? columns.filter(item => ['PartNumber', 'Qualifier', 'PartDescription', 'MaterialUser', 'Parma',"FirstLot","OrderNo","StdText1","StdText2","StdText3","FreeTextperPa"].includes(item.fieldName as any)): columns.filter(item => ['PartNumber', 'Qualifier', 'PartDescription', 'MaterialUser', 'QuotedUnitPrice'].includes(item.fieldName as any))}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionMode={0} // Disable selection mode on DetailsList
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
                />

                {
                    dialog.isInput && <Stack style={{marginBottom: 10}}>
                        <TextField label="Input comments"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                   required
                                   style={{width: '100%'}}
                                   onChange={handleInputChange}
                        />

                    </Stack>
                }

                <DialogFooter>
                    <DefaultButton onClick={() => setDialog({isOpen: false})} text="Cancel"/>
                    <PrimaryButton onClick={() => {
                        if (returncomments.length === 0 && dialog.isProceed) {
                            changeRequisition("Sent to GPS", "").then(_ => _, _ => _);

                        }else if(!dialog.isProceed && returncomments.length === 0 ) {
                            changeRequisition("Accepted", "").then(_ => _, _ => _);
                        }
                        else {
                            changeRequisition("Returned", returncomments).then(_ => _, _ => _);
                        }
                        setreturnComments("")
                    }}
                                   disabled={returncomments.length === 0 && dialog.isInput}
                                   text="OK"/>

                    {/*setDialog({isOpen: false})*/}
                </DialogFooter>


            </Dialog>

            {/* Leave Page Dialog */}
            <Dialog
                hidden={!isLeavePageDialogVisible}
                onDismiss={closeLeavePageDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Warning",
                    subText:
                        "Are you sure to leave this page? All filled contents will be lost.",
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => navigate("/rfq")} text="Yes"/>
                    <DefaultButton onClick={closeLeavePageDialog} text="No"/>
                </DialogFooter>
            </Dialog>
        </Stack>
    );
};

export default QuoteCreation;


function formatDate(date?: Date): string {

    if (!date) {
        return ''
    }
    date = new Date(date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
}