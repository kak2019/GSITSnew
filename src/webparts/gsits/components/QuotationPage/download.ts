import { spfi } from "@pnp/sp";
import { getSP } from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import {IRFQGrid} from "../../../../model/rfq"
import {IRequisitionRFQGrid} from "../../../../model/requisition";
import * as Excel from 'exceljs';
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const exportToExcel = async (selectedItems: any[], Site_Relative_Links: string, currentRFQ: IRFQGrid, currentRFQRequisition: IRequisitionRFQGrid[]) => {
    // 检查是否有选中的记录
    if (!selectedItems || selectedItems.length === 0) {
        alert("No records selected for export!");
        return;
    }

    const sp = spfi(getSP());
    try {
        // 从 SharePoint 获取 Excel 模板
        const file = await sp.web.getFileByServerRelativePath(Site_Relative_Links + `/GSITSTemplate/DownloadCSVTemplate.xlsx`).getBuffer();
        const workbookTemplate = new Excel.Workbook();
        await workbookTemplate.xlsx.load(file); // 加载Excel文件
        const worksheet = workbookTemplate.getWorksheet(1);

        if (!worksheet) {
            throw new Error("Sheet1 not found in the template");
        }

        // 遍历 selectedItems，根据 key 从 currentRFQRequisition 过滤数据
        selectedItems.forEach((item, index) => {
            const key = item.ID; // 从 selectedItems 获取 key
            const matchedRecord = currentRFQRequisition.find((req) => req.ID === key); // 匹配记录
            if (matchedRecord) {
                const rowIndex = index + 2; // 从第二行开始填充数据

                // 按照需求写入特定的单元格
                worksheet.getCell('A' + rowIndex).value = matchedRecord.PartNumber || "";
                worksheet.getCell('B' + rowIndex).value = matchedRecord.Qualifier || "";
                worksheet.getCell('C' + rowIndex).value = matchedRecord.MaterialUser || "";
                worksheet.getCell('D' + rowIndex).value = matchedRecord.Porg || "";
                worksheet.getCell('E' + rowIndex).value = currentRFQ.HandlerName || ""; // Handle 存疑
                worksheet.getCell('F' + rowIndex).value = currentRFQ.BuyerName || "";
                worksheet.getCell('G' + rowIndex).value = matchedRecord.Suffix || "";
                worksheet.getCell('H' + rowIndex).value = currentRFQ.Parma || "";
                worksheet.getCell('I' + rowIndex).value = matchedRecord.OrderCoverageTime || "";
                worksheet.getCell('J' + rowIndex).value = matchedRecord.NamedPlace || "";
                worksheet.getCell('K' + rowIndex).value = matchedRecord.NamedPlace || "";
                worksheet.getCell('L' + rowIndex).value = matchedRecord.FirstLot || "";
                worksheet.getCell('M' + rowIndex).value = matchedRecord.CountryOfOrigin || "";
                worksheet.getCell('N' + rowIndex).value = matchedRecord.QuotedBasicUnitPriceTtl || "";
                worksheet.getCell('O' + rowIndex).value = matchedRecord.Currency || "";
                worksheet.getCell('P' + rowIndex).value = matchedRecord.QuotedUnitPrice || ""; // 存疑
                worksheet.getCell('Q' + rowIndex).value = matchedRecord.OrderPriceStatusCode || "";
                worksheet.getCell('R' + rowIndex).value = matchedRecord.MaterialsCostsTtl || "";
                worksheet.getCell('S' + rowIndex).value = matchedRecord.PurchasedPartsCostsTtl || "";
                worksheet.getCell('T' + rowIndex).value = matchedRecord.ProcessingCostsTtl || "";
                worksheet.getCell('U' + rowIndex).value = matchedRecord.ToolingJigDeprCostTtl || "";
                worksheet.getCell('V' + rowIndex).value = matchedRecord.AdminExpProfit || "";
                worksheet.getCell('W' + rowIndex).value = matchedRecord.PackingAndDistributionCosts || "";
                worksheet.getCell('X' + rowIndex).value = matchedRecord.Other || "";
                worksheet.getCell('Y' + rowIndex).value = matchedRecord.PaidProvPartsCost || "";
                worksheet.getCell('Z' + rowIndex).value = matchedRecord.SuppliedMtrCost || "";
                worksheet.getCell('AA' + rowIndex).value = matchedRecord.PartIssue || "";
                worksheet.getCell('AB' + rowIndex).value = matchedRecord.AnnualQty || "";
                worksheet.getCell('AC' + rowIndex).value = currentRFQ.OrderType || "";
                worksheet.getCell('AD' + rowIndex).value = matchedRecord.SurfaceTreatmentCode || "";
                worksheet.getCell('AE' + rowIndex).value = matchedRecord.DrawingNo || "";

            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workbookTemplate.xlsx.writeBuffer().then(buffer => {
            download(buffer, 'exportFile.xlsx');
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