import { ApplicationInsights, ITelemetryItem, Snippet, SeverityLevel } from '@microsoft/applicationinsights-web';
import jsSHA from 'jssha';

//docs: https://github.com/microsoft/ApplicationInsights-JS

export class AppInsightsService {
    
    private constructor() {}

    public static aiInstance: ApplicationInsights;

    public static InitializeInstance(appName?: string, aikey?: string, currentUser?: string): void {
        const appInsights = new ApplicationInsights(<Snippet>{
            config: {
                instrumentationKey: aikey,
                disableFetchTracking: false,        
                disableAjaxTracking: false,         
                maxBatchInterval: 0,
                enableAutoRouteTracking: true,
                namePrefix: appName
            }
        });

        appInsights.loadAppInsights();
        
        const hash = new jsSHA('SHA-256', 'TEXT');
        hash.update(currentUser || '');
        appInsights.setAuthenticatedUserContext(hash.getHash('HEX'));
        
        appInsights.addTelemetryInitializer( (envelope: ITelemetryItem) => {
            const isGetOrPostCall = envelope.baseType === 'RemoteDependencyData';
          const callingUdSharePoint = envelope.baseData && envelope.baseData.target && envelope.baseData.target.startsWith('https://udtrucks.sharepoint.com');

          if (isGetOrPostCall && !callingUdSharePoint)
                return false;
        });

        appInsights.addTelemetryInitializer( (envelope: ITelemetryItem) => {
            if(envelope.data){
                envelope.data.app_name = appName;
            }            
        });

        this.aiInstance = appInsights;

        this.aiInstance.trackTrace({
            message: 'the application is loaded',
            severityLevel: SeverityLevel.Information
        });
    }
}
