import * as React from "react";
import {useState, useEffect} from "react";
import {
    Stack,
    ComboBox,
    IComboBoxOption,
    IComboBoxStyles,
    DatePicker,
    Dropdown,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    PrimaryButton,
    IComboBox,
    Dialog,
    DialogType,
    DialogFooter,
    DefaultButton,
    TextField
} from "@fluentui/react";
import FileUploader from "./upload";
import SupplierSelection from "./select";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {getAADClient} from "../../../../pnpjsConfig";
import {AadHttpClient} from "@microsoft/sp-http";
import {CONST} from "../../../../config/const";
import {useRFQ} from "../../../../hooks/useRFQ";
import {useDocument} from "../../../../hooks";
import {useRequisition} from "../../../../hooks/useRequisition";
import "./index.css"
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetchDatadropdown = async (input: string): Promise<[]> => {
    try {
        const client = getAADClient();
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetParma?q=${input}`;
        const response = await client.get(
            functionUrl,
            AadHttpClient.configurations.v1
        );
        return await response.json(); // 返回 JSON 数据
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // 或者抛出错误，根据你的逻辑需求
    }
};

const CreateRFQ: React.FC = () => {
    const comboBoxRef = React.useRef<IComboBox>(null);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log(state, "state");
    const [, , , , , , , , createRFQ] = useRFQ();
    const [, , , , , , , initialUploadRFQAttachments, ,] = useDocument();
    // 新状态定义
    const [parmaDetails, setParmaDetails] = useState<{
        name: string;
        country: string;
    }>({name: "", country: ""});

    const [columnsPerRow, setColumnsPerRow] = useState(5);
    const [form, setForm] = useState({parma: "", type: '', comment: ''});
    const [filteredOptions, setFilteredOptions] = useState<IComboBoxOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | undefined>();
    const [err, setErr] = useState({
        parma: false,
        type: false,
        date: false,
        show: false,
        contacts:false
    })
    const dropdownOptions = [
        {
            key: "BLPR Blanket Production Order",
            text: "BLPR Blanket Production Order",
        },
        {
            key: "QUPR Quantity Production Order",
            text: "QUPR Quantity Production Order",
        },
        {
            key: "SAPR Standalone Production Order",
            text: "SAPR Standalone Production Order",
        },
    ];
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

    const comboBoxStyles: Partial<IComboBoxStyles> = {
        root: {
            width: "100%",
        },
        optionsContainer: {width: "100%"},
        container: {
            selectors: {
                '.ms-ComboBox': {
                    '::after': {
                        borderColor: err.parma ? 'red' : 'rgb(96 94 92)',
                    }
                }
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleInputChange = async (text: string) => {
        setForm({...form, parma: text});
        if (text) {
            try {
                const response = await fetchDatadropdown(text);
                console.log(response, "eeee");
                if (response && Array.isArray(response)) {

                    comboBoxRef.current?.focus(true)
                    setFilteredOptions(
                        response.map((item: string) => ({
                            key: item, // 字符串本身作为选项的 key
                            text: item, // 字符串本身作为选项的 text
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        } else {
            setFilteredOptions([]);
        }
    };
    // 获取当前日期
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [formattedDate, setFormattedDate] = useState<string>(""); // 存储格式化后日期

    const [isRFQDialogVisible, setIsRFQDialogVisible] = useState(false);
    const [isLeavePageDialogVisible, setIsLeavePageDialogVisible] =
        useState(false);
    const [, , , , updateRequisition] = useRequisition()


    // Handlers to open dialogs

    const openRFQDialog = (): void => setIsRFQDialogVisible(true);
    const openLeavePageDialog = (): void => setIsLeavePageDialogVisible(true);

    // Handlers to close dialogs
    const closeRFQDialog = (): void => setIsRFQDialogVisible(false);
    const closeLeavePageDialog = (): void => setIsLeavePageDialogVisible(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
    };
    const formatDatewithwhiplash = (date: Date):string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
    };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleBlur = async () => {
        try {
            const data = await fetchData(form.parma);
            if (data) {
                console.log("Fetched data on blur:", data); // 输出返回结果
                // 更新状态
                setParmaDetails({name: data.name, country: data.country});
            } else {
                setParmaDetails({name: '', country: ''});
            }
        } catch (error) {
            setParmaDetails({name: '', country: ''});
            console.error("Error fetching data on blur:", error);
        }
    };
    const handleChange = async (
        event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption
    ): Promise<void> => {
        if (option) {
            setSelectedValue(option.key as string);
            setForm({...form, parma: option.text});
        }
        try {
            const data = await fetchData(form.parma);
            if (data) {
                console.log("Fetched data on blur:", data); // 输出返回结果
                // 更新状态
                setParmaDetails({name: data.name, country: data.country});
            } else {
                setParmaDetails({name: '', country: ''});
            }
        } catch (error) {
            setParmaDetails({name: '', country: ''});
            console.error("Error fetching data on blur:", error);
        }
    };
    const itemWidth = `calc(${100 / columnsPerRow}% - ${
        ((columnsPerRow - 1) * 10) / columnsPerRow
    }px)`;

    const columns = [
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
            name: t("Req Week From"),
            fieldName: "RequiredWeek",
            minWidth: 100,
        },
        {
            key: "CreateDate",
            name: t("Created Date"),
            fieldName: "CreateDate",
            minWidth: 100,
        },
        {key: "RfqNo", name: t("RFQ No."), fieldName: "RfqNo", minWidth: 80},
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
        {key: "Status", name: t("Status"), fieldName: "Status", minWidth: 80},
    ];
    const [selectedContacts, setSelectedContacts] = useState<
        { name: string; email: string; title?: string; functions?: string }[]
    >([]);
    const handleSubmit = async (): Promise<void> => {
        try {
            // 提取 selectedItems 中的 ID
            const requisitionIds = state.selectedItems.map((item: { ID: string }) => item.ID.toString());
            const userdetails = state.userDetails
            console.log(selectedContacts, "con",state.selectedItems);
            // 构造 RFQ 数据
            const rfqData = {
                RFQDueDate: selectedDate || new Date(),
                RFQStatus: "New", // 示例字段
                SupplierContact: JSON.stringify(selectedContacts.filter(Boolean)), // 将联系人转换为 JSON
                RFQInstructionToSupplier: form.comment, // RFQ 的评论
                OrderType: form.type, // 订单类型
                Parma: form.parma, // Parma 值
                RequisitionIds: JSON.stringify(requisitionIds), // 将 ID 数组转换为 JSON 字符串
                BuyerInfo:(userdetails?.porg?? " ") + " " + userdetails.handlercode,
                RFQType:"New Part Price",
                HandlerName:state.selectedItems[0].HandlerName,
                SupplierName:parmaDetails?.name,
                BuyerName:userdetails.userName,
                BuyerEmail:userdetails.userEmail,
                SectionInfo:state.selectedItems[0].SectionInfo + " " + state.selectedItems[0].SectionDescription,
            };

            console.log("RFQ Data to submit:", rfqData);

            // 提交 RFQ
            const newRFQId = await createRFQ(rfqData);

            // 更新每条记录
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.selectedItems.forEach((item: any) => {
                if(item.RequisitionType === "RB" && form.type ==="BLPR Blanket Production Order"){
                    updateRequisition({
                        ...item,
                        ID: item.ID,
                        Parma: form.parma,
                        AnnualQty: Number(item.OrderQty) ?? null,
                        Status: "New",
                    });
                }else{
                updateRequisition({
                    ...item,
                    ID: item.ID,
                    Parma: form.parma,
                    Status: "New",
                });
                }
            });

            // 上传附件
            if (selectedFiles.length > 0) {
                await initialUploadRFQAttachments(selectedFiles, newRFQId);
                console.log("Files uploaded successfully");
            }

            // 关闭对话框并跳转
            closeRFQDialog();
             navigate("/rfq");
        } catch (error) {
            console.error("Error submitting RFQ:", error);
            alert("Failed to submit RFQ.");
        }
    };



    console.log(selectedDate, formattedDate);
    return (
        <Stack className="RFQ" tokens={{childrenGap: 20, padding: 20}}>
            <h2 className="mainTitle">{t("New Parts RFQ Creation")}</h2>
            <Stack
                className="noMargin"
                horizontal
                tokens={{childrenGap: 30, padding: 20}}
                styles={{
                    root: {
                        backgroundColor: "#CCEEFF",
                        borderRadius: "4px",
                        marginBottom: "5px",
                        alignItems: "flex-start",
                    },
                }}
            >
                <Stack
                    horizontal
                    wrap
                    tokens={{childrenGap: 10}}
                    styles={{root: {width: "50%"}}}
                >
                    <Stack.Item
                        grow
                        styles={{root: {flexBasis: "40%", maxWidth: "50%"}}}
                    >
                        <ComboBox
                            componentRef={comboBoxRef}
                            label={t("Parma")}
                            options={filteredOptions}
                            autoComplete="on"
                            allowFreeform={true}
                            openOnKeyboardFocus={true}
                            onInputValueChange={handleInputChange}
                            onBlur={handleBlur}
                            useComboBoxAsMenuWidth={true}
                            // text={form.parma}
                            selectedKey={selectedValue}
                            styles={comboBoxStyles}
                            onChange={handleChange}
                            required={true}
                        />
                    </Stack.Item>
                    <Stack.Item
                        grow
                        styles={{
                            root: {flexBasis: "40%", width: "50%", alignSelf: "flex-end"},
                        }}
                    >
                        {parmaDetails.name}
                    </Stack.Item>
                    <Stack.Item
                        grow
                        styles={{root: {flexBasis: "40%", maxWidth: "50%"}}}
                    >
                        <div style={{display:'inline-block',fontSize:'14px',fontWeight:600,marginBottom:'5px',marginTop:'5px'}}>RFQ Due Date <span style={{color: '#a4262c',display:"inline-block"}}>*</span></div>
                        <DatePicker
                            // label={t("RFQ Due Date")}
                            minDate={tomorrow}
                            value={selectedDate} // 显示的日期值
                            onSelectDate={(date) => {
                                if (date) {
                                    setSelectedDate(date); // 设置内部日期状态
                                    const formatted = formatDate(date); // 格式化日期
                                    setFormattedDate(formatted); // 更新格式化后日期状态
                                }
                            }}
                            styles={{
                                root: {
                                    selectors: {
                                        '.ms-TextField-fieldGroup': {
                                            borderColor: err.date ? 'red' : 'rgb(96 94 92)'
                                        }
                                    }
                                },
                            }}
                            formatDate={formatDatewithwhiplash}
                            allowTextInput



                        />
                    </Stack.Item>
                    <Stack.Item
                        grow
                        styles={{root: {flexBasis: "40%", maxWidth: "50%" }}}
                    >
                        <Dropdown
                            label="Order Type"
                            required={true}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e, newValue: any) => {
                                setForm({
                                    ...form,
                                    type: newValue.text
                                })
                            }}
                            options={
                                state.selectedItems[0].RequisitionType === "PP"
                                    ? [
                                        {
                                            key: "SAPP Standalone Prototype Order",
                                            text: "SAPP Standalone Prototype Order",
                                        },
                                    ]
                                    : dropdownOptions
                            }
                            style={{width: Number(itemWidth) - 30}}
                            styles={{
                                title: {
                                    borderColor: err.type ? 'red' : 'rgb(96 94 92)'
                                },
                            }}
                        />
                    </Stack.Item>
                    <Stack.Item
                        grow
                        styles={{root: {flexBasis: "100%", maxWidth: "100%"}}}
                    >
                        <FileUploader
                            title={t("Add RFQ Attachments")}
                            initalNum={4}
                            onFileSelect={(files) => setSelectedFiles(files)}
                        />
                    </Stack.Item>
                </Stack>
                <Stack horizontal wrap tokens={{ childrenGap: 10 }} verticalAlign="start" styles={{ root: { width: '50%' } }}>
                    {/* 控制每个 Stack.Item 的宽度 */}
                    <Stack grow styles={{ root: { width: '100%'} }}>
                        <SupplierSelection
                            parma={form}
                            onContactsChange={(contacts) => setSelectedContacts(contacts)}
                        />
                    </Stack>
                    <Stack.Item grow styles={{ root: {  flexBasis: '100%', maxWidth: '100%' } }}>
                        <TextField label="RFQ Instruction to Supplier" value={form.comment} placeholder="Optional" multiline rows={3} style={{width: '100%'}} onChange={(e, val) => setForm({
                            ...form,
                            comment: val || ''
                        })}/>
                    </Stack.Item>
                </Stack>
            </Stack>
            <h3 className="mainTitle noMargin">{t("Selected Parts")}</h3>
            <DetailsList
                className="detailList"
                items={state.selectedItems}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionMode={SelectionMode.none}
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
            />
            <Stack horizontal tokens={{childrenGap: 10, padding: 10}}>
                <PrimaryButton
                    text={t("Back")}
                    onClick={() => {
                        openLeavePageDialog();
                    }}
                />
                <PrimaryButton
                    text={t("Submit")}
                    onClick={() => {

                        if(!form.parma || !form.type || !selectedDate || selectedContacts.length===0 || !parmaDetails.country?.includes("JP")) {
                            console.log("sle",selectedContacts);
                            return setErr({
                                parma: !form.type,
                                type: !form.type,
                                date: !selectedDate,
                                show: true,
                                contacts: !selectedContacts,
                            })
                        }
                        openRFQDialog();
                    }}
                />
            </Stack>

            {/* RFQ Dialog */}
            <Dialog
                hidden={!isRFQDialogVisible}
                onDismiss={closeRFQDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Confirmation",
                    subText:
                        "Are you sure to send RFQ? Notification email will be sent to selected supplier contact.",
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => {
                        closeRFQDialog()
                        handleSubmit().then(_ => _, _ => _);

                    }} text="Yes"/>
                    <DefaultButton onClick={closeRFQDialog} text="No"/>
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
                    <PrimaryButton onClick={() => navigate("/requisition")} text="Yes"/>
                    <DefaultButton onClick={closeLeavePageDialog} text="No"/>
                </DialogFooter>
            </Dialog>

            <Dialog
                hidden={!err.show}
                onDismiss={closeLeavePageDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Warning",
                    subText: !parmaDetails.country?.includes("JP")
                        ? "Selected Parma is not a Japanese supplier, please go to the GPS system to proceed for Non-Japan parma. " +
                        "Please click the cancel button if you want to change to a different supplier."
                        : "Missing required value(s).",
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => {
                        setErr({
                            ...err,
                            show: false
                        })
                    }} text="OK"/>
                </DialogFooter>
            </Dialog>
        </Stack>
    );
};

export default CreateRFQ;
