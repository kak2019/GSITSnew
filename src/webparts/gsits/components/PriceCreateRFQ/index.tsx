import {
    DetailsList,
    DetailsListLayoutMode,
    Stack,
    Selection,
    Label,
    DefaultButton,
    PrimaryButton
} from '@fluentui/react';
import * as React from 'react';
import {t} from "i18next";
import StepFlowFluent from "./stepComponent";
import {useRef, useState} from "react";
import theme from "../../../../config/theme";
import exportPartAsExcel from "./exportPartAsExcel";
import AppContext from "../../../../AppContext";
import {usePartsByNegotiationNo} from "../../../../hooks-v3/use-pricecreaterfq-negotiation"
import {useLocation} from "react-router-dom";
import {IUDGSQuotationGridModel} from "../../../../model-v2/udgs-quotation-model";
import handleupload from "./handleupload";
import {IUDGSNegotiationPartGridModel} from "../../../../model-v2/udgs-negotiation-model";

const PriceCreateRFQ: React.FC = () => {
    const location = useLocation();
    const state = location.state;
    const NegotiationNo = state?.selectedItems[0]?.NegotiationNo;
    const {parts} = usePartsByNegotiationNo(NegotiationNo ? NegotiationNo : "1");
    console.log(parts, "parts")
    let Site_Relative_Links = "";
    let userEmail = "";
    let userName = "";
    let webURL = "";
    const fileInputRef = useRef<HTMLInputElement | null>(null); // 引用文件输入
    const [selectedItems, setSelectedItems] = useState<IUDGSNegotiationPartGridModel[] & IUDGSQuotationGridModel[]>([]); // 存储选中项的数据
    const selection = new Selection({
        onSelectionChanged: () => {
            const selectedItem = selection.getSelection() as IUDGSNegotiationPartGridModel[] & IUDGSQuotationGridModel[]; // 获取选中的项
            setSelectedItems(selectedItem); // 更新状态
            console.log('Selected items:', selectedItems); // 输出选中项的数据到控制台
        },
    });
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
    // 导入文件处理
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0]; // 获取选择的文件
        if (file) {
            // const reader = new FileReader();
            // reader.onload = (e) => {
            //     const contents = e.target?.result;
            //     // 这里可以根据需要处理文件内容，比如解析 CSV/JSON
            //     console.log('Imported file contents:', contents);
            //
            //     // 假设这里是将文件内容解析为可更新的 `selectedItems`
            //     // 假设文件内容为 JSON 格式，你可以根据需求进行修改
            //     try {
            //         const importedData = JSON.parse(contents as string);
            //         // 更新选中项状态
            //         setSelectedItems(importedData);
            //     } catch (error) {
            //         console.error('Error parsing imported data:', error);
            //     }
            // };
            // reader.readAsText(file); // 读取文件内容
            handleupload(file).then(result => console.log(result)).catch((error) => console.log(error));
        }
    };
    return (
        <>
            <Stack tokens={{childrenGap: 2,}} styles={{
                root: {
                    width: "100%",
                    paddingTop: 0, // 去掉顶部空白
                    paddingLeft: 20, // 保留左右空白
                    paddingRight: 20,
                    paddingBottom: 0, // 保留左右空白
                    margin: "0"
                }
            }}>
                <h2 className="mainTitle">{t("Price Change RFQ Creation")}</h2>
                <StepFlowFluent/>
            </Stack>
            <Stack styles={{
                root: {
                    width: "100%",
                    paddingTop: 0, // 去掉顶部空白
                    paddingLeft: 20, // 保留左右空白
                    paddingRight: 20,
                    paddingBottom: 0, // 保留左右空白
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
                        style={{display: 'none'}} // 隐藏文件输入
                    />
                    <DefaultButton
                        text={t('Import Scope of Price Change')}
                        onClick={() => fileInputRef.current?.click()}
                    />
                </Stack>
                <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 10}}>
                    <DefaultButton text={t('Back')}/>
                    <PrimaryButton styles={theme.buttonStyles} text={t('Next')}/>
                </Stack>
            </Stack>

        </>
    )
}


export default PriceCreateRFQ;