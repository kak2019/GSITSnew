import React from "react";
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
} from "@fluentui/react";

const QuoteCreation : React.FC = () => {
  // 数据示例
  const columns = [
    { key: "column1", name: "Part No.", fieldName: "partNo", minWidth: 100 },
    { key: "column2", name: "Qualifier", fieldName: "qualifier", minWidth: 100 },
    { key: "column3", name: "Part Description", fieldName: "description", minWidth: 150 },
    { key: "column4", name: "Material User", fieldName: "materialUser", minWidth: 100 },
    { key: "column5", name: "Price Type", fieldName: "priceType", minWidth: 100 },
    { key: "column6", name: "Annual QTY", fieldName: "annualQty", minWidth: 100 },
    { key: "column7", name: "Order Qty", fieldName: "orderQty", minWidth: 100 },
    { key: "column8", name: "Quoted Unit Price", fieldName: "quotedPrice", minWidth: 150 },
    { key: "column9", name: "Currency", fieldName: "currency", minWidth: 100 },
    { key: "column10", name: "UOP", fieldName: "uop", minWidth: 100 },
    { key: "column11", name: "Effective Date", fieldName: "effectiveDate", minWidth: 150 },
    { key: "column12", name: "Part Status", fieldName: "status", minWidth: 100 },
    { key: "column13", name: "Last Comment By", fieldName: "lastComment", minWidth: 150 },
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
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField label="RFQ No" value="99999999" disabled/>
              <TextField label="Parma" value="500019" disabled />
              <TextField label="RFQ Due Date" value="2024/12/01" disabled />
              <Label>RFQ Attachments</Label>
              <Stack tokens={{ childrenGap: 5 }}>
                <Link href="#">File 1</Link>
                <Link href="#">File 2</Link>
                <Link href="#">File 3</Link>
                <Link href="#">File 4</Link>
              </Stack>
            </Stack>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField label="RFQ Release Date" value="2024/01/19" disabled />
              <TextField label="Supplier Name" value="Nelson (Changzhou) Tubing Co. Ltd" disabled />
              <TextField label="Order Type" value="BLPR Blanket Production Order" disabled />
            </Stack>
            <Stack tokens={{ childrenGap: 10 }} grow>
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
                  selectionMode={SelectionMode.none

              }
              />
              <TextField label="RFQ Instruction to Supplier" multiline rows={3} />
            </Stack>
          </Stack>
        </Stack>

        {/* Quote Basic Info */}
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { border: "1px solid #ccc", padding: 20 } }}>
          <Text variant="large">Quote Basic Info</Text>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField label="Status" value="In Progress" disabled />
              <TextField label="Quote Date" value="2024/01/19" disabled />
            </Stack>
            <Stack tokens={{ childrenGap: 10 }} grow>
              <TextField label="Input Comments" multiline rows={3} />
              <PrimaryButton text="Add" />
            </Stack>
            <Stack tokens={{ childrenGap: 10 }}>
              <Label>Comment History</Label>
              <TextField
                  multiline
                  rows={3}
                  value="2024/10/23 Buyer Name: comment\n2024/10/22 Supplier Name: comment"
                  disabled
              />
            </Stack>
          </Stack>
        </Stack>

        {/* Quote Breakdown Info */}
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { border: "1px solid #ccc", padding: 20 } }}>
          <Text variant="large">Quote Breakdown Info</Text>
          <DetailsList
              items={items}
              columns={columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.multiple}
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
