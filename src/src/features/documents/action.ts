import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONST, FeatureKey } from "../../config/const";
import { spfi } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import { getSP } from "../../pnpjsConfig";
import { IResponseItem, IFile, IAttachments } from "../../model/documents";
import { Logger, LogLevel } from "@pnp/logging";
import { MESSAGE } from "../../config/message";

// Truck function
export const readAllFilesSizeAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/readAllFilesSize`,
  async (oldItems: IFile[]) => {
    const sp = spfi(getSP());
    const spCache = sp.using(Caching({ store: "session" }));
    let newItems: IFile[] = [];
    let hasNext = true;
    let skip = 0;
    const pageSize = 1000;
    while (hasNext) {
      try {
        const response: IResponseItem[] = await spCache.web.lists
          .getByTitle(CONST.LIBRARY_NAME)
          .items.select("Id", "Title", "FileLeafRef", "File/Length")
          .expand("File")
          .top(pageSize)
          .skip(skip)();
        newItems = newItems.concat(
          response.map((item: IResponseItem) => {
            return {
              Id: item.Id,
              Title: item.Title || "Unknown",
              Size: item.File?.Length || 0,
              Name: item.FileLeafRef,
            };
          })
        );
        skip += pageSize;
        hasNext = response.length === pageSize;
      } catch (err) {
        hasNext = false;
        Logger.write(
          `${CONST.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)}`,
          LogLevel.Error
        );
        return Promise.reject(MESSAGE.retrieveDataFailed);
      }
    }
    const uniqueItems = Array.from(
      new Set(newItems.map((item) => item.Id))
    ).map((id) => newItems.find((item) => item.Id === id));
    return oldItems.concat(uniqueItems as IFile[]);
  }
);
export const updateTitlesAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/updateTitles`,
  async (ids: number[]) => {
    try {
      const sp = spfi(getSP());
      const [batchedSP, execute] = sp.batched();
      const updatedItems: IFile[] = [];
      const res: { Id: number; Title: string }[] = [];
      for (let i = 0; i < ids.length; i++) {
        const item: IResponseItem = await sp.web.lists
          .getByTitle(CONST.LIBRARY_NAME)
          .items.getById(ids[i])
          .select("Id", "Title", "FileLeafRef", "File/Length")
          .expand("File")();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        batchedSP.web.lists
          .getByTitle(CONST.LIBRARY_NAME)
          .items.getById(ids[i])
          .update({ Title: `${item.FileLeafRef}-Updated` })
          .then((r) => res.push(r))
          .catch((e) => Logger.write(`Error: ${e}`, LogLevel.Error));
        // res object only contains eTag of changed item.
        // Dirty update of UI
        item.Title = `${item.FileLeafRef}-Updated`;
        updatedItems.push({
          Id: item.Id,
          Title: item.Title || "Unknown",
          Size: item.File?.Length || 0,
          Name: item.FileLeafRef,
        });
      }

      await execute();
      return updatedItems;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_updateTitles) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      return Promise.reject(err);
    }
  }
);
export const getDocumentsAction = createAsyncThunk(
  `${FeatureKey.DOCUMENTS}/getDocuments`,
  async (oldItems: IFile[]) => {
    const sp = spfi(getSP());
    let newItems: IFile[] = [];
    let hasNext = true;
    let skip = 0;
    const pageSize = 1000;
    while (hasNext) {
      try {
        const response: IResponseItem[] = await sp.web.lists
          .getByTitle(CONST.LIBRARY_NAME)
          .items.select("Id", "Title", "FileLeafRef", "File/Length")
          .expand("File")
          .top(pageSize)
          .skip(skip)();

        newItems = newItems.concat(
          response.map((item: IResponseItem) => {
            return {
              Id: item.Id,
              Title: item.Title || "Unknown",
              Size: item.File?.Length || 0,
              Name: item.FileLeafRef,
            };
          })
        );
        skip += pageSize;
        hasNext = response.length === pageSize;
      } catch (err) {
        hasNext = false;
        Logger.write(
          `${CONST.LOG_SOURCE} (_getDemoItems) - ${JSON.stringify(err)}`,
          LogLevel.Error
        );
        return Promise.reject(MESSAGE.retrieveDataFailed);
      }
    }
    const uniqueItems = Array.from(
      new Set(newItems.map((item) => item.Id))
    ).map((id) => newItems.find((item) => item.Id === id));
    return oldItems.concat(uniqueItems as IFile[]);
  }
);
export const initialUploadRFQAttachmentsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/uploadFile`,
  async (arg: { files: File[]; rfqId: string }): Promise<void> => {
    const sp = spfi(getSP());
    try {
      await sp.web.folders.addUsingPath(
        `${CONST.LIBRARY_RFQATTACHMENTS_NAME}/${arg.rfqId}`
      );
      arg.files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          await sp.web
            .getFolderByServerRelativePath(
              `${CONST.LIBRARY_RFQATTACHMENTS_NAME}/${arg.rfqId}`
            )
            .files.addUsingPath(file.name, arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
      });
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_initialUploadRFQAttachments) - ${JSON.stringify(
          err
        )}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
export const getRFQAttachmentsAction = createAsyncThunk(
  `${FeatureKey.RFQS}/getRFQAttachments`,
  async (rfqId: string): Promise<IAttachments[]> => {
    const sp = spfi(getSP());
    try {
      const siteUrl = window.location.origin;
      const filesInfo = await sp.web
        .getFolderByServerRelativePath(
          `${CONST.LIBRARY_RFQATTACHMENTS_NAME}/${rfqId}`
        )
        .files();
      const files = await Promise.all(
        filesInfo.map(async (fileInfo) => {
          const file = await sp.web
            .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
            .getBlob();
          return {
            File: new File([file], fileInfo.Name, { type: file.type }),
            Url: `${siteUrl}${fileInfo.ServerRelativeUrl}`,
          };
        })
      );
      return files;
    } catch (err) {
      Logger.write(
        `${CONST.LOG_SOURCE} (_getRFQAttachments) - ${JSON.stringify(err)}`,
        LogLevel.Error
      );
      return Promise.reject(MESSAGE.retrieveDataFailed);
    }
  }
);
