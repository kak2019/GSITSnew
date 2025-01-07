import * as React from 'react';
import { Persona, PersonaSize, TooltipHost } from '@fluentui/react';
import AppContext from '../../../../AppContext';
import { useUser } from '../../../../hooks';

interface IProfilePicProps {
    loginName?: string;
    displayName?: string;
    getUserProfileUrl?: () => Promise<string>;
}

const RenderProfilePicture: React.FC<IProfilePicProps> = (props: IProfilePicProps) => {

    const [profileUrl, setProfileUrl] = React.useState<string>();
    const { displayName, getUserProfileUrl } = props;
    const ctx = React.useContext(AppContext);
    const { displayName: cDispalyName, email } = ctx?.context?._pageContext?._user || {};
    const user = useUser();

    React.useEffect(() => {
        if (getUserProfileUrl)
            getUserProfileUrl().then(url => {
                setProfileUrl(url);
            }, _ => _);
        else
            user.getUserPicture('').then(([userPicture]) => {
                setProfileUrl(userPicture);
            }, _ => _);


    }, [props])

    return (
        <TooltipHost content={`${displayName || cDispalyName} (${email})`}
            calloutProps={{ gapSpace: 0 }}
            styles={{
                root: {
                    display: 'inline-block',
                    overflow: 'hidden'
                }
            }}
        >
            <Persona
                imageUrl={profileUrl}
                size={PersonaSize.size32}
                imageAlt="User Avatar"
                styles={{
                    primaryText: { display: 'none' },
                    details: {
                        display: 'none',
                    }
                }}
            />
        </TooltipHost>
    );
}
export default RenderProfilePicture;