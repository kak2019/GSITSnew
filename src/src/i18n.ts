import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './config/en.json';
import jaTranslations from './config/ja.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations // 使用导入的 en.json 文件内容
    },
    ja: {
      translation: jaTranslations // 使用导入的 ja.json 文件内容
    }
  },
  lng: 'en', // 默认语言
  fallbackLng: 'en', // 如果缺少翻译，将回退到英文
  interpolation: {
    escapeValue: false // React 自动转义
  }
}).catch((error) => console.error('i18next init failed:', error));

export default i18n;