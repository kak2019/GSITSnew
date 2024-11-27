import * as React from 'react';
import AppContext from '../../../AppContext';
import { Provider } from 'react-redux';
import store from '../../../store';
import styles from './App.module.scss';
import './App.css';
import type { IGsitsProps } from './IGsitsProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { NavLink, HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Spinner } from '@fluentui/react';
import Requisition from './Requisition';
import RFQ from './RFQ';
import PageNotFound from './PageNotFound';
import UDUser from './UDUser';
import LanguageToggle from './common/LanguageToggle';
import CreateRFQ from './CreateRFQ'
import DemoForm from './UIDemo/DemoForm';
import QuotationPage from "./QuotationPage";

export default class Gsits extends React.Component<IGsitsProps> {
  public render(): React.ReactElement<IGsitsProps> {
    const {
      hasTeamsContext,
      context
    } = this.props;
    
    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
          <Router>
            <section className={`${styles.gsits} ${hasTeamsContext ? styles.teams : ''}`}>
              <nav className={styles.nav}>
                <ul>
                  <li><NavLink to="/requisition" className={({isActive}) => isActive ? styles.active : ''}>New Part
                    Requisition</NavLink></li>
                  <li><NavLink to="/pricechange" className={({isActive}) => isActive ? styles.active : ''}>Price Change
                    Request</NavLink></li>
                  <li><NavLink to="/rfq" className={({isActive}) => isActive ? styles.active : ''}>RFQ & QUOTE</NavLink>
                  </li>


                </ul>
                <div className={styles.toggleContainer}>
                  <LanguageToggle/>
                </div>
              </nav>
              <div className={styles.contentMain}>
              <React.Suspense fallback={<Spinner label='Loading...' />} >
                <Routes>
                  <Route path='/requisition' element={<Requisition />} />
                  <Route path="/rfq" element={<RFQ />} /> {/* 传递 userType */}
                  <Route path='*' element={<PageNotFound />} />
                  <Route path='/' element={<Navigate to="/rfq" />} />
                  <Route path='/role' element={<UDUser />} />
                  <Route path="/create-rfq" element={<CreateRFQ />} />
                  <Route path="/quotation" element={<QuotationPage />} />
                  <Route path="/demo" element={<DemoForm/>} />
                </Routes>
              </React.Suspense>
              </div>
            </section>
          </Router>
        </Provider>
      </AppContext.Provider>
    );
  }
}
