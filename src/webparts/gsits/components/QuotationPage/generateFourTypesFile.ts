import { spfi } from "@pnp/sp";
import { getSP } from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import * as Excel from "exceljs";
import { IRFQGrid } from "../../../../model/rfq";
import { IRequisitionRFQGrid } from "../../../../model/requisition";



// 模板路径映射关系
const TEMPLATE_PATHS = {
    "BLPR Blanket Production Order": "/GSITSTemplate/BlanketOrderFileTemplate.xlsx",
    "QUPR Quantity Production Order": "/GSITSTemplate/QuantityOrderFileTemplate.xlsx",
    "SAPR Standalone Production Order": "/GSITSTemplate/StandaloneOrderFileTemplate.xlsx",
    'SAPP Standalone Prototype Order': "/GSITSTemplate/PrototypeOrderFileTemplate.xlsx",
};

const getTemplatePath = (orderType: keyof typeof TEMPLATE_PATHS, siteRelativeLinks: string): string => {
    return siteRelativeLinks + (TEMPLATE_PATHS[orderType] );
};

const generateFileName = (orderType: string, rfqNo: string): string => {
    const now = new Date();
    const YYMMDDhhmmss = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}${now.getMilliseconds().toString().padStart(2, "0")}`;

    return `${orderType}_${rfqNo}_${YYMMDDhhmmss}.xlsx`;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const exportToExcelWithTemplate = async (selectedItems: any[], Site_Relative_Links: string, currentRFQ: IRFQGrid, currentRFQRequisition: IRequisitionRFQGrid[]) => {
    if (!selectedItems || selectedItems.length === 0) {
        alert("No records selected for export!");
        return;
    }

    const sp = spfi(getSP());
    try {
        // 从 SharePoint 获取新的模板文件
        const orderType = currentRFQ.OrderType as keyof typeof TEMPLATE_PATHS;
        const templatePath = getTemplatePath(orderType, Site_Relative_Links);
        console.log(`使用的模板路径: ${templatePath}`);
        const file = await sp.web
            .getFileByServerRelativePath(templatePath)
            .getBuffer();

        const workbookTemplate = new Excel.Workbook();
        await workbookTemplate.xlsx.load(file);
        //const worksheet = workbookTemplate.getWorksheet(1);
        const worksheet = workbookTemplate.getWorksheet("Sheet1");

        if (!worksheet) {
            throw new Error("No worksheet found in the template file.");
        }

        // 动态读取列名
        const columnHeaders = worksheet.getRow(1).values as string[];
        console.log("Column Headers: ", columnHeaders);
        // 移除 undefined（getRow().values 第一列为索引）
        const columns = columnHeaders.slice(1).filter((header) => header !== undefined);
        console.log("Columns: ", columns);
        // 遍历 selectedItems 填充数据
        selectedItems.forEach((item, index) => {
            const key = item.ID; // 通过 ID 匹配记录
            const matchedRecord = currentRFQRequisition.find((req) => req.ID === key);
            if (matchedRecord) {
                const rowIndex = index + 2; // 数据从第二行开始写入

                columns.forEach((columnName, colIndex) => {
                    const excelColIndex = colIndex + 1; // 确保列索引从 1 开始
                    // 根据列名填充数据
                    let cellValue: string | number | undefined = "";

                    switch (columnName) {
                        case "Part Id":
                            cellValue = matchedRecord.PartNumber || "";
                            break;
                        case "Part Qualifier":
                            cellValue = matchedRecord.Qualifier || "";
                            break;
                        case "Material User Id":
                            cellValue = matchedRecord.MaterialUser || "";
                            break;
                        case "Purchasing Org Id":
                            cellValue = matchedRecord.Porg || "";
                            break;
                        case "Handler Id":
                            cellValue = matchedRecord.Handler || "";
                            break;
                        case "Supplier Code":
                            cellValue = "V";
                            break;
                        case "Supplier Id":
                            cellValue = currentRFQ.Parma || "";
                            break;
                        case "Order Price":
                            cellValue = matchedRecord.QuotedBasicUnitPriceTtl || "";
                            break;
                        case "Currency Code":
                            cellValue = matchedRecord.Currency || "";
                            break;
                        case "Unit Of Price Code":
                            cellValue = matchedRecord.UOP || "";
                            break;
                        case "Order Price Status Code":
                            cellValue = matchedRecord.OrderPriceStatusCode || "";
                            break;
                        case "Order Coverage Time":
                            cellValue = matchedRecord.OrderCoverageTime || "";
                            break;
                        case "Named Place":
                            cellValue = matchedRecord.NamedPlace || "";
                            break;
                        case "Named Place code":
                            cellValue =  "V";
                            break;
                        case "Named place description":
                            cellValue = matchedRecord.NamedPlaceDescription || "";
                            break;
                        case "Order number":
                            cellValue = matchedRecord.OrderNumber || "";
                            break;
                        case "suffix":
                            cellValue = matchedRecord.Suffix || "";
                            break;
                        case "Consignee":
                            cellValue = "";
                            break;
                        case "Consignee Code":
                            cellValue = "";
                            break;
                        case "First Lot":
                            cellValue = matchedRecord.FirstLot || "";
                            break;
                        case "Country of Origin":
                            cellValue = matchedRecord.CountryOfOrigin || "";
                            break;
                        case "Packaging Code":
                            cellValue =  "";
                            break;
                        case "Commercial packaging code":
                            cellValue = "";
                            break;
                        case "Ship From Address Id":
                            cellValue = "";
                            break;
                        case "Ship From Address Code":
                            cellValue = "";
                            break;
                        case "Sales Parma Id":
                            cellValue = "";
                            break;
                        case "Sales Parma Code":
                            cellValue = "";
                            break;
                        case "Supplier part number":
                            cellValue =matchedRecord.PartNumber || "";
                            break;
                        case "Production":
                            cellValue = "";
                            break;
                        case "Aftermarket":
                            cellValue = "";
                            break;
                        case "Tooling":
                            cellValue = "";
                            break;
                        case "Order Part Issue":
                            cellValue =matchedRecord.PartIssue || "";
                            break;
                        case "Annual quantity":
                            cellValue = matchedRecord.AnnualQty || "";
                            break;
                        case "Surface Treatment Code":
                            cellValue = matchedRecord.SurfaceTreatmentCode || "";
                            break;
                        case "Drawing Doc Select Code":
                            cellValue = "y";
                            break;
                        case "Is Tech Regulation Doc Reqd":
                            cellValue = "y";
                            break;
                        case "Is Part Version Report Reqd":
                            cellValue = "y";
                            break;
                        case "Standard Text Per order 1":
                            cellValue =matchedRecord.StandardOrderText1|| "";
                            break;
                        case "Standard Text Per order 2":
                            cellValue =matchedRecord.StandardOrderText2|| "";
                            break;
                        case "Standard Text Per order 3":
                            cellValue =matchedRecord.StandardOrderText3|| "";
                            break;
                        case "Free text Per Part":
                            cellValue =matchedRecord.FreePartText|| "";
                            break;
                        case "Amount 1":
                            cellValue =matchedRecord.MaterialsCostsTtl|| "";
                            break;
                        case "Price Breakdown 1":
                            cellValue = "MTRL";
                            break;
                        case "Included 1/Additional 1":
                            cellValue = "I";
                            break;
                        case "Amount 2":
                            cellValue = matchedRecord.PurchasedPartsCostsTtl||"";
                            break;
                        case "Price Breakdown 2":
                            cellValue = "PSPC";
                            break;
                        case "Included 2/Additional 2":
                            cellValue = "I";
                            break;
                        case "Amount 3":
                            cellValue = matchedRecord.ProcessingCostsTtl||"";
                            break;
                        case "Price Breakdown 3":
                            cellValue = "PRCF";
                            break;
                        case "Included 3/Additional 3":
                            cellValue = "I";
                            break;
                        case "Amount 4":
                            cellValue = matchedRecord.ToolingJigDeprCostTtl||"";
                            break;
                        case "Price Breakdown 4":
                            cellValue = "TOCS";
                            break;
                        case "Included 4/Additional 4":
                            cellValue = "I";
                            break;
                        case "Amount 5":
                            cellValue = matchedRecord.AdminExpProfit||"";
                            break;
                        case "Price Breakdown 5":
                            cellValue = "MGPC";
                            break;
                        case "Included 5/Additional 5":
                            cellValue = "I";
                            break;
                        case "Amount 6":
                            cellValue = matchedRecord.PackingAndDistributionCosts||"";
                            break;
                        case "Price Breakdown 6":
                            cellValue = "PACK";
                            break;
                        case "Included 6/Additional 6":
                            cellValue = "I";
                            break;
                        case "Amount 7":
                            cellValue = matchedRecord.Other||"";
                            break;
                        case "Price Breakdown 7":
                            cellValue = "MISC";
                            break;
                        case "Included 7/Additional 7":
                            cellValue = "I";
                            break;
                        case "Amount 8":
                            cellValue = matchedRecord.PaidProvPartsCost||"";
                            break;
                        case "Price Breakdown 8":
                            cellValue = "SPPC";
                            break;
                        case "Included 8/Additional 8":
                            cellValue = "A";
                            break;
                        case "Amount 10":
                            cellValue = "";
                            break;
                        case "Price Breakdown 10":
                            cellValue = "";
                            break;
                        case "Included 10/Additional 10":
                            cellValue = "";
                            break;
                        case "Amount 9":
                            cellValue = matchedRecord.SuppliedMtrCost||"";
                            break;
                        case "Price Breakdown 9":
                            cellValue = "SPMC";
                            break;
                        case "Included 9/Additional 9":
                            cellValue = "A";
                            break;

                        case "Order Quantity":
                            cellValue = matchedRecord.OrderQty || "";
                            break;
                        case "Ship To Arrive Week":
                            cellValue = matchedRecord.FirstLot || "";
                            break;
                        case "Supplier Contact Id":
                            cellValue =  "";
                            break;
                        case "Delivery Named Point":
                            cellValue =  "";
                            break;
                        case "Surcharge For Text":
                            cellValue =  "";
                            break;
                        case "Surcharge Amount":
                            cellValue =  "";
                            break;

                        default:
                            cellValue = ""; // 默认值为空
                    }

                    worksheet.getRow(rowIndex).getCell(excelColIndex).value = cellValue;
                });
            }
        });
        // 生成文件名
        const fileName = generateFileName(orderType, String(currentRFQ?.RFQNo));

        // 下载生成的文件
        workbookTemplate.xlsx
            .writeBuffer()
            .then((buffer) => {
                download(buffer, fileName);
            })
            .catch((e) => console.error(e));
    } catch (err) {
        console.error("Error reading or writing Excel file", err);
    }
};

export default exportToExcelWithTemplate;

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
function download(buffer: any, filename: string) {
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(href);
}
