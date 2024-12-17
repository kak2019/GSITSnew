import * as React from 'react'
import {
    Route,
    Routes,
    Navigate,
    Outlet,
} from "react-router-dom";
import Requisition from "../Requisition";
import RFQ from "../RFQ";
import PageNotFound from "../PageNotFound";
import UDUser from "../UDUser";
import CreateRFQ from "../CreateRFQ";
import DemoForm from "../UIDemo/DemoForm";
import QuotationPage from "../QuotationPage";
import PriceBreakDown from "../PriceBreakDown";
import PriceChangeRequest from '../PriceChange';
import PriceChangeRequestDetail from "../PriceChangeRequestDetail";

const GSITSRoutes: React.FC = () => {

    return (
        <Routes>
            <Route path="/requisition" element={<Outlet />} >
                <Route index element={<Requisition />} />
                <Route path="create-rfq" element={<CreateRFQ />} />
            </Route>
            <Route path="/rfq" element={<Outlet />} >
                <Route index element={<RFQ />} />
                <Route path="quotation" element={<Outlet />} >
                    <Route index element={<QuotationPage />} />
                    <Route path="price-breakdown" element={<PriceBreakDown />} />
                </Route>
            </Route>
            <Route path="/pricechange" element={<Outlet />} >
                <Route index element={<PriceChangeRequest />} />
                <Route path="detail" element={<Outlet />} >
                    <Route index element={<PriceChangeRequestDetail />} />
                </Route>
            </Route>
            {/* 传递 userType */}
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Navigate to="/rfq" />} />
            <Route path="/role" element={<UDUser />} />
            <Route path="/demo" element={<DemoForm />} />
        </Routes>
    )
}
export default GSITSRoutes;
