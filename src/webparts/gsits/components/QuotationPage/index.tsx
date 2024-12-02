import React, {useState} from "react";
import {
  Stack,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  PrimaryButton,
  DefaultButton,
  Label,
  Text,
  Link,
  mergeStyleSets,
  DetailsRow,
} from "@fluentui/react";
import {useTranslation} from "react-i18next";
import AppContext from "../../../../AppContext";
import {getAADClient} from "../../../../pnpjsConfig";
import {CONST} from "../../../../config/const";
import {AadHttpClient} from "@microsoft/sp-http";
import {useRFQ} from "../../../../hooks/useRFQ";
import {useDocument} from "../../../../hooks"
const classes = mergeStyleSets({
  fileList: {
    marginTop: '10px',
    position: 'relative',
    height: '140px',
    overflow: 'hidden',
    overflowY: 'auto',
    border: '1px solid #ccc'
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e1dfdd',
    padding: '5px 10px',
    alignItems: 'center',
    height: '35px',
    boxSizing: 'border-box'
  },
  oddItem: {
    backgroundColor: '#fff',
  },
  evenItem: {
    backgroundColor: '#F6F6F6',
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    marginTop: "4px",
    fontWeight: 'bold'
  },
  labelItem: {
    marginBottom: '10px'
  },
  labelValue: {
    lineHeight: '30px'
  }
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchData = async (parmaValue: string): Promise<any> => {
  try {
    const client = getAADClient();
    const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetSupplierInfo/${parmaValue}`;
    const response = await client.get(
        functionUrl,
        AadHttpClient.configurations.v1
    );

    // 检查响应状态
    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      return null; // 返回 null 如果响应失败
    }

    const result = await response.json();
    console.log("Fetched data:", result);
    return result; // 返回结果
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // 发生异常时返回 null
  }
};

const QuoteCreation : React.FC = () => {
  const [documentdetails,setdocumentdetails] = useState<{File:{},Url:string}>()
  const { t } = useTranslation();
 const [ , , , rfqAttachments, , , , , getRFQAttachments] = useDocument()
  const [, , ,  currentRFQ,currentRFQRequisitions , ,getRFQ , updateRFQ,]= useRFQ();
  let userEmail = "";
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    sectionCode: "",
    handlercode: ""
  });
  const ctx = React.useContext(AppContext);
  if (!ctx || !ctx.context) {
    throw new Error("AppContext is not provided or context is undefined");
  } else {
    userEmail = ctx.context._pageContext._user.email;
    console.log("useremail", userEmail)
  }
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      try {
        const client = getAADClient(); // 请确保getAADClient()已正确实现

        // 使用模板字符串构建完整的函数URL
        const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser/${userEmail}`;

        const response = await client.get(
            functionUrl,
            AadHttpClient.configurations.v1
        );

        // 确保解析 response 时不抛出错误
        const result = await response.json();
        console.log(result);
        if (result && result.role && result.name && result.sectionCode && result.handlercode) {
          // 如果所有字段都有值，更新状态
          setUserDetails({
            role: result.role,
            name: result.name,
            sectionCode: result.sectionCode,
            handlercode: result.handlercode,
          });

        } else {
          console.warn("Incomplete data received:", result);
        }
      } catch (error) {
        console.error("Error fetching GPS user props:", error);
      }
    };

    fetchData().then(
        (_) => _,
        (_) => _
    );
  }, []);
  React.useEffect(() => {
    getRFQ("70");
    if(currentRFQ?.Parma){
      fetchData(currentRFQ?.Parma).then(a => console.log("a",a)).catch(e => console.error(e));
    }
    getRFQAttachments("70")
    const fileObject = {
      File: {},
      Url: "https://udtrucks.sharepoint.com/sites/app-gsits-dev/RFQ Attachments/70/image-20240911092956322.png"
    };
    setdocumentdetails(fileObject)
    console.log("all",documentdetails);
  }, []);

console.log("all2",userDetails);
console.log("curretRFQ",currentRFQ);
console.log("currentRFQRequisitions",currentRFQRequisitions);
  console.log("documents",rfqAttachments);
const onclickAddComment=():void=>{
  updateRFQ({ID:"70", CommentHistory:"yyy"})
}
  const columns = [
    { key: "column1", name: t("Part No."), fieldName: "partNo", minWidth: 100 },
    { key: "column2", name: t("Qualifier"), fieldName: "qualifier", minWidth: 100 },
    { key: "column3", name: t("Part Description"), fieldName: "description", minWidth: 150 },
    { key: "column4", name: t("Material User"), fieldName: "materialUser", minWidth: 100 },
    { key: "column5", name: t("Price Type"), fieldName: "priceType", minWidth: 100 },
    { key: "column6", name: t("Annual QTY"), fieldName: "annualQty", minWidth: 100 },
    { key: "column7", name: t("Order Qty"), fieldName: "orderQty", minWidth: 100 },
    { key: "column8", name: t("Quoted Unit Price"), fieldName: "quotedPrice", minWidth: 150 },
    { key: "column9", name: t("Currency"), fieldName: "currency", minWidth: 100 },
    { key: "column10", name: t("UOP"), fieldName: "uop", minWidth: 100 },
    { key: "column11", name: t("Effective Date"), fieldName: "effectiveDate", minWidth: 150 },
    { key: "column12", name: t("Part Status"), fieldName: "status", minWidth: 100 },
    { key: "column13", name: t("Last Comment By"), fieldName: "lastComment", minWidth: 150 },
    {
      key: "column14",
      name: "Action",
      minWidth: 100,
      onRender: () => <DefaultButton text="Edit" />,
    },
  ];

  const items = new Array(10).fill(null).map((_, index) => ({
    key: index,
    partNo: `345678901234`,
    qualifier: "V",
    description: "FLY WHEEL",
    materialUser: "2920",
    priceType: "Negotiated",
    annualQty: "999999",
    orderQty: "999999",
    quotedPrice: "123,123.456.999",
    currency: "JPY",
    uop: "PC",
    effectiveDate: "2025/01/01",
    status: "Quoted",
    lastComment: "2024/11/01",
  }));

  return (
      <Stack tokens={{ childrenGap: 20, padding: 20 }}>
        {/* Header */}
        <Text variant="xxLarge" style={{ backgroundColor: "#99CCFF", padding: "10px" }}>
          Creation of Quote
        </Text>

        {/* RFQ Basic Info */}
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { border: "1px solid #ccc", padding: 20 } }}>
          <Text variant="large">RFQ Basic Info</Text>
          <Stack horizontal tokens={{ childrenGap: 100 }}>
            <Stack tokens={{ childrenGap: 10 }} styles={{root: { width: '50%' }}}>
              <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-between" >
                <Stack tokens={{ childrenGap: 10 }}>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  RFQ No </div>
                    <div className={classes.labelValue}>{currentRFQ?.RFQNo}</div>
                  </div>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  Parma </div>
                    <div className={classes.labelValue}>{currentRFQ?.Parma}</div>
                  </div>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  RFQ Due Date </div>
                    <div className={classes.labelValue}>{currentRFQ?.RFQDueDate}</div>
                  </div>
                </Stack>
                <Stack tokens={{ childrenGap: 10 }}>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  RFQ Release Date </div>
                    <div className={classes.labelValue}>{currentRFQ?.Created}</div>
                  </div>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  Supplier Name </div>
                    <div className={classes.labelValue}>Nelson (Changzhou) Tubing Co. Ltd</div>
                  </div>
                  <div className={classes.labelItem}>
                    <div className={classes.label}>  Order Type </div>
                    <div className={classes.labelValue}>{currentRFQ?.OrderType}</div>
                  </div>
                </Stack>
              </Stack>
              <Label>RFQ Attachments</Label>
              <Stack className={classes.fileList}>
                <div className={classes.fileItem + ' ' + classes.oddItem}>
                  <Link href="#">File 1</Link>
                </div>
                <div className={classes.fileItem + ' ' + classes.evenItem}>
                  <Link href="#">File 2</Link>
                </div>
                <div className={classes.fileItem + ' ' + classes.oddItem}>
                  <Link href="#">File 3</Link>
                </div>
                <div className={classes.fileItem + ' ' + classes.evenItem}>
                  <Link href="#">File 4</Link>
                </div>
              </Stack>


            </Stack>
            <Stack tokens={{ childrenGap: 10 }} styles={{root: { width: '50%' }}}>
              <Label>Contact</Label>
              <DetailsList
                  items={[
                    { contact: "Feng Chen", email: "feng.chen@nelsoncp.com", role: "Import & Export" },
                    { contact: "Martin Ma", email: "martin.ma@nelsoncp.com", role: "Engineering Manager" },
                  ]}
                  columns={[
                    { key: "contact", name: "Contact", fieldName: "contact", minWidth: 100 },
                    { key: "email", name: "Email", fieldName: "email", minWidth: 200 },
                    { key: "role", name: "Role", fieldName: "role", minWidth: 150 },
                  ]}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selectionMode={SelectionMode.none}
                  onRenderDetailsHeader={() => null}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onRenderRow={(props: any) => {
                    return <DetailsRow {...props} className={props.itemIndex % 2 === 0 ? classes.evenItem : classes.oddItem} />
                  }}
              />
              <TextField label="RFQ Instruction to Supplier" multiline rows={3}  value={currentRFQ?.RFQInstructionToSupplier} disabled/>
            </Stack>
          </Stack>
        </Stack>

        {/* Quote Basic Info */}
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { border: "1px solid #ccc", padding: 20 } }}>
          <Text variant="large">Quote Basic Info</Text>
          <Stack horizontal tokens={{ childrenGap: 100 }}>
            <Stack tokens={{ childrenGap: 10 }} grow>
              <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-between">
                <div className={classes.labelItem}>
                  <div className={classes.label}>  Status </div>
                  <div className={classes.labelValue}>In Progress</div>
                </div>
                <div className={classes.labelItem}>
                  <div className={classes.label}>  Quote Date </div>
                  <div className={classes.labelValue}>{currentRFQ?.LatestQuoteDate}</div>
                </div>
              </Stack>
              <Stack tokens={{ childrenGap: 10 }} grow>
                <TextField label="Input Comments" multiline rows={3} />
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <PrimaryButton onClick={onclickAddComment} text="Add" styles={{root: { backgroundColor: 'skyblue', width: '50px', textAlign: 'right' }}} />
                </div>

              </Stack>
            </Stack>

            <Stack tokens={{ childrenGap: 10 }} grow>
              <Label style={{fontWeight: 'bold'}}>Comment History</Label>
              <TextField
                  multiline
                  rows={3}
                  value={currentRFQ?.CommentHistory}
                  disabled
              />
            </Stack>
          </Stack>
        </Stack>

        {/* Quote Breakdown Info */}
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { border: "1px solid #ccc" } }}>
          <Text className="mainTitle" variant="large">Quote Breakdown Info</Text>
          <DetailsList
              items={items}
              columns={columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.multiple}
              styles={{
                root: {
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                },
                headerWrapper: {
                  backgroundColor: "#AFAFAF",
                  selectors: {
                    ".ms-DetailsHeader": {
                      backgroundColor: "#BDBDBD",
                      fontWeight: 600,
                    },
                  },
                },
              }}
          />
        </Stack>

        {/* Footer Buttons */}
        <Stack horizontal tokens={{ childrenGap: 10, padding: 10 }} horizontalAlign="space-between">
          <DefaultButton text="Back" />
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <DefaultButton text="CSV Download" />
            <PrimaryButton text="Accept" />
            <DefaultButton text="Return" />
          </Stack>
        </Stack>
      </Stack>
  );
};

export default QuoteCreation;
