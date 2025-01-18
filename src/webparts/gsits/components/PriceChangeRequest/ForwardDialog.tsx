import React, { useEffect, useState } from "react";
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
  ComboBox,
  IComboBox,
  IComboBoxOption,
  SelectionMode,
} from "@fluentui/react";
import theme from "../../../../config/theme";
//import { DropdownItem } from "../PriceChangeRequestDetail/Component";
import styles from "./index.module.scss";
import { getAADClient } from "../../../../pnpjsConfig";
import { CONST } from "../../../../config/const";
import { AadHttpClient } from "@microsoft/sp-http";
import { t } from "i18next";
import { usePriceChange } from "../../../../hooks/usePriceChange";
import { ISupplierRequestFormModel, ISupplierRequestSubItemFormModel } from "../../../../model/priceChange";

interface ForwardDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (formData: any) => void;
  RequestIDRef: string;
  SelectedItemStatus: string;
}

// const PorgOptions = [
//   { key: "UDT", text: "UDT" },
//   { key: "UDMM", text: "UDMM" },
//   { key: "UDTA", text: "UDTA" },
//   { key: "UDTI", text: "UDTI" },
//   { key: "UDTM", text: "UDTM" },
//   { key: "VIT", text: "VIT" },
// ];

const ForwardDialog: React.FC<ForwardDialogProps> = ({
  isOpen,
  onDismiss,
  onConfirm,
  RequestIDRef,
  SelectedItemStatus,
}) => {
  const [formData, setFormData] = useState({
    porg: "",
    handlerCode: "",
    handlerName: "",
    sectionCode: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(""); // 新增状态来存储错误消息
  const [
    ,
    ,
    ,
    ,
    currentPriceChangeRequestSubItemList,
    ,
    ,
    getSupplierRequestSubitemList,
    ,
    updateSupplierRequest,
    ,
    createSupplierRequestSubitems,
    ,
    ,
  ] = usePriceChange();
  const comboBoxRefResponsibleBuyer = React.useRef<IComboBox>(null);
  const [filteredResponsibleBuyerOptions, setFilteredResponsibleBuyerOptions] =
    useState<IComboBoxOption[]>([]);
  const [selectedResponsibleBuyerValue, setSelectedResponsibleBuyerValue] =
    useState<string | undefined>();

    const [isForwardDisabled, setIsForwardDisabled] = useState<boolean>(true);

  const columns: IColumn[] = [
    { key: "porg", name: "Porg", fieldName: "porg", minWidth: 100 },
    {
      key: "handlerCode",
      name: "Handler Code",
      fieldName: "handlerCode",
      minWidth: 100,
    },
    {
      key: "handlerName",
      name: "Handler Name",
      fieldName: "handlerName",
      minWidth: 150,
    },
    {
      key: "sectionCode",
      name: "Section Code",
      fieldName: "sectionCode",
      minWidth: 100,
    },
    {
      key: "remove",
      name: "",
      // onRender: (item, index) => (
      //   <a
      //     onClick={(e) => {
      //       e.preventDefault();
      //       const isExisting = currentPriceChangeRequestSubItemList.some(
      //         (existingItem) => existingItem.Handler === item.handlerCode
      //       );
      //       if (isExisting) {
      //         alert("Cannot remove an existing responsible buyer.");
      //       } else {
      //         setItems(items.filter((_, i) => i !== index));
      //       }
      //     }}
      //     href="#"
      //     style={{
      //       textDecoration: "underline",
      //       cursor: "pointer",
      //       color: "black",
      //     }}
      //   >
      //     Remove
      //   </a>
      // ),
      onRender: (item, index) => {
        const isExisting = currentPriceChangeRequestSubItemList.some(
          (existingItem) => existingItem.Handler === item.handlerCode
        );
      
        return !isExisting ? (
          <a
            onClick={(e) => {
              e.preventDefault();
              setItems(items.filter((_, i) => i !== index));
            }}
            href="#"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "black",
            }}
          >
            Remove
          </a>
        ) : null; // Return null to hide the button
      },
      
      minWidth: 100,
    },
  ];


  useEffect(() => {
    const hasNewBuyer = items.some(
      (item) =>
        !currentPriceChangeRequestSubItemList.some(
          (existingItem) => existingItem.Handler === item.handlerCode
        )
    );
    setIsForwardDisabled(!hasNewBuyer);
  }, [items, currentPriceChangeRequestSubItemList]);
  
  const handleAdd = (): void => {
    if (
      !formData.porg ||
      !formData.handlerCode ||
      !formData.handlerName ||
      !formData.sectionCode
    ) {
      console.log(formData);
      setErrorMessage("Please select Responsible Buyer before adding.");
      return;
    }
    const isDuplicate = items.some(
      (item) => item.handlerCode === formData.handlerCode
    );

    if (isDuplicate) {
      setErrorMessage(
        "Request has been forwarded to this buyer, block duplicated buyer adding."
      );
      return;
    }
    setErrorMessage("");
    setItems([...items, { ...formData, prog: "UDT" }]); // 添加 Porg 字段
    setFormData({
      porg: "",
      handlerCode: "",
      handlerName: "",
      sectionCode: "",
    }); // 重置表单
  };

  const fetchResponsibleBuyerdropdown = async (
    input: string
  ): Promise<IComboBoxOption[]> => {
    try {
      const client = getAADClient();
      const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser?q=${input}`;
      const response = await client.get(
        functionUrl,
        AadHttpClient.configurations.v1
      );
      const result = await response.json();
      // 返回前10个结果
      return Array.isArray(result)
        ? result.slice(0, 10).map((item) => ({
            key: `${item.porg} ${item.handler}`, // 唯一标识符
            text: `${item.porg} ${item.handler} (${item.name})`, // 拼接显示内容
            title: `${item.porg} ${item.handler} (${item.name})`, // 鼠标悬停完整显示
            data: {
              porg: item.porg,
              handlerCode: item.handler,
              handlerName: item.name,
              sectionCode: item.sectionCode,
            }, // 额外用户信息
          }))
        : [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // 或者抛出错误，根据你的逻辑需求
    }
  };
  const handleInputResponsibleBuyerChange = async (
    text: string
  ): Promise<void> => {
    if (text) {
      try {
        comboBoxRefResponsibleBuyer.current?.focus(true);
        const options = await fetchResponsibleBuyerdropdown(text);
        setFilteredResponsibleBuyerOptions(options); // 更新下拉框选项
      } catch (error) {
        console.error("Error fetching buyer options:", error);
      }
    } else {
      setFilteredResponsibleBuyerOptions([]); // 如果输入为空，清空下拉选项
    }
  };
  // const handleResponsibleBuyerSelectionChange = (
  //   e: React.FormEvent<IComboBox>,
  //   option?: IComboBoxOption | undefined
  // ): void => {
  //   if (option) {
  //     setSelectedResponsibleBuyerValue(option.key as string); // 保存选中的 key
  //     // handleSearchChange('Buyer', option.key as string);

  //     console.log("Selected Key:", option.key);
  //   } else {
  //     setSelectedResponsibleBuyerValue(undefined);

  //     console.log("Buyer field cleard");
  //   }
  // };
  // 修改 handleResponsibleBuyerSelectionChange 函数以更新 formData
  const handleResponsibleBuyerSelectionChange = (
    e: React.FormEvent<IComboBox>,
    option?: IComboBoxOption | undefined
  ): void => {
    if (option) {
      setSelectedResponsibleBuyerValue(option.key as string);
      const selectedData = option.data as {
        porg: string;
        handlerCode: string;
        handlerName: string;
        sectionCode: string;
      };
      // 更新 formData 的状态
      setFormData({
        ...formData,
        porg: selectedData.porg,
        handlerCode: selectedData.handlerCode,
        handlerName: selectedData.handlerName,
        sectionCode: selectedData.sectionCode,
      });
      console.log("Selected Key:", selectedData);
    } else {
      setSelectedResponsibleBuyerValue(undefined);
      console.log("Buyer field cleared");
    }
  };

  const handleSubmit = async () : Promise<void>=> {
    const newItems = items.filter(item => 
      !currentPriceChangeRequestSubItemList.some(
        existingItem => existingItem.Handler === item.handlerCode
      )
    );
    // 将 detailsListItems 转换为 ISupplierRequestSubItemFormModel 数组
    const forms: ISupplierRequestSubItemFormModel[] = newItems.map((item) => ({
      Porg: item.porg,
      Handler: item.handlerCode,
      HandlerName: item?.handlerName,
      Section: item?.sectionCode,
      RequestIDRef: RequestIDRef,
      NotificationDate: new Date(),
      SupplierRequestSubItemStatus: "New",
    }));

    try {
      // 调用 API
      const result = await createSupplierRequestSubitems(forms);
      if(SelectedItemStatus === "New"){
        const updateform: ISupplierRequestFormModel = {
          ID: RequestIDRef,
          SupplierRequestStatus: "In Progress",
           
        }
        await updateSupplierRequest(updateform)
      }
      setSelectedResponsibleBuyerValue(undefined);
      onConfirm(forms);
      console.log("Submission successful:", result);

      // 可以在这里处理提交成功的逻辑，比如清空列表或显示成功消息
    } catch (error) {
      console.error("Submission failed:", error);
      // 处理提交失败的逻辑，比如显示错误消息
    }
  };

  const handleCancel = ():void => {
    setSelectedResponsibleBuyerValue(undefined);
    setFormData({
      porg: "",
      handlerCode: "",
      handlerName: "",
      sectionCode: "",
    });
    onDismiss();
  };
  React.useEffect(() => {
    // if (!isOpen || items.length > 0) return;  //  避免重复加载
    const fetchData = async () : Promise<void>=> {
      if (isOpen && RequestIDRef) {
      try {
        const data = await getSupplierRequestSubitemList(RequestIDRef);
        console.log("RequestIDRef:", RequestIDRef);
        console.log("subitemlist: ", data);
        if (data && data.length > 0) {
          setItems(data.map(item => ({
            porg: item.Porg,
            handlerCode: item.Handler,
            handlerName: item.HandlerName,
            sectionCode: item.Section,
          })));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching subitem list:", error);
      }}
    };

   
      fetchData().then(
        (_) => _,
        (_) => _
      );
    
  }, [isOpen]);

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: "Forward to Responsible Buyers",
      }}
      minWidth={800}
    >
      <div>
          {errorMessage.length > 0 && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {errorMessage}
            </div>
          )}
        </div>
      <Stack
        className={styles.noMargin}
        styles={{
          root: {
            paddingTop: 0,
            padding: "10px 1.5%",
            display: "grid",
            gridTemplateRows: "repeat(3, auto)", // 定义三行布局
            gridTemplateColumns: "repeat(4, 1fr) auto", // 五等分

            columnGap: "calc((100% - 2 * 1.5%) * 0.055)", // 搜索框间距占剩余空间的5.5%
            rowGap: "20px", // 行间距
          },
        }}
      >
        
        <Stack.Item
          style={{
            gridRow: "1",
            gridColumn: "1/5",
            //   justifySelf: "end",
            //   alignSelf: "end",
          }}
        >
          <ComboBox
            label={t("Responsible Buyer")}
            componentRef={comboBoxRefResponsibleBuyer}
            options={filteredResponsibleBuyerOptions}
            autoComplete="on"
            allowFreeform={true}
            openOnKeyboardFocus={true}
            onInputValueChange={handleInputResponsibleBuyerChange}
            //onBlur={handleBlur}
            useComboBoxAsMenuWidth={false}
            // text={form.parma}
            selectedKey={selectedResponsibleBuyerValue}
            //styles={comboBoxStyles}
            onChange={handleResponsibleBuyerSelectionChange}
          />
        </Stack.Item>
        <Stack.Item
          style={{
            gridRow: "2",
            gridColumn: "1",
            //   justifySelf: "end",
            //   alignSelf: "end",
          }}
        >
          <TextField label="Porg" value={formData.porg} readOnly />
          {/* <Dropdown
            options={PorgOptions}
            label={"Porg"}
            //selectedKey={formData.porg} 设置默认值为UDT
            defaultSelectedKey="UDT"
            onChange={(e, option) =>
              setFormData({ ...formData, porg: option?.key?.toString() || " " })
            }
          /> */}
        </Stack.Item>
        <Stack.Item
          style={{
            gridRow: "2",
            gridColumn: "2",
            //   justifySelf: "end",
            //   alignSelf: "end",
          }}
        >
          <TextField
            label="Handler Code"
            value={formData.handlerCode}
            readOnly
            // onChange={(e, newValue) =>
            //   setFormData({ ...formData, handlerCode: newValue || "" })
            // }
            styles={{
              root: {
                height: "40px", // 统一高度
              },
            }}
          />
        </Stack.Item>
        <Stack.Item
          style={{
            gridRow: "2",
            gridColumn: "3",
            //   justifySelf: "end",
            //   alignSelf: "end",
          }}
        >
          <TextField
            label="Handler Name"
            value={formData.handlerName}
            readOnly
            // onChange={(e, newValue) =>
            //   setFormData({ ...formData, handlerName: newValue || "" })
            // }
            styles={{
              root: {
                height: "40px", // 统一高度
              },
            }}
          />
        </Stack.Item>
        <Stack.Item
          style={{
            gridRow: "2",
            gridColumn: "4",
            //   justifySelf: "end",
            //   alignSelf: "end",
          }}
        >
          <TextField
            label="Section Code"
            value={formData.sectionCode}
            readOnly
            // onChange={(e, newValue) =>
            //   setFormData({ ...formData, sectionCode: newValue || "" })
            // }
            styles={{
              root: {
                height: "40px", // 统一高度
              },
            }}
          />
        </Stack.Item>
        <Stack.Item
          style={{
            gridRow: "2",
            gridColumn: "5", // 放在第五列
            alignSelf: "center", // 垂直居中对齐
          }}
        >
          <PrimaryButton
            text="Add"
            onClick={handleAdd}
            styles={{
              ...theme.buttonStyles,
              root: {
                ...theme.buttonStyles.root,
                width: "100%",
                height: "30px",
                padding: "0 16px", // 调整内边距
                lineHeight: "40px",
              },
            }}
          />
        </Stack.Item>
      </Stack>
      <DetailsList
        items={items}
        columns={columns}
        styles={{
          root: theme.detaillist.root,
          contentWrapper: {
            minHeight: "200px", // 确保内容区域有最小高度
          },
          headerWrapper: theme.detaillist.headerWrapper,
        }}
        selectionMode={SelectionMode.none}
      />
      <DialogFooter>
        <DefaultButton onClick={handleCancel} text="Cancel" />
        <PrimaryButton onClick={() => handleSubmit()} text="Forward"
        disabled={isForwardDisabled} />
      </DialogFooter>
    </Dialog>
  );
};

export default ForwardDialog;
