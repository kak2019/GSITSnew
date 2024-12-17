import { IShimmerStyleProps, IShimmerStyles, mergeStyleSets, Shimmer } from "@fluentui/react";
import * as React from "react";
import { useEffect } from "react";

interface SplashScreenProps {
    onEnd: () => void;
}
const classNames = mergeStyleSets({
    wrapper: {
      selectors: {
        '& > .ms-Shimmer-container': {
          margin: '10px 0',
        },
      },
    }
});
const getShimmerStyles = (props: IShimmerStyleProps): IShimmerStyles => {
    return {
        shimmerWrapper: [
            {
                backgroundColor: '#deecf9',
            },
        ],
        shimmerGradient: [
            {
                backgroundColor: '#deecf9',
                backgroundImage:
                    'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #c7e0f4 50%, rgba(255, 255, 255, 0) 100%)',
            },
        ],
    };
};
const delay = (ms: number): Promise<NodeJS.Timeout> => {
    return new Promise(resolve => {
        const timer: NodeJS.Timeout = setTimeout(() => resolve(timer), ms);
    });
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnd }) => {
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const showSplashScreen = async (): Promise<void> => {
            timer = await delay(2000);
            onEnd();
        };

        showSplashScreen().then(_ => _, _ => _);

        return () => clearTimeout(timer);
    }, [onEnd]);

    return (
        <div className={classNames.wrapper}>
            <Shimmer width="65%" styles={getShimmerStyles} />
            <Shimmer width="85%" styles={getShimmerStyles} />
            <Shimmer width="75%" styles={getShimmerStyles} />
            <Shimmer width="85%" styles={getShimmerStyles} />
            <Shimmer styles={getShimmerStyles} />           
        </div>
    );
};
export default SplashScreen;