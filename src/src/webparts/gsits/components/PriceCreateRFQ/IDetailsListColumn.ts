import {IObjectWithKey} from "@fluentui/react";


export const partsData:PartItem[] = [
    {
        ID: '1',
        partNo: '345678901234',
        qualifier: 'V',
        partDescription: 'FLY WHEEL',
        parma: 2595,
        materialUser: 2920,
        currency: 'JPY',
        unit: 'PCE',
        uop: 1,
        currentTotalPrice: 1609.99,
        forecastQTY: 800,
    },
    // 可以根据实际情况复制或修改以下的数据项
    {
        ID: '2',
        partNo: '345678901234',
        qualifier: 'V',
        partDescription: 'FLY WHEEL',
        parma: 2595,
        materialUser: 2920,
        currency: 'JPY',
        unit: 'PCE',
        uop: 1,
        currentTotalPrice: 1609.99,
        forecastQTY: 800,
    },
];


// 定义一个接口，表示零件数据的类型
export interface PartItem extends IObjectWithKey {
    ID: string,
    partNo: string,
    qualifier: string,
    partDescription: string,
    parma: number,
    materialUser: number,
    currency: string,
    unit: string,
    uop: number,
    currentTotalPrice: number,
    forecastQTY: number,
}