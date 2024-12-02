import { configureStore } from "@reduxjs/toolkit";
import { documentsReducer } from "./features/documents";
import { requisitionsReducer } from "./features/requisitions";
import { rfqsReducer } from "./features/rfqs/reducer";
import { userRolesReducer } from "./features/userRoles";
import { quotationsReducer } from "./features/quotations";

const store = configureStore({
  reducer: {
    documents: documentsReducer,
    requisitions: requisitionsReducer,
    rfqs: rfqsReducer,
    userRoles: userRolesReducer,
    quotations: quotationsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
