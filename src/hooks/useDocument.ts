import { useCallback } from "react";
import {
  getDocumentsAction,
  getRFQAttachmentsAction,
  initialUploadRFQAttachmentsAction,
  isFetchingSelector,
  itemsSelector,
  messageSelector,
  readAllFilesSizeAction,
  rfqAttachmentsSelector,
  updateTitlesAction,
} from "../features/documents";
import { DocumentsStatus, IFile, IRFQAttachment } from "../model/documents";
import { useAppDispatch, useAppSelector } from "./useApp";

type DocumentOperators = [
  isFetching: DocumentsStatus,
  items: IFile[],
  errorMessage: string,
  rfqAttachments: IRFQAttachment[],
  readAllFilesSize: () => void,
  updateTitles: (ids: number[]) => void,
  getDocuments: () => void,
  initialUploadRFQAttachments: (files: File[], rfqId: string) => void,
  getRFQAttachments: (rfqId: string) => void
];

export const useDocument = (): Readonly<DocumentOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const rfqAttachments = useAppSelector(rfqAttachmentsSelector);
  const items = useAppSelector(itemsSelector);
  const readAllFilesSize = useCallback(() => {
    return dispatch(readAllFilesSizeAction(items));
  }, [dispatch]);
  const updateTitles = useCallback(
    (ids: number[]) => {
      return dispatch(updateTitlesAction(ids));
    },
    [dispatch]
  );
  const getDocuments = useCallback(() => {
    return dispatch(getDocumentsAction(items));
  }, [dispatch]);
  const initialUploadRFQAttachments = useCallback(
    (files: File[], rfqId: string) => {
      return dispatch(initialUploadRFQAttachmentsAction({ files, rfqId }));
    },
    [dispatch]
  );
  const getRFQAttachments = useCallback(
    (rfqId: string) => {
      return dispatch(getRFQAttachmentsAction(rfqId));
    },
    [dispatch]
  );
  return [
    isFetching,
    items,
    errorMessage,
    rfqAttachments,
    readAllFilesSize,
    updateTitles,
    getDocuments,
    initialUploadRFQAttachments,
    getRFQAttachments,
  ] as const;
};
