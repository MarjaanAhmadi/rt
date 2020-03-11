import i18n from 'i18next';
import { initReactI18next } from "react-i18next";

import translationDE from './locales/de/translation';
import translationPER from './locales/per/translation';


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources : {
            per: {
                translation: translationPER
            },
            de: {
                translation: translationDE
            },
        },
        lng: "per",
        fallbackLng: "per",

        interpolation: {
            escapeValue: false
        }
    });
export default i18n;
