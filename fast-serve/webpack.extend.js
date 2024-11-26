/*
* User webpack settings file. You can add your own settings here.
* Changes from this file will be merged into the base webpack configuration file.
* This file will not be overwritten by the subsequent spfx-fast-serve calls.
*/
const webpack = require('webpack');

let azureFunctionBaseUrl = process.env.AzureFunctionBaseUrl;
let aadClientId = process.env.AadClientId;
let appInsightsKey= process.env.AppInsightsKey;

let defineOptions = {};

if (azureFunctionBaseUrl && aadClientId) {
  console.log('************    Applying prod settings to webpack    **********************');
  defineOptions = {
    'azureFunctionBaseUrl': JSON.stringify(azureFunctionBaseUrl),
    'aadClientId': JSON.stringify(aadClientId),
    'appInsightsKey': JSON.stringify(appInsightsKey)
  }
} else {
  // specify dev settings here
  defineOptions = {
    'azureFunctionBaseUrl': JSON.stringify('https://func-ud-gsits-dev.azurewebsites.net'),
    'aadClientId': JSON.stringify('4ec72fbb-bdc9-493e-b125-57277bde95a6'),
    'appInsightsKey': JSON.stringify('f5a5f8dc-a849-4e1a-af8b-5cce4da248e4')
  }
}

/**
 * you can add your project related webpack configuration here, it will be merged using webpack-merge module
 * i.e. plugins: [new webpack.Plugin()]
 */
const webpackConfig = {
  plugins: [
    new webpack.DefinePlugin({
      ...defineOptions,
    })
  ],
}

/**
 * For even more fine-grained control, you can apply custom webpack settings using below function
 * @param {object} initialWebpackConfig - initial webpack config object
 * @param {object} webpack - webpack object, used by SPFx pipeline
 * @returns webpack config object
 */
const transformConfig = function (initialWebpackConfig, webpack) {
  // transform the initial webpack config here, i.e.
  // initialWebpackConfig.plugins.push(new webpack.Plugin()); etc.
  return initialWebpackConfig;
}

module.exports = {
  webpackConfig,
  transformConfig
}
