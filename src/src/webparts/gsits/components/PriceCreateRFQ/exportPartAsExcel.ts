import { spfi } from "@pnp/sp";
import { getSP } from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import * as Excel from 'exceljs';
import {PartItem} from "./IDetailsListColumn";
// const generateFileName = (rfqNo: string): string => {
//     const now = new Date();
//     ////
//     const YYMMDDhhmm = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
//         .toString()
//         .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
//         .getHours()
//         .toString()
//         .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
//         .getSeconds()
//         .toString()
//         .padStart(2, "0")}`;
//
//     return `${rfqNo}_${YYMMDDhhmm}.xlsx`;
// };
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const exportToExcel = async (selectedItems: any[], Site_Relative_Links: string) => {
    // 检查是否有选中的记录
    if (!selectedItems || selectedItems.length === 0) {
        alert("No records selected for export!");
        return;
    }

    const sp = spfi(getSP());
    try {
        // 从 SharePoint 获取 Excel 模板
        const file = await sp.web.getFileByServerRelativePath(Site_Relative_Links + `/GSITSTemplate/PriceChangeRFQCreationTemplate.xlsx`).getBuffer();
        const workbookTemplate = new Excel.Workbook();
        await workbookTemplate.xlsx.load(file); // 加载Excel文件
        const worksheet = workbookTemplate.getWorksheet(1);

        if (!worksheet) {
            throw new Error("Sheet1 not found in the template");
        }

        // 遍历 selectedItems，根据 key 从 currentRFQRequisition 过滤数据
        selectedItems.forEach((item:PartItem, index) => {
                const rowIndex = index + 2; // 从第二行开始填充数据

                // 按照需求写入特定的单元格
                worksheet.getCell('A' + rowIndex).value = item.partNo || "";
                worksheet.getCell('B' + rowIndex).value = item.qualifier || "";
                worksheet.getCell('C' + rowIndex).value = item.partDescription || "";
                worksheet.getCell('D' + rowIndex).value = item.parma || "";
                worksheet.getCell('E' + rowIndex).value = item.materialUser || "";
                worksheet.getCell('F' + rowIndex).value = item.currency || "";
                worksheet.getCell('G' + rowIndex).value = item.unit || "";
                worksheet.getCell('H' + rowIndex).value = item.uop || "";
                worksheet.getCell('I' + rowIndex).value = item.currentTotalPrice || "";
                worksheet.getCell('J' + rowIndex).value = item.forecastQTY || "";
                worksheet.getCell('K' + rowIndex).value = item.ID || "";


        });
        // 生成文件名
       // const fileName = generateFileName( String(currentRFQ?.RFQNo));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workbookTemplate.xlsx.writeBuffer().then(buffer => {
            exportPartAsExcel(buffer, "Export File");
        }).catch(e => console.error(e));
    } catch (err) {
        console.error("Error reading or writing Excel file", err);
    }
};

export default exportToExcel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function exportPartAsExcel(buffer: any, filename: string) {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(href);
}