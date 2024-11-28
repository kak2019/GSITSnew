import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import { useRFQ } from "../../../../hooks/useRFQ";

const UDUser: React.FC = () => {
  //#region demo data
  const users = [
    {
      SupplierId: 15,
      UserId: "Axxxxxxxxx",
      FirstName: "Mats",
      LastName: "Engvie",
      Email: "mats.engvie@udtrucks.com",
      Role: "Business Admin",
      UserStatus: "Active",
      CreatedBy: "System",
      CreatedDate: "2023-11-05",
    },
    {
      SupplierId: 16,
      UserId: "Bxxxxxxxxx",
      FirstName: "John",
      LastName: "Doe",
      Email: "john.doe@example.com",
      Role: "RPA User",
      UserStatus: "Inactive",
      CreatedBy: "System",
      CreatedDate: "2023-10-01",
    },
  ];
  //#endregion
  //#region properties

  const [, allRFQs, , , , getAllRFQs, , , ,] = useRFQ();
  const columns = [
    {
      key: "supplierid",
      name: "Supplier ID",
      fieldName: "SupplierId",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "userid",
      name: "User ID",
      fieldName: "UserId",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "firstname",
      name: "First Name",
      fieldName: "FirstName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "lastname",
      name: "Last Name",
      fieldName: "LastName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "email",
      name: "Email",
      fieldName: "Email",
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "role",
      name: "Role",
      fieldName: "Role",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "userstatus",
      name: "User Status",
      fieldName: "UserStatus",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "createdby",
      name: "Created By",
      fieldName: "CreatedBy",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "createddate",
      name: "Created Date",
      fieldName: "CreatedDate",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];
  //#endregion
  //#region events
  React.useEffect(() => {
    getAllRFQs();
  }, []);
  const Test = (): void => {
    console.log("test");
    console.log(allRFQs);
  };
  //#endregion
  //#region html
  return (
    <div style={{ margin: "20px" }}>
      <button
        onClick={() => {
          Test();
        }}
      >
        Test
      </button>
      <h2>User List</h2>
      <DetailsList
        items={users}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
  //#endregion
};

export default UDUser;
