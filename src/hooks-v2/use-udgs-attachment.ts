import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import {
  IUDGSAttachmentCreteriaModel,
  IUDGSAttachmentFormModel,
  IUDGSAttachmentGridModel,
} from "../model-v2/udgs-attachment-model";
import {
  currentAttachmentsSelector,
  getAttachmentsAction,
  isFetchingSelector,
  messageSelector,
  postAttachmentsAction,
} from "../features-v2/udgs-attachment";

type AttachmentOperators = [
  isFetching: boolean,
  errorMessage: string,
  currentAttachments: IUDGSAttachmentGridModel[],
  getAttachments: (
    arg: IUDGSAttachmentCreteriaModel
  ) => Promise<IUDGSAttachmentGridModel[]>,
  postAttachments: (
    actionlog: IUDGSAttachmentFormModel
  ) => Promise<IUDGSAttachmentGridModel[]>
];

export const useUDGSAttachment = (): Readonly<AttachmentOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const currentAttachments = useAppSelector(currentAttachmentsSelector);
  const getAttachments = useCallback(
    async (
      arg: IUDGSAttachmentCreteriaModel
    ): Promise<IUDGSAttachmentGridModel[]> => {
      const actionResult = await dispatch(getAttachmentsAction(arg));
      return actionResult.payload as IUDGSAttachmentGridModel[];
    },
    [dispatch]
  );
  const postAttachments = useCallback(
    async (
      arg: IUDGSAttachmentFormModel
    ): Promise<IUDGSAttachmentGridModel[]> => {
      const actionResult = await dispatch(postAttachmentsAction(arg));
      return actionResult.payload as IUDGSAttachmentGridModel[];
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    currentAttachments,
    getAttachments,
    postAttachments,
  ] as const;
};
