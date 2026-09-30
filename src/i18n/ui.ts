export const ui = {
  en: {
    'nav.settlements': 'Settlements',
    'nav.fraud': 'Fraud Risk',
    'nav.sms': 'SMS Switch',
    'nav.data': 'Data Pipeline',
    'nav.whitepapers': 'Whitepapers',
    'nav.contact': 'Contact',
    'nav.schedule': 'Schedule Review',
  },
  fa: {
    'nav.settlements': 'تسویه حساب',
    'nav.fraud': 'تشخیص تقلب',
    'nav.sms': 'سوییچ پیامک',
    'nav.data': 'خط داده',
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
