import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GsitsWebPartStrings';
import App from './components/App';
import { IGsitsProps } from './components/IGsitsProps';
import { getSP, getGraph, getAADClient } from '../../pnpjsConfig';
import { Logger, ConsoleListener, LogLevel } from '@pnp/logging';
import { CONST } from '../../config/const';
import '../../i18n';
import { AppInsightsService } from '../../config/AppInsightsService';

export interface IGsitsWebPartProps {
  description: string;
}

export default class GsitsWebPart extends BaseClientSideWebPart<IGsitsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IGsitsProps> = React.createElement(
      App,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }
  private checkAndAddQueryString(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('env') || urlParams.get('env') !== 'Embedded') {
      urlParams.set('env', 'Embedded');
      window.location.search = urlParams.toString();
    }
  }
  protected onInit(): Promise<void> {
    Logger.subscribe(ConsoleListener(CONST.LOG_SOURCE, { color: '#0b6a0b', warning: 'magenta' }));
    Logger.activeLogLevel = LogLevel.Info;

    getSP(this.context);
    getGraph(this.context);
    getAADClient(this.context);
    if (CONST.appInsightsKey)
      AppInsightsService.InitializeInstance(CONST.LOG_SOURCE, CONST.appInsightsKey, this.context.pageContext.user.email);

    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    }).then(_ => {
      this.checkAndAddQueryString();
    });

  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
