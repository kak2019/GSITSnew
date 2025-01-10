import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSAttachmentGridModel } from "../model-v2/udgs-attachment-model";
import { getSP } from "../pnpjsConfig";

export async function getAttachments(
  folderName: string,
  subFolderName: string,
  isDataNeeded: boolean
): Promise<IUDGSAttachmentGridModel[]> {
  try {
    const sp = spfi(getSP());
    const siteUrl = window.location.origin;
    const fileInfos = await sp.web
      .getFolderByServerRelativePath(`${folderName}/${subFolderName}`)
      .files();
    if (isDataNeeded) {
      const attachments = await Promise.all(
        fileInfos.map(async (fileInfo) => {
          const file = await sp.web
            .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
            .getBlob();
          const fileItem = await sp.web
            .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
            .getItem();
          const fileItemData = await fileItem
            .select("Author/Title")
            .expand("Author")();
          return {
            FileItem: new File([file], fileInfo.Name, { type: file.type }),
            FileID: fileInfo.UniqueId,
            URL: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
            Name: fileInfo.Name,
            UploadTime: fileInfo.TimeCreated,
            CreatedBy: fileItemData.Author.Title,
          } as IUDGSAttachmentGridModel;
        })
      );
      return attachments;
    } else {
      const attachments = await Promise.all(
        fileInfos.map(async (fileInfo) => {
          const fileItem = await sp.web
            .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
            .getItem();
          const fileItemData = await fileItem
            .select("Author/Title")
            .expand("Author")();
          return {
            FileID: fileInfo.UniqueId,
            URL: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
            Name: fileInfo.Name,
            UploadTime: fileInfo.TimeCreated,
            CreatedBy: fileItemData.Author.Title,
          } as IUDGSAttachmentGridModel;
        })
      );
      return attachments;
    }
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_getAttachments) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
}
