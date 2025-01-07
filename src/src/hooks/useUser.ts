import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import {
    getAADClient,
    getGraph,
    getSP
} from '../pnpjsConfig';
import { AadHttpClient } from '@microsoft/sp-http';
import "@pnp/graph/users";
import { spfi } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { IGPSUser, ISupplierHostBuyerMapping } from '../model/user';
import { CONST } from '../config/const';
import { AppContextProps } from '../AppContext';

type UseUser = {
    getUserEmail:(ctx:AppContextProps | undefined)=>string,
    getUserIDCode: (identifier: string) => Promise<string>,
    getUserType: (identifier: string) => Promise<string>,
    getUserSupplierId: (identifier: string) => Promise<string>,
    getGPSUser: (email: string) => Promise<IGPSUser | undefined>,
    getUserPicture: (userId: string) => Promise<Readonly<UserOperators>>,
    getSupplierHostBuyerMapping: (parmaId: string) => Promise<ISupplierHostBuyerMapping | undefined>,
};
type UserOperators = [userPicture: string];

export function useUser(): UseUser {
    function getUserEmail(ctx:AppContextProps | undefined):string {

            let userEmail='';
            try {
                
                if (!ctx || !ctx.context) {
                    throw new Error("AppContext is not provided or context is undefined");
                } else {
                    userEmail = ctx.context._pageContext._user.email;
                }
            }
            catch (error)
            {
                Logger.write(`Fetch user email error: ${error}`, LogLevel.Error);
            }
            return userEmail;

    }
    //graph functiton logic will go here for UserIDCode :EX133xx
    async function getUserIDCode(identifier: string): Promise<string> {
        try {
            const graph = getGraph();
            const filter = identifier.includes('@') ? `mail eq '${identifier}'` : `userPrincipalName eq '${identifier}'`;
            const response = await graph.users.filter(filter).select('onPremisesSamAccountName')();
            if (response.length > 0) {
                return response[0].onPremisesSamAccountName || '';
            } else {
                Logger.write(`No onPremisesSamAccountName found for ${identifier}`, LogLevel.Error);
                return '';
            }
        } catch (error) {
            Logger.write(`No UserIDCode found ${error}`, LogLevel.Error);
            return '';
        }
    }
    async function getUserType(identifier: string): Promise<string> {
        try {
            const graph = getGraph();
            const filter = identifier.includes('@') ? `mail eq '${identifier}'` : `userPrincipalName eq '${identifier}'`;
            const response = await graph.users.filter(filter).select('userType')();
            if (response.length > 0) {
                return response[0].userType || 'Unknown';
            } else {
                Logger.write(`No UserType found for ${identifier}`, LogLevel.Error);
                return 'Unknown';
            }
        } catch (error) {
            Logger.write(`No UserType found ${error}`, LogLevel.Error);
            return 'Unknown';
        }
    }
    //Extension attribute 
    //{"extensionAttribute1":"ETJ103","extensionAttribute2":"UD Trucks","extensionAttribute3":null,"extensionAttribute4":"Employee","extensionAttribute5":"a437311","extensionAttribute6":"howard.qin@udtrucks.com","extensionAttribute7":"3E64A65AEAF91C4C84D35A5877241991","extensionAttribute8":null,"extensionAttribute9":"Low Code& Mobility","extensionAttribute10":"China","extensionAttribute11":"UD Trucks","extensionAttribute12":null,"extensionAttribute13":"ID:77414EEBE099274FB8F394701654A157/CF:/A:{3D98DC35-4F80-4deb-B8AD-37C8950CD514}_INACTIVE","extensionAttribute14":null,"extensionAttribute15":"CN23"}
    async function getUserSupplierId(identifier: string): Promise<string> {
        try {
            const graph = getGraph();

            const filter = identifier.includes('@') ? `mail eq '${identifier}'` : `userPrincipalName eq '${identifier}'`;

            const response = await graph.users.filter(filter).select('id', 'displayName', 'mail', 'userPrincipalName', 'onPremisesExtensionAttributes')();
            console.log(JSON.stringify(response));
            if (response.length > 0) {
                const extensionAttributes = response[0].onPremisesExtensionAttributes;
                return extensionAttributes?.extensionAttribute5 || '';
            } else {
                Logger.write(`No SupplierId found for ${identifier}`, LogLevel.Error);
                return '';
            }
        } catch (error) {
            Logger.write(`Error fetching SupplierId for ${identifier}: ${error}`, LogLevel.Error);
            return '';
        }
    }
    async function getGPSUser(userEmail: string): Promise<IGPSUser | undefined> {
        try {
            const client = getAADClient();
            const functionUrl = `${CONST.azureFunctionBaseUrl}/api/GetGPSUser/${userEmail}`;

            const response = await client.get(
                functionUrl,
                AadHttpClient.configurations.v1
            );
            const result = await response.json();
            //console.log(result);
            if (result && result.role && result.name && result.sectionCode && result.handlercode) {
                return {
                    role: result.role,
                    name: result.name,
                    sectionCode: result.sectionCode,
                    handlercode: result.handlercode,
                    porg: result.porg
                } as IGPSUser;
            } 
            return undefined;
        } catch (error) {
            Logger.write(`No GPSUser found ${error}`, LogLevel.Error);
            return undefined;
        }
    }
    async function getUserPicture(userId: string): Promise<Readonly<UserOperators>> {
        let userPicture = '';
        let userInfo: ISiteUserInfo;
        if (userId) {
            try {
                const sp = spfi(getSP());
                const r = await sp.web.getUserById(+userId)();
                userInfo = { ...r };
                const propertyName = "PictureURL";
                userPicture = await sp.profiles.getUserProfilePropertyFor(userInfo.LoginName, propertyName);
            }
            catch (error) {
                Logger.write(`No UserPicture found ${error}`, LogLevel.Error);
            }
        }
        else
        {
            try {
                const sp = spfi(getSP());
                const profile = await sp.profiles.userProfile;
                userPicture=profile?.PictureUrl || '';
            }
            catch (error) {
                Logger.write(`No UserPicture found ${error}`, LogLevel.Error);
            }
        }
        return [userPicture] as const;
    }
    async function getSupplierHostBuyerMapping(
        parmaId: string
    ): Promise<ISupplierHostBuyerMapping | undefined> {
        const sp = spfi(getSP());
        const response = await sp.web.lists
        .getByTitle(CONST.LIST_NAME_SUPPLIERHOSTBUYERMAPPING)
        .renderListDataAsStream({
            ViewXml: `<View>
                        <Query>
                                <Where>
                                <Eq>
                                    <FieldRef Name="PARMANbr"/>
                                    <Value Type="Text">${parmaId}</Value>
                                </Eq>
                            </Where>
                            <OrderBy>
                                <FieldRef Name="ID" Ascending="FALSE" />
                            </OrderBy>
                        </Query>
                    </View>`,
        });
        if (response && response.Row && response.Row.length) {
            return {
                PARMANbr: response.Row[0].PARMANbr,
                PARMANm: response.Row[0].PARMANm,
                SupplierHostPorg: response.Row[0].SupplierHostPorg,
                SupplierHostCd: response.Row[0].SupplierHostCd,
                SupplierHostName: response.Row[0].SupplierHostName,
            } as ISupplierHostBuyerMapping;
        } else {
            return Promise.reject();
        }
    }
    return {
        getUserEmail,
        getUserIDCode,
        getUserType,
        getUserSupplierId,
        getGPSUser,
        getUserPicture,
        getSupplierHostBuyerMapping
    };
}