import { Logger, LogLevel } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import { CONST } from "../config/const";
import { MESSAGE } from "../config/message";
import { IUDGSAttachmentFormModel } from "../model-v2/udgs-attachment-model";
import { getSP } from "../pnpjsConfig";

export async function postAttachments(
  arg: IUDGSAttachmentFormModel
): Promise<void> {
  try {
    const sp = spfi(getSP());
    const folderPath = `${arg.FolderName}/${arg.SubFolderName}`;
    const folder = await sp.web
      .getFolderByServerRelativePath(folderPath)
      .select("Exists")();
    if (!folder.Exists) {
      await sp.web.folders.addUsingPath(folderPath);
    }
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
  } catch (err) {
    Logger.write(
      `${CONST.LOG_SOURCE} (_postAttachments) - ${JSON.stringify(err)}`,
      LogLevel.Error
    );
    return Promise.reject(MESSAGE.retrieveDataFailed);
  }
}
