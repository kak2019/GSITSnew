import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    TextField,
} from "@fluentui/react";
import { IComment } from "../../../../types";
import { usePriceChange } from "../../../../hooks/usePriceChange";

interface ReturnDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: (comments: string) => void;
    RequestID: string;
    HostBuyerName: string;
}

const ReturnDialog: React.FC<ReturnDialogProps> = ({ isOpen, onDismiss, onConfirm, RequestID, HostBuyerName }) => {
    const [
        ,
        ,
        ,
        ,
        ,
        ,
        getSupplierRequest,
        ,
        ,
        updateSupplierRequest,
        ,
        ,
        ,
        ,
    ] = usePriceChange();

    const [comments, setComments] = useState("");
    const [commentHistoryValue, setCommentHistoryValue] = useState<IComment[]>([]);
    const [error, setError] = useState(false);

    const handleAddComment = async (): Promise<void> => {
        if (!comments.trim()) {
            setError(true);
            return;
        }
        setError(false);
    
        // 附加新评论
        const newComment = {
            CommentDate: new Date(),
            CommentBy: HostBuyerName,
            CommentText: comments,
            CommentType: "Common",
        };
    
        try {
            // 获取最新的 CommentHistory（防止被覆盖）
            const latestRequest = await getSupplierRequest(RequestID);
    console.log("latestRequest",latestRequest);
            const latestCommentHistory: IComment[] = latestRequest?.CommentHistory
                ? JSON.parse(latestRequest.CommentHistory)
                : [];
    
            // 累加新评论
            const updatedCommentHistory = [newComment, ...latestCommentHistory];
    
            // 更新项的评论历史和状态
            await updateSupplierRequest({
                CommentHistory: JSON.stringify(updatedCommentHistory),
                SupplierRequestStatus: "Returned",
                ID: RequestID,
            });
    
            onConfirm(comments);
            setComments("");
            setCommentHistoryValue(updatedCommentHistory); // 更新前端显示
        } catch (error) {
            console.error("Error updating comment history:", error);
        }
    };
    

    //  const requestPiceChangeData = async () => {
    //     await getSupplierRequest(RequestID);
    //   };
      
    
    //   useEffect(() => {
    //     // 首次渲染请求price change详情数据和responsible buyers数据
    //     requestPiceChangeData().then(
    //                  (_) => _,
    //                 (_) => _
    //               );
    //   }, []);

        // useEffect(() => {
        
          
        //   // 处理comment
        //   if (currentPriceChangeRequest && currentPriceChangeRequest.CommentHistory) {
        //     const comments = JSON.parse(
        //       currentPriceChangeRequest.CommentHistory
        //     ) as IComment[];
        //     setCommentHistoryValue(comments);
        //   }
        // }, [currentPriceChangeRequest]);
    useEffect(() => {
        const fetchSupplierRequest = async (): Promise<void> => {
            if (isOpen && RequestID) {
                try {
                    const response = await getSupplierRequest(RequestID);
                    if (response && response.CommentHistory) {
                        const comments = JSON.parse(response.CommentHistory) as IComment[];
                        console.log("comments",comments && commentHistoryValue)
                        setCommentHistoryValue(comments);
                    }
                } catch (error) {
                    console.error("Error fetching supplier request:", error);
                }
            }
        };

        fetchSupplierRequest().then(
            (_) => _,
            (_) => _
          );
    }, []);



    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: "Return Request",
            }}
            minWidth={800}
            maxWidth={1200}
        >
            <TextField
                label="Return Comments"
                multiline
                rows={3}
                required
                value={comments}
                onChange={(e, newValue) => setComments(newValue || "")}
                errorMessage={error ? "Please enter a comment." : ""}
            />
            <DialogFooter>
                <DefaultButton onClick={onDismiss} text="Cancel" />
                <PrimaryButton onClick={handleAddComment} text="OK" />
            </DialogFooter>
        </Dialog>
    );
};

export default ReturnDialog;
