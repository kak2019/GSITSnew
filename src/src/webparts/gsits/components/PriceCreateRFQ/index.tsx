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
import{partsData,PartItem} from "./IDetailsListColumn";
import {useState} from "react";
import theme from "../../../../config/theme";
import exportPartAsExcel from "./exportPartAsExcel";
import AppContext from "../../../../AppContext";

const PriceCreateRFQ :React.FC =()=>{
    let Site_Relative_Links = "";
    let userEmail = "";
    let userName = "";
    let webURL = "";
    const [selectedItems, setSelectedItems] = useState<PartItem[]>([]); // 存储选中项的数据
    const selection = new Selection({
        onSelectionChanged: () => {
            const selectedItem = selection.getSelection() as PartItem[]; // 获取选中的项
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
        console.log("weburl: ",webURL);
        Site_Relative_Links = webURL.slice(webURL.indexOf("/sites"));
        console.log("Site_Relative_Links", Site_Relative_Links);
        console.log("useremail1", userEmail,userName,"userName");
    }
    const columns = [
        { key: 'column1', name: t('Part No'), fieldName: 'partNo', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column2', name: t('Qualifier'), fieldName: 'qualifier', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column3', name: t('Part Description'), fieldName: 'partDescription', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column4', name: t('Parma'), fieldName: 'parma', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column5', name: t('Material User'), fieldName: 'materialUser', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column6', name: t('Currency'), fieldName: 'currency', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column7', name: t('Unit'), fieldName: 'unit', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column8', name: t('UOP'), fieldName: 'uop', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column9', name: t('Current Total Price'), fieldName: 'currentTotalPrice', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column10', name: t('Forecast QTY'), fieldName: 'forecastQTY', minWidth: 100, maxWidth: 150, isResizable: true },
    ];

    return(
<>
        <Stack tokens={{ childrenGap: 2, }} styles={{
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
            <StepFlowFluent />
        </Stack>
        <Stack  styles={ {
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
            items={partsData}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={selection}
            selectionPreservedOnEmptyClick={true}
            styles={theme.detaillist}
        />
            <Label>
                {selectedItems.length > 0
                    ? `${selectedItems.length} Selected Part${selectedItems.length > 1 ? 's' : ''} / ${partsData.length} Total Parts`
                    : `${partsData.length} Total Parts`}
            </Label>
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
            <DefaultButton text={t('Export Selected Parts')} onClick={()=>exportPartAsExcel(selectedItems,Site_Relative_Links)}/>
        <DefaultButton text={t('Import Scope of Price Change')}/>
        </Stack>
            <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 10 }}>
                <DefaultButton text={t('Back')}/>
                <PrimaryButton styles={theme.buttonStyles} text={t('Next')}/>
            </Stack>
        </Stack>

</>
    )
}






export default PriceCreateRFQ;