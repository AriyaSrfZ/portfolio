export interface DictionaryCategory {
  id: string;
  en: string;
  fa: string;
  icon: string;
}

export interface DictionarySource {
  id: string;
  name: string;
  url: string;
  type: string;
  note: string;
  localFile?: string;
  fileType?: string;
  fileSize?: string;
  attachmentTitle?: string;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  termFa: string;
  acronym?: string;
  category: string;
  definitionEn: string;
  definitionFa: string;
  roles: string[];
  sources: string[];
}

export interface DictionaryData {
  metadata: {
    titleEn: string;
    titleFa: string;
    version: string;
    totalTerms: number;
    totalCategories: number;
    totalSources: number;
    author: string;
  };
  categories: DictionaryCategory[];
  sources: DictionarySource[];
  terms: DictionaryTerm[];
}
