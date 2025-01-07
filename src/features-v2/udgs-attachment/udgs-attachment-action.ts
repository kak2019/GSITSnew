import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey, CONST } from "../../config/const";
import { MESSAGE } from "../../config/message";
import { getSP } from "../../pnpjsConfig";
import {
  IUDGSAttachmentCreteriaModel,
  IUDGSAttachmentFormModel,
  IUDGSAttachmentGridModel,
} from "../../model-v2/udgs-attachment-model";

//#region actions
export const getAttachmentsAction = createAsyncThunk(
  `${FeatureKey.ATTACHMENTS}/getAttachments`,
  async (
    arg: IUDGSAttachmentCreteriaModel
  ): Promise<IUDGSAttachmentGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const siteUrl = window.location.origin;
      const fileInfos = await sp.web
        .getFolderByServerRelativePath(`${arg.FolderName}/${arg.SubFolderName}`)
        .files();
      if (arg.IsDataNeeded) {
        const attachments = await Promise.all(
          fileInfos.map(async (fileInfo) => {
            const file = await sp.web
              .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
              .getBlob();              
            return {
              FileItem: new File([file], fileInfo.Name, { type: file.type }),
              FileID: fileInfo.UniqueId,
              URL: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
              Name: fileInfo.Name,
              UploadTime: fileInfo.TimeCreated,
            } as IUDGSAttachmentGridModel;
          })
        );
        return attachments;
      }
      return fileInfos.map((fileInfo) => {
        return {
          URL: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
          FileID: fileInfo.UniqueId,
          Name: fileInfo.Name,
        } as IUDGSAttachmentGridModel;
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getAttachments) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const postAttachmentsAction = createAsyncThunk(
  `${FeatureKey.ATTACHMENTS}/postAttachments`,
  async (
    arg: IUDGSAttachmentFormModel
  ): Promise<IUDGSAttachmentGridModel[]> => {
    const sp = spfi(getSP());
    try {
      const folderPath = `${arg.FolderName}/${arg.SubFolderName}`;
      const folder = await sp.web
        .getFolderByServerRelativePath(folderPath)
        .select("Exists")();
      if (!folder.Exists) {
        await sp.web.folders.addUsingPath(folderPath);
      }
      const updateData = async (): Promise<void> => {
        const addFilePromises: Promise<string>[] = [];
        const removeFilePromises: Promise<string>[] = [];
        if (arg.NewFileItems) {
          arg.NewFileItems.forEach((newFileItem) => {
            const reader = new FileReader();
            const addFilePromise = new Promise<string>((resolve, reject) => {
              reader.onloadend = async () => {
                try {
                  const arrayBuffer = reader.result as ArrayBuffer;
                  await sp.web
                    .getFolderByServerRelativePath(
                      `${arg.FolderName}/${arg.SubFolderName}`
                    )
                    .files.addUsingPath(newFileItem.name, arrayBuffer);
                  resolve("Ok");
                } catch (error) {
                  reject(error);
                }
              };
              reader.readAsArrayBuffer(newFileItem);
            });
            addFilePromises.push(addFilePromise);
          });
        }
        if (arg.RemoveFileIDs) {
          arg.RemoveFileIDs.forEach(async (FileID) => {
            const removeFilePromise = sp.web.getFileById(FileID).recycle();
            removeFilePromises.push(removeFilePromise);
          });
        }
        await Promise.all([...addFilePromises, ...removeFilePromises]);
      };
      const result = await updateData().then(async () => {
        const siteUrl = window.location.origin;
        const fileInfos = await sp.web
          .getFolderByServerRelativePath(
            `${arg.FolderName}/${arg.SubFolderName}`
          )
          .files();
        const attachments = await Promise.all(
          fileInfos.map(async (fileInfo) => {
            const file = await sp.web
              .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
              .getBlob();
            return {
              FileItem: new File([file], fileInfo.Name, {
                type: file.type,
              }),
              FileID: fileInfo.UniqueId,
              URL: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
              Name: fileInfo.Name,
              UploadTime: fileInfo.TimeCreated,
            } as IUDGSAttachmentGridModel;
          })
        );
        return attachments;
      });
      return result;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_postAttachments) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
//#endregion
//#region methods
//#endregion
