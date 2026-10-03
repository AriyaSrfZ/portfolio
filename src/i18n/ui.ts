export const ui = {
  en: {
    'nav.about': 'About',
    'nav.settlements': '01 · Settlements',
    'nav.fraud': '02 · Fraud & eKYC',
    'nav.sms': '03 · Smart PSP Switch',
    'nav.switch': '03 · Smart PSP Switch',
    'nav.data': '04 · Reconciliation',
    'nav.reconciliation': '04 · Reconciliation',
    'nav.dossiers': '05 · Dossiers',
    'nav.lifecycle': '06 · Lifecycle',
    'nav.work': 'Case Studies',
    'nav.whitepapers': 'Whitepapers',
    'nav.blog': 'Dossiers & Articles',
    'nav.contact': 'Contact',
    'nav.schedule': 'Schedule Review',
  },
  fa: {
    'nav.about': 'درباره من',
    'nav.settlements': '۰۱ · تسویه و دفاتر کل',
    'nav.fraud': '۰۲ · مدیریت ریسک و شاهکار',
    'nav.sms': '۰۳ · سوییچ هوشمند پرداخت',
    'nav.switch': '۰۳ · سوییچ هوشمند پرداخت',
    'nav.data': '۰۴ · مغایرت‌گیری و تسویه',
    'nav.reconciliation': '۰۴ · مغایرت‌گیری و تسویه',
    'nav.dossiers': '۰۵ · وقایع پروداکشن',
    'nav.lifecycle': '۰۶ · چرخه محصول',
    'nav.work': 'نمونه‌های موردی',
    'nav.whitepapers': 'مستندات معماری',
    'nav.blog': 'مستندات و مقالات',
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
