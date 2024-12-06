import * as XLSX from "xlsx";
import { spfi } from "@pnp/sp";
import { getSP } from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import {IRFQGrid} from "../../../../model/rfq"
import {IRequisitionRFQGrid} from "../../../../model/requisition";
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
        const workbook = XLSX.read(file, { type: "buffer" });

        // 获取模板中的第一个工作表
        const worksheet = workbook.Sheets.Sheet1;
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
                worksheet[`A${rowIndex}`] = { v: matchedRecord.PartNumber  || "8888" };
                worksheet[`B${rowIndex}`] = { v: matchedRecord.Qualifier || "" };
                worksheet[`C${rowIndex}`] = { v: matchedRecord.MaterialUser || "" };
                worksheet[`D${rowIndex}`] = { v: matchedRecord.Porg || "" };
                worksheet[`E${rowIndex}`] = { v: currentRFQ.HandlerName || "" }; //Handle 存疑
                worksheet[`F${rowIndex}`] = { v: currentRFQ.BuyerName || "" };
                worksheet[`G${rowIndex}`] = { v: matchedRecord.Suffix || "" };
                worksheet[`H${rowIndex}`] = { v: currentRFQ.Parma || "" };
                worksheet[`I${rowIndex}`] = { v: matchedRecord.OrderCoverageTime || "" };
                worksheet[`J${rowIndex}`] = { v: matchedRecord.NamedPlace || "" };
                worksheet[`K${rowIndex}`] = { v: matchedRecord.NamedPlace || "" };
                worksheet[`L${rowIndex}`] = { v: matchedRecord.FirstLot || "" };
                worksheet[`M${rowIndex}`] = { v: matchedRecord.CountryOfOrigin || "" };
                worksheet[`N${rowIndex}`] = { v: matchedRecord.QuotedBasicUnitPriceTtl || "" };
                worksheet[`O${rowIndex}`] = { v: matchedRecord.Currency || "" };
                worksheet[`P${rowIndex}`] = { v: matchedRecord.QuotedUnitPrice || "" }; //存疑
                worksheet[`Q${rowIndex}`] = { v: matchedRecord.OrderPriceStatusCode || "" };
                worksheet[`R${rowIndex}`] = { v: matchedRecord.MaterialsCostsTtl || "" };
                worksheet[`S${rowIndex}`] = { v: matchedRecord.PurchasedPartsCostsTtl || "" };
                worksheet[`T${rowIndex}`] = { v: matchedRecord.ProcessingCostsTtl || "" };
                worksheet[`U${rowIndex}`] = { v: matchedRecord.ToolingJigDeprCostTtl || "" };
                worksheet[`V${rowIndex}`] = { v: matchedRecord.AdminExpProfit || "" };
                worksheet[`W${rowIndex}`] = { v: matchedRecord.PackingAndDistributionCosts || "" };
                worksheet[`X${rowIndex}`] = { v: matchedRecord.Other || "" };
                worksheet[`Y${rowIndex}`] = { v: matchedRecord.PaidProvPartsCost || "" };
                worksheet[`Z${rowIndex}`] = { v: matchedRecord.SuppliedMtrCost || "" };
                worksheet[`AA${rowIndex}`] = { v: matchedRecord.PartIssue || "" };
                worksheet[`AB${rowIndex}`] = { v: matchedRecord.AnnualQty || "" };
                worksheet[`AC${rowIndex}`] = { v: currentRFQ.OrderType || "" };
                worksheet[`AD${rowIndex}`] = { v: matchedRecord.SurfaceTreatmentCode || "" };
                worksheet[`AE${rowIndex}`] = { v: matchedRecord.DrawingNo || "" };

            }
        });
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Worksheet data after writing:", jsonData);
        // 下载更新后的 Excel 文件
        XLSX.writeFile(workbook, "exportFile.xlsx");
    } catch (err) {
        console.error("Error reading or writing Excel file", err);
    }
};

export default exportToExcel;
