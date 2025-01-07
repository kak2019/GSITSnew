import { IENegotiationRequest } from "../../model/eNegotiation";

export enum ENegotiationRequestStatus {
  Idle,
  Loading,
  Failed,
}

export interface IENegotiationRequestStatusState {
  status: ENegotiationRequestStatus;
  message: string;
  eNegotiationRequestList: IENegotiationRequest[];
}

export const initialState: IENegotiationRequestStatusState = {
  status: ENegotiationRequestStatus.Idle,
  message: "",
  eNegotiationRequestList: [],
};
