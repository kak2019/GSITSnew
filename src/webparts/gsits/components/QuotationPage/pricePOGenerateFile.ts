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
const generateFileName = (eNeogotationNo: string): string => {
    // const now = new Date();
    // ////
    // const YYMMDDhhmm = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
    //     .toString()
    //     .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
    //     .getHours()
    //     .toString()
    //     .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    //     .getSeconds()
    //     .toString()
    //     .padStart(2, "0")}`;

    return `${eNeogotationNo}_Instr.xlsx`;
};

const formatDate = (input: string): string => {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
};
// 上传文件到 SharePoint 的函数
const uploadFileToSharePoint = async (
    libraryUrl: string,
    fileName: string,
    buffer: ArrayBuffer | Blob,
    overwrite: boolean = true
): Promise<void> => {
    const sp = spfi(getSP());
    try {
        const folder = sp.web.getFolderByServerRelativePath(libraryUrl);
        await folder.files.addUsingPath(fileName, buffer, { Overwrite: overwrite });
        console.log(`File uploaded successfully! File URL: ${libraryUrl}/${fileName}`);
    } catch (err) {
        console.error("Error uploading file to SharePoint:", err);
        throw new Error("File upload failed. Please try again.");
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const exportToExcel = async ( Site_Relative_Links: string, currentRFQ: IUDGSRFQGridModel, currentRFQpartwithQuotation: IUDGSNegotiationPartQuotationGridModel[]) => {

    const sp = spfi(getSP());
    try {
        // get Excel Template
        const file = await sp.web.getFileByServerRelativePath(Site_Relative_Links + `/GSITSTemplate/PoENegotitationTemplate.xlsx`).getBuffer();
        const workbookTemplate = new Excel.Workbook();
        await workbookTemplate.xlsx.load(file); // load Excel file
        const worksheet = workbookTemplate.getWorksheet(1);

        if (!worksheet) {
            throw new Error("Sheet1 not found in the template");
        }
        console.log("currentRFQpartwithQuotation",currentRFQpartwithQuotation)
        // loop selectedItems，according key filter currentRFQRequisition


        worksheet.getCell('A' + 2).value = currentRFQpartwithQuotation[0].Porg || "";
        worksheet.getCell('B' + 2).value = currentRFQpartwithQuotation[0].Handler || "";
        worksheet.getCell('C' + 2).value = currentRFQpartwithQuotation[0].Parma || "";
        worksheet.getCell('D' + 2).value = currentRFQpartwithQuotation[0].ReasonCode || "";
        worksheet.getCell('E' + 2).value = currentRFQ.EffectiveDateSupplier?formatDate(currentRFQ.EffectiveDateSupplier.toString()): ""
        worksheet.getCell('F' + 2).value = currentRFQ.RFQNo|| ""
        worksheet.getCell('G' + 2).value = currentRFQpartwithQuotation[0].NegotiationRefNo || "";
        worksheet.getCell('H' + 2).value = currentRFQpartwithQuotation[0].CSDBTagNumber || "";
        // currentRFQpartwithQuotation.forEach((item, index) => {
        //     if (currentRFQpartwithQuotation) {
        //         const rowIndex = index + 2;
        //
        //         // 按照需求写入特定的单元格
        //         worksheet.getCell('A' + rowIndex).value = item.Porg || "";
        //         worksheet.getCell('B' + rowIndex).value = item.Handler || "";
        //         worksheet.getCell('C' + rowIndex).value = item.Parma || "";
        //         worksheet.getCell('D' + rowIndex).value = item.ReasonCode || "";
        //         worksheet.getCell('E' + rowIndex).value = currentRFQ.EffectiveDateSupplier|| "";
        //         worksheet.getCell('F' + rowIndex).value = currentRFQ.RFQNo || "";
        //         worksheet.getCell('G' + rowIndex).value = item.NegotiationRefNo || "";
        //         worksheet.getCell('H' + rowIndex).value = item.CSDBTagNumber || "";
        //         // worksheet.getCell('I' + rowIndex).value = item.PartDescription || "";
        //         // worksheet.getCell('J' + rowIndex).value = item.MaterialUser || "";
        //         // worksheet.getCell('K' + rowIndex).value = item.MaterialUserName || "";
        //         // worksheet.getCell('L' + rowIndex).value = item.ForecastQuantity || "";
        //         // worksheet.getCell('M' + rowIndex).value = item.Currency || "";
        //         // worksheet.getCell('N' + rowIndex).value = item.Unit || "";
        //         // worksheet.getCell('O' + rowIndex).value = item.UOP || "";
        //         // worksheet.getCell('P' + rowIndex).value = item.OrderPriceStatusCode|| "";
        //         // worksheet.getCell('Q' + rowIndex).value = item.CurrentUnitPrice || "";
        //         // worksheet.getCell('R' + rowIndex).value = item.QuotedUnitPriceTtl || "";
        //         // worksheet.getCell('S' + rowIndex).value = item.CurrentMaterialsCostsTtl|| "";
        //         // worksheet.getCell('T' + rowIndex).value = item.MaterialsCostsTtl  || "";
        //         // worksheet.getCell('U' + rowIndex).value = item.CurrentPurchasedPartsCostsTtl || "";
        //         // worksheet.getCell('V' + rowIndex).value = item.PurchasedPartsCostsTtl || "";
        //         // worksheet.getCell('W' + rowIndex).value = item.CurrentProcessingCostsTtl || "";
        //         // worksheet.getCell('X' + rowIndex).value = item.ProcessingCostsTtl || "";
        //         // worksheet.getCell('Y' + rowIndex).value = item.CurrentToolingJigDeprCostTtl || "";
        //         // worksheet.getCell('Z' + rowIndex).value = item.ToolingJigDeprCostTtl || "";
        //         // worksheet.getCell('AA' + rowIndex).value = item.CurrentAdminExpProfit || "";
        //         // worksheet.getCell('AB' + rowIndex).value = item.AdminExpProfit || "";
        //         // worksheet.getCell('AC' + rowIndex).value = item.CurrentPackingAndDistributionCos || "";
        //         // worksheet.getCell('AD' + rowIndex).value = item.PackingAndDistributionCosts || "";
        //         // worksheet.getCell('AE' + rowIndex).value = item.CurrentOther || "";
        //         // worksheet.getCell('AF' + rowIndex).value = item.Other || "";
        //         // worksheet.getCell('AG' + rowIndex).value = item.CurrentPaidProvPartsCost || "";
        //         // worksheet.getCell('AH' + rowIndex).value = item.PaidProvPartsCost || "";
        //         // worksheet.getCell('AI' + rowIndex).value = item.CurrentSuppliedMtrCost || "";
        //         // worksheet.getCell('AJ' + rowIndex).value = item.SuppliedMtrCost || "";
        //
        //     }
        // });
        // 生成文件名
        const fileName = generateFileName( String(currentRFQpartwithQuotation[0].NegotiationRefNo));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workbookTemplate.xlsx.writeBuffer().then(async buffer => {
            //download(buffer, fileName);
            await uploadFileToSharePoint(Site_Relative_Links + "/OUTCOME/e-Nego Upload", fileName, buffer);
        }).catch(e => console.error(e));
    } catch (err) {
        console.error("Error reading or writing Excel file", err);
    }
};

export default exportToExcel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
// function download(buffer: any, filename: string) {
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const href = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = href;
//     link.download = filename;
//     link.click();
//     URL.revokeObjectURL(href);
// }

