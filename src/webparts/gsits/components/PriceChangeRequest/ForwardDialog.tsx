import React, { useState } from "react";
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    TextField,
    DetailsList,
    IColumn,
    Stack,
    Dropdown,

} from "@fluentui/react";
import theme from "../../../../config/theme";
//import { DropdownItem } from "../PriceChangeRequestDetail/Component";
import styles from "./index.module.scss";


interface ForwardDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onConfirm: (formData: any) => void;
}

const PorgOptions = [
    { key: "UDT", text: "UDT" },
    { key: "UDMM", text: "UDMM" },
    { key: "UDTA", text: "UDTA" },
    { key: "UDTI", text: "UDTI" },
    { key: "UDTM", text: "UDTM" },
    { key: "VIT", text: "VIT" },
]
const ForwardDialog: React.FC<ForwardDialogProps> = ({ isOpen, onDismiss, onConfirm }) => {
    const [formData, setFormData] = useState({
        porg: "",
        handlerCode: "",
        handlerName: "",
        sectionCode: "",
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [items, setItems] = useState<any[]>([]);

    const columns: IColumn[] = [
        { key: "porg", name: "Porg", fieldName: "porg", minWidth: 100 },
        { key: "handlerCode", name: "Handler Code", fieldName: "handlerCode", minWidth: 100 },
        { key: "handlerName", name: "Handler Name", fieldName: "handlerName", minWidth: 150 },
        { key: "sectionCode", name: "Section Code", fieldName: "sectionCode", minWidth: 100 },
        {
            key: "remove",
            name: "Actions",
            onRender: (item, index) => (
                <a onClick={(e) => {e.preventDefault();// 阻止默认行为
                setItems(items.filter((_, i) => i !== index))}} href="#" style={{ textDecoration: "underline", cursor: "pointer" ,color:"black"}}>Remove</a>
            ),
            minWidth: 100
        },
    ];

    const handleAdd = () :void => {
        if (!formData.porg || !formData.handlerCode || !formData.handlerName || !formData.sectionCode) {
            console.log(formData);
            alert("Please fill in all fields before adding.");
            return;
        }
        setItems([...items, { ...formData, prog: "UDT" }]); // 添加 Porg 字段
        setFormData({ porg: "",handlerCode: "", handlerName: "", sectionCode: "" }); // 重置表单
    };
    

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: "Forward to Responsible Buyers",
            }}
            minWidth={800}
        ><Stack className={styles.noMargin}
            styles={{
                root: {
                    paddingTop: 0,
                    padding: "10px 1.5%",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr) auto", // 五等分
                    
                    columnGap: "calc((100% - 2 * 1.5%) * 0.055)", // 搜索框间距占剩余空间的5.5%
                    rowGap: "20px", // 行间距
                    
                },
            }}>
        
                
                    <Dropdown options={PorgOptions} label={"Porg"} 
                    //selectedKey={formData.porg} 设置默认值为UDT
                    defaultSelectedKey="UDT"
                    onChange={(e, option) => setFormData({ ...formData, porg: option?.key?.toString() || ' ' })}/>
                    
                
                <TextField
                    label="Handler Code"
                    value={formData.handlerCode}
                    onChange={(e, newValue) => setFormData({ ...formData, handlerCode: newValue || "" })}
                    styles={{
                        root: {
                            height: "40px", // 统一高度
                        },
                    }}
                />
                <TextField
                    label="Handler Name"
                    value={formData.handlerName}
                    onChange={(e, newValue) => setFormData({ ...formData, handlerName: newValue || "" })}
                    styles={{
                        root: {
                            height: "40px", // 统一高度
                        },
                    }}
                />
                <TextField
                    label="Section Code"
                    value={formData.sectionCode}
                    onChange={(e, newValue) => setFormData({ ...formData, sectionCode: newValue || "" })}
                    styles={{
                        root: {
                            height: "40px", // 统一高度
                        },
                    }}
                />

                <Stack.Item style={{ gridRow: "1", gridColumn: "5",  // 放在第五列
        alignSelf: "center", // 垂直居中对齐
        }}>
                    <PrimaryButton text="Add" onClick={handleAdd} styles={{
                                ...theme.buttonStyles,
                                root: { ...theme.buttonStyles.root, width: "100%",height: "30px",padding: "0 16px", // 调整内边距
                                    lineHeight: "40px",  },
                            }} /></Stack.Item>
            </Stack>
            <DetailsList items={items} columns={columns} styles={{
                root: theme.detaillist.root,
                contentWrapper: {
                    minHeight: "200px", // 确保内容区域有最小高度
                  },
                headerWrapper: theme.detaillist.headerWrapper,
            }} />
            <DialogFooter>
                <DefaultButton onClick={onDismiss} text="Cancel" />
                <PrimaryButton onClick={() => onConfirm(items)} text="Forward" />
            </DialogFooter>
        </Dialog>
    );
};

export default ForwardDialog;
