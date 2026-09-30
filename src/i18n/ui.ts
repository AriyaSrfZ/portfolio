export const ui = {
  en: {
    'nav.about': 'About',
    'nav.settlements': '01 · Settlements',
    'nav.fraud': '02 · Fraud Risk',
    'nav.sms': '03 · SMS Switch',
    'nav.data': '04 · Data Pipeline',
    'nav.dossiers': '05 · Dossiers',
    'nav.lifecycle': '06 · Lifecycle',
    'nav.work': 'Case Studies',
    'nav.whitepapers': 'Whitepapers',
    'nav.contact': 'Contact',
    'nav.schedule': 'Schedule Review',
  },
  fa: {
    'nav.about': 'درباره من',
    'nav.settlements': '۰۱ · تسویه',
    'nav.fraud': '۰۲ · مدیریت ریسک',
    'nav.sms': '۰۳ · سوییچ پیامک',
    'nav.data': '۰۴ · خط داده',
    'nav.dossiers': '۰۵ · وقایع',
    'nav.lifecycle': '۰۶ · چرخه محصول',
    'nav.work': 'نمونه‌های موردی',
    'nav.whitepapers': 'مستندات معماری',
    'nav.contact': 'ارتباط',
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
