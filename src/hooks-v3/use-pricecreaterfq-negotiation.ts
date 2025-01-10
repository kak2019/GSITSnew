import { useEffect, useState } from "react";
import { getPartNegotiation } from "../actions/get-part-negotiations"; // 假设已经定义好的获取零件的 API
import { IUDGSNegotiationPartGridModel } from "../model-v2/udgs-negotiation-model"
import {getQuotation} from "../actions/get-quotations";

// 定义自定义 Hook
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function usePartsByNegotiationNo(NegotiationRefNo: string) {
    const [parts, setParts] = useState<IUDGSNegotiationPartGridModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 异步函数用于获取零件数据
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const fetchParts = async () => {
            setLoading(true);
            setError(null); // 每次请求前重置错误状态

            try {
                const fetchedParts = await getPartNegotiation({NegotiationRefNo:NegotiationRefNo});
                const fetchedPartIDS = fetchedParts.map((fetchedPart) => fetchedPart.ID);
                const fetcherQuotations = await getQuotation({PartIDs:fetchedPartIDS});
// 将零件与相关报价数据结合
                const partsWithQuotations = fetchedParts.map((part) => {
                    const relatedQuotation = fetcherQuotations.find(
                        (quotation) => String(quotation.PartIDRef) === String(part.ID)
                    );

                    return {
                        ...part,
                        //quotation: relatedQuotation || null, // 如果找到相关报价，则添加，否则为空
                        ...relatedQuotation,
                    };
                });
                setParts(partsWithQuotations);
            } catch (err) {
                setError("无法获取零件数据，请稍后重试。");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (NegotiationRefNo) {
            fetchParts().then(_ => _, _ => _);
        }
    }, [NegotiationRefNo]); // 当 quotationID 改变时重新获取数据

    return { parts, loading, error }; // 返回零件数据、加载状态和错误信息
}
