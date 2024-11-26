import * as React from 'react';
import { AppInsightsService } from '../../../../config/AppInsightsService';

const PageNotFound: React.FC = () => {
    React.useEffect(()=>{
        AppInsightsService.aiInstance.trackEvent({ name: 'error running router', properties: { error:"Page Not Found" } });
    },[])
    return (
    <div>
        <h2>Page Not Found234</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
    </div>
)
}

export default PageNotFound;