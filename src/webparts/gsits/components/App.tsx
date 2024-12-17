import * as React from "react";
import AppContext from "../../../AppContext";
import { Provider } from "react-redux";
import store from "../../../store";
import styles from "./App.module.scss";
import "./App.css";
import type { IGsitsProps } from "./IGsitsProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import {
  NavLink,
  HashRouter as Router,
} from "react-router-dom";
import { Spinner } from "@fluentui/react";
import Routes from "./router";
import LanguageToggle from "./common/LanguageToggle";
import SplashScreen from "./SplashScreen";

interface IGsitsStates{
  hasShownSplash:boolean
}
export default class Gsits extends React.Component<IGsitsProps,IGsitsStates> {
  constructor(props:IGsitsProps){
    super(props);
    this.state={
      hasShownSplash:false
    }
  }
  render(): React.ReactElement<IGsitsProps> {
    const { hasTeamsContext, context } = this.props;
    
    const handleSplashEnd = (): void => {
      this.setState((prevState)=>({hasShownSplash:true}));
    };

    if (!this.state.hasShownSplash) {
      return <SplashScreen onEnd={handleSplashEnd} />;
    }
    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
          <Router>
            <section
              className={`${styles.gsits} ${hasTeamsContext ? styles.teams : ""
                }`}
            >
              <nav className={styles.nav}>
                <ul>
                  <li>
                    <NavLink
                      to="/requisition"
                      className={({ isActive }) =>
                        isActive ? styles.active : ""
                      }
                    >
                      New Part Requisition
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pricechange"
                      className={({ isActive }) =>
                        isActive ? styles.active : ""
                      }
                    >
                      Price Change Request
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rfq"
                      className={({ isActive }) =>
                        isActive ? styles.active : ""
                      }
                    >
                      RFQ & QUOTE
                    </NavLink>
                  </li>
                </ul>
                <div className={styles.toggleContainer}>
                  <LanguageToggle />
                </div>
              </nav>
              <div className={styles.contentMain}>
                <React.Suspense fallback={<Spinner label="Loading..." />}>
                  <Routes />
                </React.Suspense>
              </div>
            </section>
          </Router>
        </Provider>
      </AppContext.Provider>
    );
  }
}
