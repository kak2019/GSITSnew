import { configureStore } from "@reduxjs/toolkit";
import { documentsReducer } from "./features/documents";
import { requisitionsReducer } from "./features/requisitions";
import { rfqsReducer } from "./features/rfqs/reducer";
import { userRolesReducer } from "./features/userRoles";
import { quotationsReducer } from "./features/quotations";
import { udgsRFQsReducer } from "./features-v2/udgs-rfq";
import { udgsQuotationsReducer } from "./features-v2/udgs-quotation";
import { priceChangeReducer } from "./features/priceChange";
import { eNegotiationReducer } from "./features/eNegotiation";
import { udgsPartsReducer } from "./features-v2/udgs-part";
import { udgsActionlogsReducer } from "./features-v2/udgs-actionlog";
import { udgsSupplierRequestsReducer } from "./features-v2/udgs-supplierrequest";
import { UDGSAttachmentsReducer } from "./features-v2/udgs-attachment";
import { udgsUsersReducer } from "./features-v2/udgs-user/udgs-user-reducer";

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    requisitions: requisitionsReducer,
    rfqs: rfqsReducer,
    userRoles: userRolesReducer,
    quotations: quotationsReducer,
    udgsRFQs: udgsRFQsReducer,
    udgsQuotations: udgsQuotationsReducer,
    udgsParts: udgsPartsReducer,
    udgsActionlogs: udgsActionlogsReducer,
    udgsAttachments: UDGSAttachmentsReducer,
    udgsUsers: udgsUsersReducer,
    udgsSupplierRequests: udgsSupplierRequestsReducer,
    priceChange: priceChangeReducer,
    eNegotiation: eNegotiationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
