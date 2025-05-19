export const langStorage = "lang";

// https://localizely.com/iso-639-1-list/
export enum ELang {
    fr = "fr",
    en = "en",
    de = "de",
    es = "es",
    ja = "ja" // Japonais
}

// Add new languages here + don't forget to also create a json file in
// src/assets/i18n/langCode.json
export const LANGUAGES = [
    {
        name: 'English',
        type: 'radio',
        label: 'English',
        value: ELang.en,
        checked: false
    },
    {
        name: 'French',
        type: 'radio',
        label: 'Français',
        value: ELang.fr
    },
    {
        name: 'German',
        type: 'radio',
        label: 'Deutsche',
        value: ELang.de
    },
    {
        name: 'Spanish',
        type: 'radio',
        label: 'Española',
        value: ELang.es
    },
    {
        name: 'Japanese',
        type: 'radio',
        label: '日本語',
        value: ELang.ja
    }
];
