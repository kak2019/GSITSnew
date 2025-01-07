import React, { useState } from "react";
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    TextField,
    DatePicker,
    Stack,
    Text,
    Label,
    IconButton,
} from "@fluentui/react";
import styles from "./index.module.scss";
import { usePriceChange } from "../../../../hooks/usePriceChange";
import { ISupplierRequestFormModel } from "../../../../model/priceChange";
import { IUDGSAttachmentFormModel } from "../../../../model-v2/udgs-attachment-model";
import { useUDGSAttachment } from "../../../../hooks-v2/use-udgs-attachment";
//import { fromPairs } from "@microsoft/sp-lodash-subset";

// 定义 Props 接口
interface CreatePriceChangeRequestProps {
    isOpen: boolean;
    onDismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onConfirm: (formData: any) => void;
    parmaID: string
}

const CreatePriceChangeRequest: React.FC<CreatePriceChangeRequestProps> = ({
    isOpen,
    onDismiss,
    onConfirm,
    parmaID
}) => {
    // 表单数据状态
    const [formData, setFormData] = useState({
        parmaID: parmaID,
        hostBuyerName: "First Name Last Name",
        expectedEffectiveDate: undefined,
        supplierEmail: "",
        detailedDescription: "",
        attachedFiles: [] as File[],
    });
    //const [, , , , , , , createSupplierRequest, , ,] = usePriceChange();
    const [, , , , , , , , createSupplierRequest, , ,] = usePriceChange()
    const [, , , , postAttachments] = useUDGSAttachment()
    // 处理表单输入变化
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: string, value: any): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        setFormData((prev) => {
            const validFiles = newFiles.filter((file) => file.size <= 10 * 1024 * 1024); // 过滤文件大小超过10MB的文件
            // 计算现有文件和新文件的总数
            const totalFiles = prev.attachedFiles.length + newFiles.length;
            if (newFiles.length !== validFiles.length) {
                alert(`Some files exceed the 10MB size limit and cannot be uploaded: ${newFiles.map(f => f.name).join(', ')}`);
                return prev; // 如果超出限制，不更新
            }

            if (totalFiles > 10) {
                alert("You can only upload up to 10 files.");
                return prev; // 如果超出限制，不更新
            }
            return {
                ...prev,
                attachedFiles: [...prev.attachedFiles, ...newFiles], // 累加文件
            };
        });
    };

    // 删除文件
    const handleRemoveFile = (index: number): void => {
        setFormData((prev) => ({
            ...prev,
            attachedFiles: prev.attachedFiles.filter((_, i) => i !== index),

        }));
    };
    const validateEmail = (value: string): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 简单的邮箱验证正则
        if (!value) {
            return "Supplier Contact (Email) is required."; // 如果为空，返回错误信息
        }
        if (!emailRegex.test(value)) {
            return "Please enter a valid email address."; // 如果格式不正确，返回错误信息
        }
        return undefined; // 如果没有错误，返回 undefined
    };
    const validateDetailedDescription = (value: string): string | undefined => {
        if (!value || value.trim() === "") {
            return "Detailed Description is required."; // 如果为空，返回错误信息
        }
        return undefined; // 验证通过
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份需要加 1，且补齐两位
        const day = String(date.getDate()).padStart(2, "0"); // 补齐两位
        return `${year}/${month}/${day}`;
    };


    // const [dateError, setDateError] = useState(false); // 是否显示日期错误提示
    // const [hasInteracted, setHasInteracted] = useState(false); // 是否与日期选择器交互过
    const generateRequestNo = (): string => {
        const now = new Date();
        const year = now.getFullYear(); // 年份
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份，补零
        const day = String(now.getDate()).padStart(2, "0"); // 日期，补零
        const hours = String(now.getHours()).padStart(2, "0"); // 小时，补零
        const minutes = String(now.getMinutes()).padStart(2, "0"); // 分钟，补零
        const seconds = String(now.getSeconds()).padStart(2, "0"); // 秒钟，补零
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0"); // 毫秒，补零

        return `${formData.parmaID}${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`; // 拼接 RequestNo
    };

    // const [loading, setLoading] = useState(false);
    const [isResultDialogOpen, setIsResultDialogOpen] = useState(false); // 第二个弹窗状态
    const [resultMessage, setResultMessage] = useState(""); // 成功或失败的消息

    const handleSubmit = async (): Promise<void> => {
        //const requestNo = generateRequestNo();
        //const formDataWithRequestNo = { ...formData, requestNo }; // 将 RequestNo 添加到表单数据
        const errors: string[] = [];

        const dateError = !formData.expectedEffectiveDate ? "Expected Effective Date is required." : undefined;
        if (dateError) errors.push(dateError);
        const emailError = validateEmail(formData.supplierEmail);
        if (emailError) errors.push(emailError);

        const descriptionError = validateDetailedDescription(formData.detailedDescription);
        if (descriptionError) errors.push(descriptionError);

        
        // 如果有错误，更新错误信息并阻止提交
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }
        // 清空错误信息
        setValidationErrors([]);
        const submitform: ISupplierRequestFormModel = {
            Parma: formData.parmaID,
            HostBuyerName: formData.hostBuyerName,
            ExpectedEffectiveDateFrom: formData.expectedEffectiveDate,
            SupplierContact: formData.supplierEmail,
            DetailedDescription: formData.detailedDescription,
            SupplierRequestStatus: "New",
            RequestID: generateRequestNo(),
        }
        try {
            //const result = 
            const newsupplierrequestID = await createSupplierRequest(submitform);
            //alert("Request submitted successfully. Request ID: " + result);
            setResultMessage(`Request created successfully! RequestID: ${submitform.RequestID}`); // 成功消息
            const fileObj: IUDGSAttachmentFormModel = { FolderName: "Supplier Request Attachments", SubFolderName: String(newsupplierrequestID), NewFileItems: formData.attachedFiles }
            await postAttachments(fileObj);
            console.log("Files uploaded successfully");
            setIsResultDialogOpen(true); // 打开结果弹窗
            //setLoading(false);
            onConfirm(submitform);

            // 清空表单数据
            setFormData({
                parmaID: parmaID,
                hostBuyerName: "First Name Last Name",
                expectedEffectiveDate: undefined,
                supplierEmail: "",
                detailedDescription: "",
                attachedFiles: [],
            });

        }


        catch (error) {
            setResultMessage("Failed to create request. Please try again."); // 失败消息
            console.error("createSupplierreuqestError: ", error);
            setIsResultDialogOpen(true); // 打开结果弹窗
            // setLoading(false);
            //alert("Failed to submit RFQ.");
        }
    }

    React.useEffect(() => {
        setFormData((prev) => ({ ...prev, parmaID }));
    }, [parmaID]);
    const handleDismiss = (): void => {
        setFormData({
            parmaID: parmaID,
            hostBuyerName: "First Name Last Name",
            expectedEffectiveDate: undefined,
            supplierEmail: "",
            detailedDescription: "",
            attachedFiles: [],
        });
        setValidationErrors([]);// 清空错误信息

        onDismiss(); // 调用父组件的关闭逻辑
    };

    return (
        <><Dialog
            hidden={!isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: "Create New Price Change Request",
            }}
            modalProps={{
                isBlocking: true,
                // styles: { main: { width: "800px" } }, // 调整弹出框的宽度
            }}
            minWidth={800}
            maxWidth={1200}
        >
            <div>
                {validationErrors.length > 0 && (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                        {validationErrors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                    </div>
                )}
            </div>
            <Stack tokens={{ childrenGap: 10 }} className={styles["dialog-section"]}>
                {/* Parma ID 和 Host Buyer Name */}
                <div className={styles["two-column"]}>
                    <Stack>
                        <Label>Parma ID</Label>
                        <Text>{formData.parmaID}</Text>
                    </Stack>
                    <Stack>
                        <Label>Host Buyer Name</Label>
                        <Text>{formData.hostBuyerName}</Text>
                    </Stack>
                </div>

                {/* Expected Effective Date 和 Supplier Email */}
                <div className={styles["two-column"]}>
                    <DatePicker
                        label="Expected Effective Date"
                        //placeholder="YYYY/MM/DD"
                        isRequired
                        value={formData.expectedEffectiveDate ? new Date(formData.expectedEffectiveDate) : undefined}
                        onSelectDate={(date) => {
                            if (date) {
                                //const formattedDate = formatDate(date); //没用
                                handleChange("expectedEffectiveDate", date); //setDateError(false); // 清除错误提示

                            }
                        }}
                        formatDate={formatDate} // 控制显示的日期格式
                        // onBlur={() => {
                        //     setHasInteracted(true); // 用户与组件交互过
                        //     if (!formData.expectedEffectiveDate) {
                        //         setDateError(true); // 如果没有选择日期，显示错误提示
                        //     }
                        // }}
                        // styles={{
                        //     root: { width: "100%" },
                        //     wrapper: dateError
                        //         ? {
                        //             border: "1px solid red", // 错误时边框变红
                        //             borderRadius: "4px",
                        //         }
                        //         : undefined,
                        // }}
                        
                    />
                    {/* {dateError && hasInteracted && (
                        <span style={{ color: "red", fontSize: "12px" }}>
                            Expected Effective Date is required.
                        </span>
                    )} */}
                    <TextField
                        label="Supplier Contact (Email)"
                        value={formData.supplierEmail}
                        required={true}
                        onChange={(e, newValue) => handleChange("supplierEmail", newValue)}
                        onGetErrorMessage={(value) => validateEmail(value || "")} // 验证邮箱格式
                        errorMessage={validateEmail(formData.supplierEmail)}
                        validateOnFocusOut // 在失去焦点时验证
                        validateOnLoad={false} // 不在初始加载时验证
                    />
                </div>

                {/* Detailed Description */}
                <TextField
                    label="Detailed Description"
                    multiline
                    rows={3}
                    required={true}
                    styles={{
                        root: { width: "100%" }, // 控制整体宽度
                        fieldGroup: {
                            resize: "none", // 禁止拖动调整大小
                            height: "100px", // 设置固定高度
                            width: "100%", // 设置固定宽度
                        },
                        field: {
                            resize: "none", // 禁止文本区域的宽度和高度调整
                        },
                    }}
                    placeholder="Please advise the background/reason of the request, and/or impacts to UD, and/or any related information."
                    value={formData.detailedDescription}
                    onChange={(e, newValue) => handleChange("detailedDescription", newValue)}
                    onGetErrorMessage={(value) => validateDetailedDescription(value || "")} // 实时验证
                    validateOnFocusOut // 在失去焦点时验证
                    validateOnLoad={false} // 不在初始加载时验证
                />

                {/* Attach File */}
                <Label>Attach File</Label>
                <span>Please ensure the impacted parts list/parts description/buyer are provided</span>
                <div className={styles["file-upload"]} onClick={() => document.getElementById("fileInput")?.click()}>
                    {/*<span>📎 Click to Upload (File number limit: 10; Single file size limit: 10MB)</span>*/}
                    <div style={{ display: "inline-block", color: "black" }}>
                        <span
                            role="img"
                            aria-label="paperclip"
                            className="textUpload"
                        >
                            {"Click to Upload"}
                        </span>
                        <span className="textPaddingLeft">
                            {
                                "(File number limit: 10; Single file size limit: 10MB)"
                            }
                        </span>
                    </div>
                </div>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
                {formData.attachedFiles.map((file, index) => (
                    <div key={index} className={styles["file-item"]}>
                        <Text>{file.name}</Text>
                        <IconButton
                            iconProps={{ iconName: "Delete" }}
                            title="Remove"
                            onClick={() => handleRemoveFile(index)}
                        />
                    </div>
                ))}
            </Stack>

            {/* 底部按钮 */}
            <DialogFooter>
                <DefaultButton onClick={handleDismiss} text="Cancel" />
                <PrimaryButton
                    onClick={
                        // const requestNo = generateRequestNo(); //generate reqeust no
                        // onConfirm({ ...formData, requestNo });
                        handleSubmit
                        //alert(`RequestNo:",${requestNo}`);

                    }
                    text="Confirm"
                    className={styles["primary-button"]}
                />
            </DialogFooter>
        </Dialog>
            {/* 第二个弹窗 */}
            <Dialog
                hidden={!isResultDialogOpen}
                onDismiss={() => setIsResultDialogOpen(false)} // 关闭第二个弹窗
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Notification",
                    subText: resultMessage, // 显示结果消息
                }}
            >
                <DialogFooter>
                    <PrimaryButton
                        onClick={() => setIsResultDialogOpen(false)} // 确认后关闭弹窗
                        text="OK"
                    />
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default CreatePriceChangeRequest;


