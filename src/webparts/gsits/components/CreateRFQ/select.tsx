/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  Checkbox,
  Stack,
  IconButton,
  mergeStyleSets,
  TextField
} from '@fluentui/react';
import { getAADClient } from '../../../../pnpjsConfig';
import { AadHttpClient } from '@microsoft/sp-http';
import { CONST } from '../../../../config/const';
import { useContext, useEffect, useState } from "react";
import { Logger, LogLevel } from "@pnp/logging";
import { useUser } from "../../../../hooks";
import AppContext from "../../../../AppContext";

const classes = mergeStyleSets({
  areaBox: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  uploadArea: {
    flexGrow: 1,
    border: '2px dashed #0078d4',
    padding: '10px 0',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f3f9fc',
  },
  fileList: {
    marginTop: '10px',
    position: 'relative',
    height: '175px',
    overflow: 'hidden',
    overflowY: 'auto',
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
  title: {
    fontWeight: 'bold'
  }
});
interface SupplierSelectionProps {
  parma?: {parma: string};
  onContactsChange?: (contacts: { name: string; email: string; title?: string; functions?: string }[]) => void;
}
const SupplierSelection: React.FC<SupplierSelectionProps> = ({onContactsChange, parma}) => {
  const [contacts, setContacts] = useState<(null | { name: string; email: string;title?:string;functions?:string })[]>(Array(5).fill(null));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set());
  const [unSelectedSuppliers, setUn] = useState<any[]>([]);
  const [modalOpen, setOpen] = useState<boolean>(false);
  const [createState, setState] = useState<any>({});
  const [hideDialog, setHideDialog] = useState(true);
  const [dialogProps, setTip] = useState({
    type: DialogType.normal,
    title: 'Warning',
    subText: 'tip'
  });

  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [currentUserIDCode, setCurrentUserIDCode] = useState<string>('');
  const ctx = useContext(AppContext);
  const { getUserIDCode } = useUser(); // 使用 useUser 钩子

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchUserInfo = async () => {
      if (!ctx || !ctx.context) {
        Logger.write("AppContext is not provided or context is undefined", LogLevel.Error);
        return;
      }
      try {
        const userEmail = ctx.context._pageContext._user.email;
        const userIDCode = await getUserIDCode(userEmail);
        setCurrentUserIDCode(userIDCode);
      } catch (error) {
        Logger.write(`Failed to fetch user info: ${error}`, LogLevel.Error);
      }
    };
    fetchUserInfo().then(_ => _, _ => _);
  }, [ctx, getUserIDCode]);



  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchSuppliers = async (form?: { parma: string; }) => {
    console.log(form,"parma")
    if (!currentUserIDCode) return; // Confirm we have user ID code
    if (form){
      try {
        const client = getAADClient();
        const response = await client.get(`${CONST.azureFunctionBaseUrl}/api/GetContact/${form.parma}`, AadHttpClient.configurations.v1);
        const result = await response.json();
        console.log(result,"re");
        setSupplierData(result); // 使用API返回的数据更新supplierData
        setUn(result); // 更新未选中的供应商列表
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }}
  };
  useEffect(() => {
    if (parma?.parma) {
      fetchSuppliers(parma).then(
          _ => {
            // 明确的处理逻辑，例如记录日志或更新状态
            console.log('Fetch succeeded:', _);
          },
          error => {
            // 处理错误
            console.error('Fetch failed:', error);
          }
      );
    }
  }, [parma?.parma]);
  useEffect(() => {
    if (parma?.parma) {
      fetchSuppliers(parma).then(
          _ => {
            // 明确的处理逻辑，例如记录日志或更新状态
            console.log('Fetch succeeded:', _);
          },
          error => {
            // 处理错误
            console.error('Fetch failed:', error);
          }
      );
    }
  }, [parma?.parma]);

  const toggleHideDialog = (): void => {
    setHideDialog(!hideDialog);
  };

  const toggleSupplierSelection = (email: string): void => {
    setSelectedSuppliers((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(email)) {
        newSelection.delete(email);
      } else {
        newSelection.add(email);
      }
      return newSelection;
    });
  };

  const checkFive = ():boolean => {
    const num = contacts.filter(val => !!val?.email);
    if (num.length === 5) {
      setTip({
        ...dialogProps,
        subText: 'Maximum 5 contact can be selected or added, please re-select'
      });
      setHideDialog(false);
      return true;
    }
    return false;
  };

  const handleSelect = (): void => {
    if (checkFive()) return;
    const selectedContacts = supplierData.filter(supplier => selectedSuppliers.has(supplier.email));
    if (selectedContacts.length > 5) {
      setTip({
        ...dialogProps,
        subText: 'Up To 5'
      });
      setHideDialog(false);
      return;
    }
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      selectedContacts.forEach((contact, index) => {
        if (index < newContacts.length) {
          newContacts[index] = { name: contact.name, email: contact.email, title: contact.title, functions: contact.functions };
        }
      });
      return newContacts;
    });
    // 通知父组件更新联系人
    if (onContactsChange) {
      onContactsChange(selectedContacts);
    }
    setIsOpen(false);
  };

  const handleRemoveContact = (index: number): void => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      newContacts[index] = null;
      if (onContactsChange) {
        onContactsChange(newContacts as any);
      }
      return newContacts;
    });
  };

  const columns = [
    {
      key: 'column1',
      name: '',
      fieldName: 'select',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item: any) => (
          <Checkbox
              checked={selectedSuppliers.has(item.email)}
              onChange={() => toggleSupplierSelection(item.email)}
          />
      ),
    },
    { key: 'column2', name: 'Name', fieldName: 'name', minWidth: 100 },
    { key: 'column3', name: 'Email', fieldName: 'email', minWidth: 150 },
    { key: 'column4', name: 'Title', fieldName: 'title', minWidth: 150 },
    { key: 'column5', name: 'Functions', fieldName: 'functions', minWidth: 150 },
  ];

  const handleAddContacts = (): void => {
    setIsOpen(true);
  };

  const handleOpenCreate = (): void => {
    if (checkFive()) return;
    setOpen(true);
  };

  const closeDialog = (): void => {
    setOpen(false);
  };

  const handleAdd = (): void => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      for (let i = 0; i < newContacts.length; i++) {
        if (newContacts[i]=== null) {
          newContacts[i] = {
            name: createState.name,
            email: createState.email,
            title: createState.title||"",
            functions: createState.functions||"",
          };
          break;
        }
      }
      if (onContactsChange) {
        onContactsChange(newContacts as any);
      }
      return newContacts;
    });
    // 清空 createState
    setState({
      name: "",
      email: "",
      title: "",
      functions: "",
    });
    closeDialog();
  };

  return (
      <Stack>
        <span className={classes.title}>Supplier Contact *</span>
        <div className={classes.areaBox}>
          <div className={classes.uploadArea} onClick={handleAddContacts}>
            <span style={{ fontWeight: 'bold' }}>+ Click to Select</span>
            <span> (up to 5)</span>
          </div>
          {/*<div className={classes.uploadArea} onClick={fetchSuppliers}>*/}
          {/*  <span style={{ fontWeight: 'bold' }}>+ Fetch Supplier Data</span> /!* 新增的按钮，点击后执行fetchSuppliers *!/*/}
          {/*</div>*/}
          <div className={classes.uploadArea} onClick={handleOpenCreate}>
            <span style={{ fontWeight: 'bold' }}>+ Click to Create New</span>
          </div>
        </div>

        <Stack className={classes.fileList}>
          {contacts.map((contact, index) => (
              <div key={index} className={`${classes.fileItem} ${index % 2 === 0 ? classes.evenItem : classes.oddItem}`}>
                {contact ? (
                    <>
                      <span>{contact.name} - {contact.email} - {contact.title} - {contact.functions} </span>
                      <IconButton
                          iconProps={{ iconName: 'Delete' }}
                          onClick={() => handleRemoveContact(index)}
                      />
                    </>
                ) : (
                    <span />
                )}
              </div>
          ))}
        </Stack>

        <Dialog
            hidden={!isOpen}
            onDismiss={() => setIsOpen(false)}
            dialogContentProps={{
              type: DialogType.normal,
              title: 'Supplier Selection',
            }}

            modalProps={{
              isBlocking: true,
            }}
            maxWidth={800}
        >
          <Stack style={{ marginBottom: 10 }}>
            <TextField placeholder="Search for a name or create a new one" onChange={(val: any) => {
              if (val.target.value) {
                setUn(supplierData.filter(item => item.name?.toLowerCase().includes(val.target.value.toLowerCase())));
              } else {
                setUn(supplierData);
              }
            }} style={{ width: '100%' }} />
          </Stack>
          <DetailsList
              items={unSelectedSuppliers}
              columns={columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={0} // Disable selection mode on DetailsList
              onRenderDetailsHeader={() => null}
          />
          <span>Note: Newly created contacts are temporary and will disappear when New Parts RFQ Creation is created or cancelled. Only name and email are needed for a new contact</span>
          <DialogFooter>
            <PrimaryButton onClick={handleSelect} text="Select" />
            {/*<DefaultButton onClick={() => setIsOpen(false)} text="Cancel" />*/}
          </DialogFooter>
        </Dialog>

        <Dialog
            hidden={!modalOpen}
            onDismiss={closeDialog}
            dialogContentProps={{
              type: DialogType.normal,
              title: 'Create New Contact',
            }}
            maxWidth={500}
        >
          <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
            <Stack.Item grow styles={{ root: { flexBasis: '40%', width: '50%' } }}>
              <TextField
                  label="Name"
                  required
                  value={createState.name}
                  onChange={(e, newValue) => setState({ ...createState, name: newValue })}
              />
            </Stack.Item>
            <Stack.Item grow styles={{ root: { flexBasis: '40%', width: '50%' } }}>
              <TextField
                  label="Email"
                  required
                  value={createState.email}
                  onChange={(e, newValue) => setState({ ...createState, email: newValue })}
              />
            </Stack.Item>
            <Stack.Item grow styles={{ root: { flexBasis: '40%', width: '50%' } }}>
              <TextField
                  label="Title"
                  value={createState.title}
                  onChange={(e, newValue) => setState({ ...createState, title: newValue })}
              />
            </Stack.Item>
            <Stack.Item grow styles={{ root: { flexBasis: '40%', width: '50%' } }}>
              <TextField
                  label="Function"
                  value={createState.functions}
                  onChange={(e, newValue) => setState({ ...createState, functions: newValue })}
              />
            </Stack.Item>
          </Stack>
          <p>Note: Newly created contacts are temporary and will disappear when New Parts RFQ Creation is created or cancelled.</p>
          <DialogFooter>
            <PrimaryButton onClick={handleAdd} disabled={!createState.name || !createState.email} text="Add" />
          </DialogFooter>
        </Dialog>

        <Dialog
            hidden={hideDialog}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogProps}
            modalProps={{
              isBlocking: false,
              styles: { main: { maxWidth: 450 } },
            }}
        >
          <DialogFooter>
            <PrimaryButton onClick={toggleHideDialog}  text="OK" />
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </Stack>
  );
};

export default SupplierSelection;
