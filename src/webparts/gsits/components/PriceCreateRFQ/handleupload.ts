import {getAADClient} from "../../../../pnpjsConfig";
import {AadHttpClient} from "@microsoft/sp-http";
import {CONST} from "../../../../config/const";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadExcelFile = async (file: File): Promise<any> => {
    try {
        const client = getAADClient(); // 获取身份验证客户端
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/PriceChangeRFQCreationValidationFunc`; // API 端点 URL

        // 使用 FileReader 读取文件为二进制字符串
        const reader = new FileReader();
        reader.readAsArrayBuffer(file); // 读取文件为二进制流

        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                // 创建一个 ArrayBuffer
                const arrayBuffer = reader.result as ArrayBuffer;

                // 发送 POST 请求到 API
                const response = await client.post(
                    functionUrl,
                    AadHttpClient.configurations.v1,
                    {
                        body: arrayBuffer, // 将二进制流作为请求体
                        headers: {
                            'Content-Type': 'application/octet-stream' // 设置内容类型为二进制流
                        }
                    }
                );

                // 检查响应状态
                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error("File upload failed:", errorResponse.ErrorMessage);
                    reject({ ResultStatus: "Error", ErrorMessage: errorResponse.ErrorMessage });
                }

                const result = await response.json(); // 解析响应 JSON
                console.log("File uploaded successfully:", result);
                resolve(result); // 返回结果
            };

            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                reject({ ResultStatus: "Error", ErrorMessage: "Error reading file." });
            };
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return { ResultStatus: "Error", ErrorMessage: "An error occurred during file upload." };
    }
};

export default uploadExcelFile;