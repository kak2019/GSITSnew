import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AadHttpClient } from '@microsoft/sp-http';
import { LogLevel, PnPLogging } from '@pnp/logging';
import { Telemetry, ISPFXContext, spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/batching";
import { CONST } from './config/const';

let _sp: SPFI;
let _graph: GraphFI;
let _aadClient: AadHttpClient;
export const getSP = (context?: WebPartContext): SPFI => {
    if (_sp === undefined || _sp === null) {
        _sp = spfi().using(spSPFx(context as ISPFXContext)).using(Telemetry()).using(PnPLogging(LogLevel.Warning));
    }
    return _sp;
}

export const getGraph = (context?: WebPartContext): GraphFI => {
    if (_graph === undefined || _graph === null) {
        _graph = graphfi("https://graph.microsoft.com/beta").using(graphSPFx(context as ISPFXContext)).using(Telemetry()).using(PnPLogging(LogLevel.Warning));
        
    }
    return _graph;
}

export const getAADClient = (context?: WebPartContext): AadHttpClient => {
    if (!!context) {
        context.aadHttpClientFactory
            .getClient(CONST.aadClientId)
            .then((client: AadHttpClient) => {
                _aadClient = client;
            })
            .catch(_ => _);
    }
    return _aadClient;
}