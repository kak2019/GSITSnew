import {
    DetailsList,
    DetailsListLayoutMode,
    Stack,
    Selection,
    Label,
    DefaultButton,
    PrimaryButton,
    Dialog, DialogType, DialogFooter,
} from '@fluentui/react';
import * as React from 'react';
//import {t} from "i18next";
import StepFlowFluent from "./stepComponent";
import {useEffect, useRef, useState} from "react";
import theme from "../../../../config/theme";
import exportPartAsExcel from "./exportPartAsExcel";
import AppContext from "../../../../AppContext";
import {usePartsByNegotiationNo} from "../../../../hooks-v3/use-pricecreaterfq-negotiation"
import {useLocation, useNavigate} from "react-router-dom";
import {IUDGSQuotationGridModel} from "../../../../model-v2/udgs-quotation-model";
import handleupload from "./handleupload";
import {IUDGSNegotiationPartGridModel} from "../../../../model-v2/udgs-negotiation-model";
import {getAADClient} from "../../../../pnpjsConfig";
import {CONST} from "../../../../config/const";
import {AadHttpClient} from "@microsoft/sp-http";
import {useTranslation} from "react-i18next";
// import exceljs from 'exceljs'

const PriceCreateRFQ: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log("State", state);
    //const NegotiationNo = state?.selectedItems[0]?.NegotiationNo;
    const NegotiationNo = state?.NegotiationNo;
    const {parts} = usePartsByNegotiationNo(NegotiationNo ? NegotiationNo : "1");
    console.log(parts, "parts")
    let Site_Relative_Links = "";
    let userEmail = "";
    let userName = "";
    let webURL = "";
    const fileInputRef = useRef<HTMLInputElement | null>(null); // 引用文件输入
    const [selectedItems, setSelectedItems] = useState<IUDGSNegotiationPartGridModel[] & IUDGSQuotationGridModel[]>([]); // 存储选中项的数据
    const [selection] = useState(new Selection({
        onSelectionChanged: () => {
            const selectedItem = selection.getSelection() as IUDGSNegotiationPartGridModel[] & IUDGSQuotationGridModel[]; // 获取选中的项
// 过滤选项，只有当 item.RfqRefID 没有值时才加入选中项
           // const validSelectedItems = selectedItems.filter(item => !item.RFQIDRef) as IUDGSNegotiationPartGridModel[] & IUDGSQuotationGridModel[]; // 检查 RfqRefID
            setSelectedItems(selectedItem); // 更新状态
            //setSelectedItems(validSelectedItems); // 更新状态
            console.log('Selected items:', selectedItems); // 输出选中项的数据到控制台
        },
    }))

    const [isDialogVisible, setDialogVisibility] = React.useState(false);
    const [showTip, setShowTip] = React.useState(false)
    const [userDetails, setUserDetails] = useState({
        role: "",
        name: "",
        sectionCode: "",
        handlercode: "",
        porg: "",
        userName: "",
        userEmail: ""
    });
    const handleCancelDialog = () :void=> {
        setDialogVisibility(false);
    };

    const handleConfirmDialog = ():void => {
        // 在这里添加继续上传的逻辑
        setDialogVisibility(true);
    };

    const ctx = React.useContext(AppContext);
    if (!ctx || !ctx.context) {
        throw new Error("AppContext is not provided or context is undefined");
    } else {
        userEmail = ctx.context._pageContext._user.email;
        userName = ctx.context._pageContext._user?.displayName;
        webURL = ctx.context?._pageContext?._web?.absoluteUrl;
        console.log("weburl: ", webURL);
        Site_Relative_Links = webURL.slice(webURL.indexOf("/sites"));
        console.log("Site_Relative_Links", Site_Relative_Links);
        console.log("useremail1", userEmail, userName, "userName");
    }
    const columns = [
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

    // const readExcel = (file:any) => {
    //     return new Promise(async(resolve,reject)=>{
    //       try{
    //         //
    //         const workbook = new exceljs.Workbook();
    //         //await workbook.xlsx.readFile(filename);从文件读取
    //         //await workbook.xlsx.read(stream);从流读取
    //         //await workbook.xlsx.load(data);从 buffer 加载
    //         const result = await workbook.xlsx.load(file);
    //         // 按 name 提取工作表 workbook.getWorksheet('My Sheet');
    //         // 按 id 提取工作表 workbook.getWorksheet(1);
    //         const worksheet:any = result.getWorksheet();
    //         let keys:any = []
    //         const json:any = []
    //         // const lines = []
    //         //遍历工作表中具有值的所有行
    //         worksheet.eachRow(function(row:any, i: any) {
    //             const [...line] = row.values.slice(1)
    //             if(i == 1) {
    //                 keys = line
    //             } else {
    //                 let obj:any = {}
    //                 line.forEach((val:any, index:any) => {
    //                     obj[keys[index]] = val
    //                 })
    //                 json.push(obj)
    //             }
    //         });
    //         resolve(json)
    //       }catch(e){
    //         reject(e)
    //       }
    //     })
    //   };
    // 导入文件处理
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0]; // 获取选择的文件
        if (file) {
            handleupload(file).then(result => {
                if(result.ResultStatus === "Success") {
                    const items = selection.getItems()
                    const res = result.ResponseData
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items.forEach((val:any,i:any) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const bool = res.some((r:any) => String(r.Parma) === String(val.Parma) && String(r.PartNo) === String(val.PartNumber) && String(r.Description) === String(val.PartDescription) && String(r.Qualifier) === String(val.Qualifier))
                        selection.setIndexSelected(i, bool, false)
                    })
                } else {
                    setShowTip(false)
                }
                event.target.value = ''
            }).catch((error) => console.log(error));
        }
    };
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
                   // code.current = result.handlercode
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

    // 跳转到 Create RFQ 页面，并传递选中的记录
    const handleCreateRFQ = (): void => {
        navigate("/pce/create-price-rfqPart2", {state: {selectedItems, userDetails,type:"Price"}});
    };
    return (
        <>
            <Stack tokens={{childrenGap: 2,}} styles={{
                root: {
                    width: "100%",
                    paddingTop: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 0,
                    margin: "0"
                }
            }}>
                <h2 className="mainTitle">{t("Price Change RFQ Creation")}</h2>
                <StepFlowFluent/>
            </Stack>
            <Stack styles={{
                root: {
                    width: "100%",
                    paddingTop: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 0,
                    margin: "0"
                }
            }}>
                <Label>{t('Please select all of the necessary parts which are applicable for the price change:')}</Label>
                <DetailsList
                    // items={partsData}
                    items={parts}
                    columns={columns}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selection={selection}
                    selectionPreservedOnEmptyClick={true}
                    styles={theme.detaillist}
                />
                <Label>
                    {selectedItems.length > 0
                        ? `${selectedItems.length} Selected Part${selectedItems.length > 1 ? 's' : ''} / ${parts.length} Total Parts`
                        : `${parts.length} Total Parts`}
                </Label>
                <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 10}}>
                    <DefaultButton text={t('Export Selected Parts')}
                                   onClick={() => exportPartAsExcel(selectedItems, Site_Relative_Links)}/>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleImport}
                        ref={fileInputRef}
                        style={{display: 'none'}}
                    />
                    <DefaultButton
                        text={t('Import Scope of Price Change')}
                        onClick={() => handleConfirmDialog( )}
                    />
                </Stack>
                <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 10}}>
                    <DefaultButton text={t('Back')} onClick={()=>navigate("/pce")}/>
                    <PrimaryButton styles={theme.buttonStyles} text={t('Next')} onClick={()=>handleCreateRFQ()}/>
                </Stack>
            </Stack>

            <Dialog
                hidden={!isDialogVisible}
                onDismiss={handleCancelDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Upload Confirmation',
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { maxWidth: '500px' } },
                }}
            >
                <p>By proceeding with the upload, any previously selected parts will be deselected. Are you sure you want to proceed?</p>
                <DialogFooter>
                    <PrimaryButton text={t("Continue")} onClick={() => {
                        setDialogVisibility(false)
                        selection.setAllSelected(false)
                        setSelectedItems([])
                        fileInputRef.current?.click()
                    }} />
                    <DefaultButton text="Cancel" onClick={handleCancelDialog} />
                </DialogFooter>
            </Dialog>


            <Dialog
                hidden={!showTip}
                onDismiss={() => setShowTip(false)}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'File Validation Result',
                }}
                modalProps={{
                    isBlocking: true,
                }}
            >
                <p>Document validation failed</p>
                <DialogFooter>
                    <PrimaryButton text="OK" onClick={() => setShowTip(false)} />
                </DialogFooter>
            </Dialog>
        </>
    )
}


export default PriceCreateRFQ;