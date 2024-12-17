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

// 定义 Props 接口
interface CreatePriceChangeRequestProps {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: (formData: any) => void;
}

const CreatePriceChangeRequest: React.FC<CreatePriceChangeRequestProps> = ({
    isOpen,
    onDismiss,
    onConfirm,
}) => {
    // 表单数据状态
    const [formData, setFormData] = useState({
        parmaID: "0001",
        hostBuyerName: "First Name Last Name",
        expectedEffectiveDate: null,
        supplierEmail: "",
        detailedDescription: "",
        attachedFiles: [] as File[],
    });

    // 处理表单输入变化
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setFormData((prev) => ({ ...prev, attachedFiles: files }));
    };

    // 删除文件
    const handleRemoveFile = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachedFiles: prev.attachedFiles.filter((_, i) => i !== index),
        }));
    };

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: "Create New Price Change Request",
            }}
            modalProps={{
                isBlocking: true,
            }}
        >
            <Stack tokens={{ childrenGap: 10 }}>
                {/* Parma ID 和 Host Buyer Name */}
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                    <Stack.Item grow>
                        <Label>Parma ID</Label>
                        <Text>{formData.parmaID}</Text>
                    </Stack.Item>
                    <Stack.Item grow>
                        <Label>Host Buyer Name</Label>
                        <Text>{formData.hostBuyerName}</Text>
                    </Stack.Item>
                </Stack>

                {/* Expected Effective Date 和 Supplier Email */}
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                    <DatePicker
                        label="Expected Effective Date *"
                        placeholder="Select a date"
                        onSelectDate={(date) => handleChange("expectedEffectiveDate", date)}
                    />
                    <TextField
                        label="Supplier Contact (Email) *"
                        value={formData.supplierEmail}
                        onChange={(e, newValue) => handleChange("supplierEmail", newValue)}
                    />
                </Stack>

                {/* Detailed Description */}
                <TextField
                    label="Detailed Description *"
                    multiline
                    rows={3}
                    placeholder="Please share responsible buyer name if only request for part price change for specific parts."
                    value={formData.detailedDescription}
                    onChange={(e, newValue) => handleChange("detailedDescription", newValue)}
                />

                {/* Attach File */}
                <Label>Attach File</Label>
                <Stack styles={{ root: { border: "1px dashed gray", padding: 10 } }}>
                    <input type="file" multiple onChange={handleFileUpload} />
                    {formData.attachedFiles.map((file, index) => (
                        <Stack
                            horizontal
                            key={index}
                            tokens={{ childrenGap: 10 }}
                            verticalAlign="center"
                        >
                            <Text>{file.name}</Text>
                            <IconButton
                                iconProps={{ iconName: "Delete" }}
                                title="Remove"
                                onClick={() => handleRemoveFile(index)}
                            />
                        </Stack>
                    ))}
                </Stack>
            </Stack>

            <DialogFooter>
                <DefaultButton onClick={onDismiss} text="Cancel" />
                <PrimaryButton
                    onClick={() => onConfirm(formData)}
                    text="Confirm"
                />
            </DialogFooter>
        </Dialog>
    );
};

export default CreatePriceChangeRequest;
