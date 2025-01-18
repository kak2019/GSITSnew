import { spfi } from "@pnp/sp";
import { getSP} from "../../../../pnpjsConfig";
import "@pnp/sp/webs";
import {IUDGSNegotiationPartQuotationGridModel} from "../../../../model-v2/udgs-negotiation-model";
import {CONST} from "../../../../config/const";
import "@pnp/sp/webs";

import {AppInsightsService} from "../../../../config/AppInsightsService";
import {MESSAGE} from "../../../../config/message";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function updateListItems(items: IUDGSNegotiationPartQuotationGridModel[]) {
    try {
        const sp = spfi(getSP());
        const [batchedSP, execute] = sp.batched();
        const web = await sp.web(); // 获取当前网站
        const list = batchedSP.web.getList(`${web.ServerRelativeUrl}/Lists/${CONST.LIST_NAME_PART}`); // 获取目标列表

        const res: IUDGSNegotiationPartQuotationGridModel[] = []; // 成功响应集合
        const errors: Error[] = []; // 错误集合

        // 遍历每个项并添加到批处理上下文
        items.forEach(item => {
            list.items.getById(item.ID).update({
                PartStatus: "Sent to GPS" // 这里是要更新的字段
            })
                .then(r => res.push(r)) // 将成功的结果推入res
                .catch(e => errors.push(e)); // 将错误推入errors
        });

        await execute(); // 执行批处理请求



        // 处理错误
        if (errors.length) console.error(errors);

        ///return MESSAGE.isRegisteredSuccess; // 返回成功消息
    } catch (error) {
        // 记录错误
        items.forEach((item) => {
            AppInsightsService.aiInstance.trackEvent({
                name: 'useEventStore - updateListItems',
                properties: { error: ' HY-Error:{ "ID":"' + item.ID + '", "PartStatus":"Sent to GPS", "message":"' + error.message + '"}' },
            });
        });
        throw new Error(MESSAGE.updateDataFailed); // 返回错误消息
    }
}

