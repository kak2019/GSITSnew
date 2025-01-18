import { AadHttpClient } from "@microsoft/sp-http";
import { getAADClient } from "./pnpjsConfig";
import { Logger, LogLevel } from "@pnp/logging";
import { CONST } from "./config/const";
import { MESSAGE } from "./config/message";

interface IGPSUserParams {
  userEmail?: string;
  query?: string;
}
interface IGPSUserResponse {
  name: string;
  role: string;
  sectionCode: string;
  handlercode: string;
  porg: string;
}
export const getGPSUserRequest = async ({
  userEmail,
}: IGPSUserParams): Promise<IGPSUserResponse | string> => {
  try {
    // 请确保getAADClient()已正确实现
    const client = getAADClient();
    // 使用模板字符串构建完整的函数URL
    const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser/${userEmail}`;
    const response = await client.get(
      functionUrl,
      AadHttpClient.configurations.v1
    );
    // 确保解析 response 时不抛出错误
    try {
      const result = await response.json();
      if (result && result instanceof Object) {
        return {
          name: result.name,
          role: result.role,
          sectionCode: result.sectionCode,
          handlercode: result.handlerCode,
          porg: result.porg,
        } as IGPSUserResponse;
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  } catch (error) {
    Logger.write(
      `${CONST.LOG_SOURCE} (GetGPSUser) - ${JSON.stringify(error)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
};

export const getGPSUserByQueryRequest = async ({
  query,
}: IGPSUserParams): Promise<IGPSUserResponse[] | string> => {
  try {
    // 请确保getAADClient()已正确实现
    const client = getAADClient();
    // 使用模板字符串构建完整的函数URL
    const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser?q=${query}`;
    const response = await client.get(
      functionUrl,
      AadHttpClient.configurations.v1
    );
    // 确保解析 response 时不抛出错误
    try {
      const result = await response.json();
      if (result && Array.isArray(result)) {
        return result.map(
          (item) =>
            ({
              name: item.name,
              role: item.role,
              sectionCode: item.sectionCode,
              handlercode: item.handler,
              porg: item.porg,
            } as IGPSUserResponse)
        );
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  } catch (error) {
    Logger.write(
      `${CONST.LOG_SOURCE} (getGPSUserByQuery) - ${JSON.stringify(error)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
};

interface ISupplierInfoParams {
  parma: string;
}
export interface ISupplierInfoResponse {
  parmaId?: string;
  supplierName: string;
  supplierAddress?: string;
  supplierCountry?: string;
  smallMediumCapital?: string;
  isSME: boolean;
  isJP: boolean;
}
export const getSupplierInfoRequest = async ({
  parma,
}: ISupplierInfoParams): Promise<ISupplierInfoResponse | string> => {
  try {
    // 请确保getAADClient()已正确实现
    const client = getAADClient();
    // 使用模板字符串构建完整的函数URL
    const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetSupplierInfo/${parma}`;
    const response = await client.get(
      functionUrl,
      AadHttpClient.configurations.v1
    );
    // 确保解析 response 时不抛出错误
    try {
      const result = await response.json();
      if (result && result instanceof Object) {
        return {
          parmaId: result.parmaId,
          supplierName: result.name,
          supplierAddress: result.address,
          supplierCountry: result.country,
          smallMediumCapital: result.smallMediumCapital,
          isSME: String(result.smallMediumCapital) === "true",
          isJP: String(result.country).includes("JP"),
        } as ISupplierInfoResponse;
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  } catch (error) {
    Logger.write(
      `${CONST.LOG_SOURCE} (GetSupplierInfo) - ${JSON.stringify(error)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
};

export const getParmaListRequest = async (query: string): Promise<string[]> => {
  try {
    // 请确保getAADClient()已正确实现
    const client = getAADClient();
    // 使用模板字符串构建完整的函数URL
    const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetParma?q=${query}`;
    const response = await client.get(
      functionUrl,
      AadHttpClient.configurations.v1
    );
    // 确保解析 response 时不抛出错误
    try {
      const result = await response.json();
      if (result && result instanceof Object) {
        return result;
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  } catch (error) {
    Logger.write(
      `${CONST.LOG_SOURCE} (getParmaList) - ${JSON.stringify(error)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
};
