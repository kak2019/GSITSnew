import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import {
    getGraph,
    getSP
} from '../pnpjsConfig';
import "@pnp/graph/users";
import { spfi } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';

type UseUser = {
    getUserIDCode: (identifier: string) => Promise<string>,
    getUserType: (identifier: string) => Promise<string>,
    getUserSupplierId: (identifier: string) => Promise<string>,
    getUserPicture: (userId: string) => Promise<Readonly<UserOperators>>,
};
type UserOperators = [userPicture: string];

export function useUser(): UseUser {

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
    async function getUserType(identifier: string):Promise<string> {
        try {   
            const graph=getGraph();
            const filter = identifier.includes('@') ? `mail eq '${identifier}'` : `userPrincipalName eq '${identifier}'`;
            const response=await graph.users.filter(filter).select('userType')();
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
        return [userPicture] as const;
    }
    return {
        getUserIDCode,
        getUserType,
        getUserSupplierId,
        getUserPicture,
    };
}