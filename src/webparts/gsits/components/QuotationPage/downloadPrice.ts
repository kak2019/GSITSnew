import { spfi } from "@pnp/sp";
import { getSP } from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import * as Excel from 'exceljs';
import {IUDGSRFQGridModel} from "../../../../model-v2/udgs-rfq-model";
//import {IUDGSNewPartQuotationGridModel} from "../../../../model-v2/udgs-part-model";
import {
    // IUDGSNegotiationPartGridModel,
    IUDGSNegotiationPartQuotationGridModel
} from "../../../../model-v2/udgs-negotiation-model";
//import {IUDGSNewPartQuotationGridModel} from "../../../../model-v2/udgs-part-model";
const generateFileName = (rfqNo: string): string => {
    const now = new Date();
    ////
    const YYMMDDhhmm = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

    return `${rfqNo}_${YYMMDDhhmm}.xlsx`;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const exportToExcel = async ( Site_Relative_Links: string, currentRFQ: IUDGSRFQGridModel, currentRFQpartwithQuotation: IUDGSNegotiationPartQuotationGridModel[]) => {

    const sp = spfi(getSP());
    try {
        // 从 SharePoint 获取 Excel 模板
        const file = await sp.web.getFileByServerRelativePath(Site_Relative_Links + `/GSITSTemplate/PriceChangeExceltemplate.xlsx`).getBuffer();
        const workbookTemplate = new Excel.Workbook();
        await workbookTemplate.xlsx.load(file); // 加载Excel文件
        const worksheet = workbookTemplate.getWorksheet(1);

        if (!worksheet) {
            throw new Error("Sheet1 not found in the template");
        }
    console.log("currentRFQpartwithQuotation",currentRFQpartwithQuotation)
        // 遍历 selectedItems，根据 key 从 currentRFQRequisition 过滤数据
        currentRFQpartwithQuotation.forEach((item, index) => {
            //const key = item.ID; // 从 selectedItems 获取 key
            // const matchedRecord = currentRFQRequisition.find((req) => req.ID === key); // 匹配记录
            if (currentRFQpartwithQuotation) {
                const rowIndex = index + 3; // 从第二行开始填充数据

                // 按照需求写入特定的单元格
                worksheet.getCell('A' + rowIndex).value = item.RFQNo || "";
                worksheet.getCell('B' + rowIndex).value = item.Porg || "";
                worksheet.getCell('C' + rowIndex).value = item.Handler || "";
                worksheet.getCell('D' + rowIndex).value = item.BuyerName || "";
                worksheet.getCell('E' + rowIndex).value = item.Parma|| ""; // Handle 存疑
                worksheet.getCell('F' + rowIndex).value = currentRFQ.SupplierName || "";
                worksheet.getCell('G' + rowIndex).value = item.PartNumber || "";
                worksheet.getCell('H' + rowIndex).value = item.Qualifier || "";
                worksheet.getCell('I' + rowIndex).value = item.PartDescription || "";
                worksheet.getCell('J' + rowIndex).value = item.MaterialUser || "";
                worksheet.getCell('K' + rowIndex).value = item.MaterialUserName || "";
                worksheet.getCell('L' + rowIndex).value = item.ForecastQuantity || "";
                worksheet.getCell('M' + rowIndex).value = item.Currency || "";
                worksheet.getCell('N' + rowIndex).value = item.Unit || "";
                worksheet.getCell('O' + rowIndex).value = item.UOP || "";
                worksheet.getCell('P' + rowIndex).value = item.OrderPriceStatusCode|| "";
                worksheet.getCell('Q' + rowIndex).value = item.CurrentUnitPrice || "";
                worksheet.getCell('R' + rowIndex).value = item.QuotedUnitPriceTtl || "";
                worksheet.getCell('S' + rowIndex).value = item.CurrentMaterialsCostsTtl|| "";
                worksheet.getCell('T' + rowIndex).value = item.MaterialsCostsTtl  || "";
                worksheet.getCell('U' + rowIndex).value = item.CurrentPurchasedPartsCostsTtl || "";
                worksheet.getCell('V' + rowIndex).value = item.PurchasedPartsCostsTtl || "";
                worksheet.getCell('W' + rowIndex).value = item.CurrentProcessingCostsTtl || "";
                worksheet.getCell('X' + rowIndex).value = item.ProcessingCostsTtl || "";
                worksheet.getCell('Y' + rowIndex).value = item.CurrentToolingJigDeprCostTtl || "";
                worksheet.getCell('Z' + rowIndex).value = item.ToolingJigDeprCostTtl || "";
                worksheet.getCell('AA' + rowIndex).value = item.CurrentAdminExpProfit || "";
                worksheet.getCell('AB' + rowIndex).value = item.AdminExpProfit || "";
                worksheet.getCell('AC' + rowIndex).value = item.CurrentPackingAndDistributionCos || "";
                worksheet.getCell('AD' + rowIndex).value = item.PackingAndDistributionCosts || "";
                worksheet.getCell('AE' + rowIndex).value = item.CurrentOther || "";
                worksheet.getCell('AF' + rowIndex).value = item.Other || "";
                worksheet.getCell('AG' + rowIndex).value = item.CurrentPaidProvPartsCost || "";
                worksheet.getCell('AH' + rowIndex).value = item.PaidProvPartsCost || "";
                worksheet.getCell('AI' + rowIndex).value = item.CurrentSuppliedMtrCost || "";
                worksheet.getCell('AJ' + rowIndex).value = item.SuppliedMtrCost || "";

            }
        });
        // 生成文件名
        const fileName = generateFileName( String(currentRFQ?.RFQNo));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workbookTemplate.xlsx.writeBuffer().then(buffer => {
            download(buffer, fileName);
        }).catch(e => console.error(e));
    } catch (err) {
        console.error("Error reading or writing Excel file", err);
    }
};

export default exportToExcel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function download(buffer: any, filename: string) {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(href);
}