import { configureStore } from "@reduxjs/toolkit";
import { userRolesReducer } from "./features/userRoles";
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
    userRoles: userRolesReducer,
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
