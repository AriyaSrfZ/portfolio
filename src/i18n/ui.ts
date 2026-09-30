export const ui = {
  en: {
    'nav.settlements': '01 // SETTLEMENTS',
    'nav.fraud': '02 // FRAUD RISK',
    'nav.sms': '03 // SMS SWITCH',
    'nav.data': '04 // DATA PIPELINE',
    'nav.whitepapers': '05 // WHITEPAPERS',
    'nav.contact': '06 // CONTACT',
    'nav.schedule': 'SCHEDULE REVIEW',
  },
  fa: {
    'nav.settlements': '۰۱ // تسویه',
    'nav.fraud': '۰۲ // تقلب',
    'nav.sms': '۰۳ // سوییچ پیامک',
    'nav.data': '۰۴ // خط داده',
    'nav.whitepapers': '۰۵ // مقالات فنی',
    'nav.contact': '۰۶ // تماس',
    'nav.schedule': 'بررسی معماری',
  }
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return 'en';
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)['en']) {
    return ui[lang][key] || ui['en'][key];
  };
}
