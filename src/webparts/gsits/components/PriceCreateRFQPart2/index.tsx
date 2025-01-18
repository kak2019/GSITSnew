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
    TextField, IColumn, Spinner, Label,
} from "@fluentui/react";
import FileUploader from "./upload";
import SupplierSelection from "./select";
//import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {getAADClient} from "../../../../pnpjsConfig";
import {AadHttpClient} from "@microsoft/sp-http";
import {CONST} from "../../../../config/const";
//import {useRFQ} from "../../../../hooks/useRFQ";
//import {useDocument} from "../../../../hooks";
//import {useRequisition} from "../../../../hooks/useRequisition";
import "./index.css"
import theme from "../../../../config/theme";
import {useUDGSAttachment} from "../../../../hooks-v2/use-udgs-attachment";
import {IUDGSAttachmentFormModel} from "../../../../model-v2/udgs-attachment-model";
import {useUDGSRFQ} from "../../../../hooks-v2/use-udgs-rfq";
import {IUDGSRFQFormModel} from "../../../../model-v2/udgs-rfq-model";
import {useUDGSPart} from "../../../../hooks-v2/use-udgs-part";
import {IUDGSNewPartFormModel} from "../../../../model-v2/udgs-part-model";
import {useTranslation} from "react-i18next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchData = async (parmaValue: string): Promise<any> => {
    try {
        const client = getAADClient();
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetSupplierInfo/${parmaValue}`;
        const response = await client.get(
            functionUrl,
            AadHttpClient.configurations.v1
        );
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const result = await response.json();
        console.log("Fetched data:", result);
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
const getEffectiveDate = (isSME: boolean,targetDate:Date): Date => {

    if (isSME) {
        // f SME, return the first day of the month following today's next month
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 2; // the month after next (2 month after)
        return new Date(year, month, 1); // first day
    } else {
        // 如果不是 SME，返回今天五个月后的第一天
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() - 5; // 5 month ago
        return new Date(year, month, 1); // first day
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
        return [];
    }
};

const CreateRFQPart2: React.FC = () => {
    const {t} = useTranslation();
    const [supplierinfo, setsupplierinfo] = useState({
        SupplierName: "",
        IsSme: false,
        CountryCode: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [mineffectDate,setmineffectDate] = useState<Date>();
    const comboBoxRef = React.useRef<IComboBox>(null);
    //const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log(state, "state");
    //const [, , , , , , , , createRFQ] = useRFQ();
    const [, , , , , , postRFQ, ] = useUDGSRFQ();
    //const [, , , , , , , initialUploadRFQAttachments, ,] = useDocument();
    const [, , , , postAttachments] = useUDGSAttachment()
    // define new state
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
        //type: false,
        date: false,
        effdate: false,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchDataSupplierinfo = async (parmaValue: string): Promise<any> => {
        try {
            const client = getAADClient();
            const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetSupplierInfo/${parmaValue}`;
            const response = await client.get(
                functionUrl,
                AadHttpClient.configurations.v1
            );

            // check response
            if (!response.ok) {
                console.error("Error fetching data:", response.statusText);
                return null;
            }

            const result = await response.json();
            console.log("Fetched data:", result);

            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };
    useEffect(() => {
        const handleResize = (): void => {
            const width = window.innerWidth;
            if (width > 1200) setColumnsPerRow(5.5);
            else if (width > 800) setColumnsPerRow(3);
            else setColumnsPerRow(2);
        };
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const fetchparma = async () => {
            try {
                const data = await fetchData(state.selectedItems[0].Parma);
                if (data) {
                    console.log("Fetched data on blur:", data); // 输出返回结果
                    // update
                    setParmaDetails({name: data.name, country: data.country});
                } else {
                    setParmaDetails({name: '', country: ''});
                }
            } catch (error) {
                setParmaDetails({name: '', country: ''});
                console.error("Error fetching data on blur:", error);
            }
        };
        fetchDataSupplierinfo(state.selectedItems[0].Parma)
            .then((a) =>
                setsupplierinfo({
                    SupplierName: a?.name,
                    IsSme: a?.smallMediumCapital,
                    CountryCode: a?.country,
                })
            )
            .catch((e) => console.error(e));
        fetchparma().then(_ => _, _ => _);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);


    }, [state]);

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
                            key: item,
                            text: item,
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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedDateEffect, setSelectedDateEffect] = useState<Date | undefined>(undefined);
    const [formattedDate, setFormattedDate] = useState<string>(""); // 存储格式化后日期
    const [formattedDateEffect, setFormattedDateEffect] = useState<string>("")
    const [isRFQDialogVisible, setIsRFQDialogVisible] = useState(false);
    const [isLeavePageDialogVisible, setIsLeavePageDialogVisible] =
        useState(false);
    //const [, , , , updateRequisition] = useRequisition()
    const [, , , , , , , , , putPart, ] = useUDGSPart();
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
                console.log("Fetched data on blur:", data);
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
                console.log("Fetched data on blur:", data);
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

// just a copy
    // const columns:IColumn[] = [
    //     {
    //         key: "PartNumber",
    //         name: t("Part Number"),
    //         fieldName: "PartNumber",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.PartNumber}</div>
    //     },
    //     {
    //         key: "Qualifier",
    //         name: t("Qualifier"),
    //         fieldName: "Qualifier",
    //         minWidth: 50,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.Qualifier}</div>
    //     },
    //     {
    //         key: "PartDescription",
    //         name: t("Part Description"),
    //         fieldName: "PartDescription",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.PartDescription}</div>
    //     },
    //     {
    //         key: "MaterialUser",
    //         name: t("Material User"),
    //         fieldName: "MaterialUser",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.MaterialUser}</div>
    //     },
    //     {
    //         key: "RequisitionType",
    //         name: t("Requisition Type"),
    //         fieldName: "RequisitionType",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.RequisitionType}</div>
    //     },
    //     {
    //         key: "AnnualQty",
    //         name: t("Annual Qty"),
    //         fieldName: "AnnualQty",
    //         minWidth: 80,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.AnnualQty}</div>
    //     },
    //     {
    //         key: "OrderQty",
    //         name: t("Order Qty"),
    //         fieldName: "OrderQty",
    //         minWidth: 80,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.OrderQty}</div>
    //     },
    //     {
    //         key: "RequiredWeek",
    //         name: t("Required Week"),
    //         fieldName: "RequiredWeek",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.RequiredWeek}</div>
    //     },
    //     {
    //         key: "CreateDate",
    //         name: t("Created Date"),
    //         fieldName: "CreateDate",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender: (item: { CreateDate: string | number | Date; }) => {
    //
    //             const date = new Date(item.CreateDate);
    //
    //             if (item.CreateDate === null || item.CreateDate === undefined || isNaN(date.getTime())) {
    //                 return null;
    //             }
    //
    //
    //             const dateString =  date.toISOString().slice(0, 10).replace(/-/g, "/");
    //
    //             return <span style={{userSelect:"text"}}>{dateString}</span>;
    //         }
    //     },
    //     // {key: "RfqNo", name: t("RFQ No."), fieldName: "RfqNo", minWidth: 80},
    //     {
    //         key: "ReqBuyer",
    //         name: t("Req. Buyer"),
    //         fieldName: "RequisitionBuyer",
    //         minWidth: 80,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.RequisitionBuyer}</div>
    //     },
    //     {
    //         key: "HandlerName",
    //         name: t("Handler Name"),
    //         fieldName: "HandlerName",
    //         minWidth: 100,
    //         isResizable: true,
    //         onRender:(item) =><div style={{userSelect:"text"}}>{item.HandlerName}</div>
    //     },
    //     // {key: "Status", name: t("Status"), fieldName: "Status", minWidth: 80},
    // ];
    const columns:IColumn[] = [
        {key: 'column1', name: t('Part No'), fieldName: 'PartNumber', minWidth: 100, maxWidth: 150, isResizable: true},
        {key: 'column2', name: t('Qualifier'), fieldName: 'Qualifier', minWidth: 100, maxWidth: 150, isResizable: true},
        {
            key: 'column3',
            name: t('Part Description'),
            fieldName: 'PartDescription',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        },
        {key: 'column4', name: t('Parma'), fieldName: 'Parma', minWidth: 100, maxWidth: 100, isResizable: true},
        {
            key: 'column5',
            name: t('Material User'),
            fieldName: 'MaterialUser',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {key: 'column6', name: t('Currency'), fieldName: 'Currency', minWidth: 100, maxWidth: 100, isResizable: true},
        {key: 'column7', name: t('Unit'), fieldName: 'Unit', minWidth: 100, maxWidth: 100, isResizable: true},
        {key: 'column8', name: t('UOP'), fieldName: 'UOP', minWidth: 100, maxWidth: 100, isResizable: true},
        {
            key: 'column9',
            name: t('Current Total Price'),
            fieldName: 'CurrentUnitPrice',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'column10',
            name: t('Forecast QTY'),
            fieldName: 'ForecastQuantity',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
    ];
    const [selectedContacts, setSelectedContacts] = useState<
        { name: string; email: string; title?: string; functions?: string }[]
    >([]);
    const handleSubmit = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const userdetails = state.userDetails
            console.log(selectedContacts, "con",state.selectedItems);
            // 构造 RFQ 数据
            const rfqData: IUDGSRFQFormModel = {
                RFQDueDate: selectedDate || new Date(),
                RFQStatus: "New", // 示例字段
                SupplierContact: JSON.stringify(selectedContacts.filter(Boolean)), // convert JSON
                RFQInstructionToSupplier: form.comment, // RFQ comment
                OrderType: "BLPR Blanket Production Order", // ordertype only BLPR
                //Parma: form.parma, // Parma 值
                Parma: state.selectedItems[0].Parma, // Parma 值
                BuyerInfo:(userdetails?.porg?? " ") + " " + userdetails.handlercode,
                RFQType:"Price Change",
                HandlerName:state.selectedItems[0].HandlerName,
                SupplierName:parmaDetails?.name,
                BuyerName:userdetails.userName,
                BuyerEmail:userdetails.userEmail,
                SectionInfo:state.selectedItems[0].SectionInfo + " " + state.selectedItems[0].SectionDescription,
                EffectiveDateBuyer:selectedDateEffect
            };

            console.log("RFQ Data to submit:", rfqData);

            // 提交 RFQ
            //const newRFQId = await createRFQ(rfqData);
            const newRFQId = await postRFQ(rfqData);

            // 更新每条记录
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const item of state.selectedItems) {
                if(item.RequisitionType === "RB" && form.type ==="BLPR Blanket Production Order"){
                    //updateRequisition({
                    const partobj: IUDGSNewPartFormModel = {
                        // ...item,
                        ID: item.ID,
                        //Parma: form.parma,
                        AnnualQty: Number(item.OrderQty) ?? null,
                        PartStatus: "New",
                        RFQIDRef: newRFQId,
                    }
                   await putPart(partobj);
                }else{
                    const partobj: IUDGSNewPartFormModel = {
                         //...item,
                        ID: item.ID,
                        //Parma: form.parma,
                        PartStatus: "New",
                        RFQIDRef: newRFQId,
                    }
                await putPart(partobj);
                }
            }

            // 上传附件
            if (selectedFiles.length > 0) {
                //await initialUploadRFQAttachments(selectedFiles, newRFQId);
                const fileObj:IUDGSAttachmentFormModel = {FolderName:"RFQ Attachments",SubFolderName:String(newRFQId),NewFileItems:selectedFiles}
                await postAttachments(fileObj);
                console.log("Files uploaded successfully");
            }

            // 关闭对话框并跳转
            closeRFQDialog();
            setIsLoading(false)
             //navigate("/rfq");
             navigate("/pce");
        } catch (error) {
            console.error("Error submitting RFQ:", error);
            alert("Failed to submit RFQ.");
        }
    };
    useEffect(() => {
        if(selectedDate){
            const min = getEffectiveDate(supplierinfo.IsSme,selectedDate);
            setmineffectDate(min)
        }
    }, [selectedDate, supplierinfo.IsSme]);



    console.log(selectedDate, formattedDate,formattedDateEffect);
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
                            style={{display: "none"}}
                        />
                        <Label>{t("Parma")}</Label>
                        <TextField value={state.selectedItems[0].Parma} disabled={true}/>
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
                        <div style={{
                            display: 'inline-block',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '5px',
                            marginTop: '5px'
                        }}>{t('RFQ Due Date')} <span style={{color: '#a4262c', display: "inline-block"}}>*</span></div>
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
                        styles={{root: {flexBasis: "40%", maxWidth: "50%"}}}
                    >
                        <div style={{
                            display: 'inline-block',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '5px',
                            marginTop: '5px'
                        }}>{t('Expected Effective Date')} <span
                            style={{color: '#a4262c', display: "inline-block"}}>*</span></div>
                        <DatePicker
                            // label={t("Expected Effective Date")}
                            minDate={mineffectDate}
                            value={selectedDateEffect} // 显示的日期值
                            onSelectDate={(date) => {
                                if (date) {
                                    setSelectedDateEffect(date); // 设置内部日期状态
                                    const formatted = formatDate(date); // 格式化日期
                                    setFormattedDateEffect(formatted); // 更新格式化后日期状态
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
                            disabled={!selectedDate}
                            allowTextInput


                        />

                        <Dropdown
                            //label={t("Order Type")}
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
                            style={{width: Number(itemWidth) - 30, display: 'none'}}
                            styles={{
                                title: {
                                    // borderColor: err.type ? 'red' : 'rgb(96 94 92)'
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
                <Stack horizontal wrap tokens={{childrenGap: 10}} verticalAlign="start" styles={{root: {width: '50%'}}}>
                    {/* 控制每个 Stack.Item 的宽度 */}
                    <Stack grow styles={{root: {width: '100%'}}}>
                        <SupplierSelection
                            parma={form}
                            onContactsChange={(contacts) => setSelectedContacts(contacts)}
                        />
                    </Stack>
                    <Stack.Item grow styles={{root: {flexBasis: '100%', maxWidth: '100%'}}}>
                        <TextField label={t("RFQ Instruction to Supplier")} value={form.comment} placeholder="Optional"
                                   multiline rows={3} style={{width: '100%'}} onChange={(e, val) => setForm({
                            ...form,
                            comment: val || ''
                        })}/>
                    </Stack.Item>
                </Stack>
            </Stack>
            <h3 className="mainTitle noMargin">{t("Selected Parts")}</h3>
            <div style={{
                height: `${Math.min(state.selectedItems.length * 40, 300)}px`, // 假设每项约 40px 高
                overflowY: 'auto',
                minHeight: '100px' // 设置最小高度，以保持可见性
            }}>
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
                </div>
                <Label>
                    {`Nr of Selected Parts: ${state.selectedItems.length}`}
                </Label>
                <Stack horizontal tokens={{childrenGap: 10, padding: 10}}>
                    <PrimaryButton
                        text={t("Back")}
                        onClick={() => {
                            openLeavePageDialog();
                        }}
                        styles={theme.buttonStyles}
                    />
                    <PrimaryButton
                        text={t("Submit")}
                        styles={theme.buttonStyles}
                        onClick={() => {

                            if (!state.selectedItems[0].Parma || !selectedDateEffect || !selectedDate || selectedContacts.length === 0 || !parmaDetails.country?.includes("JP")) {
                                console.log("sle", selectedContacts);
                                return setErr({
                                    //parma: !form.type,
                                    // type: !form.type,
                                    parma: !state.selectedItems[0].Parma,
                                    date: !selectedDate,
                                    effdate: !selectedDate,
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
                        title: t("Confirmation"),
                        subText:
                            t("Are you sure to send RFQ? Notification email will be sent to selected supplier contact."),
                    }}
                >
                    <DialogFooter>
                        <PrimaryButton onClick={() => {
                            closeRFQDialog()
                            handleSubmit().then(_ => _, _ => _);

                        }} text={t("Yes")}/>
                        <DefaultButton onClick={closeRFQDialog} text={t("No")}/>
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
                        <PrimaryButton onClick={() => navigate("/pce")} text="Yes"/>
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

export default CreateRFQPart2;
