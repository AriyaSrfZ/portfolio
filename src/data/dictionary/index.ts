import dictionaryData from './dictionary.json';
import type { DictionaryData, DictionaryTerm, DictionaryCategory, DictionarySource } from './types';

export const dictionary = dictionaryData as DictionaryData;
export const terms: DictionaryTerm[] = dictionary.terms;
export const categories: DictionaryCategory[] = dictionary.categories;
export const sources: DictionarySource[] = dictionary.sources;

export type { DictionaryData, DictionaryTerm, DictionaryCategory, DictionarySource };
