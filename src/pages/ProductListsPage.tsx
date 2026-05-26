import React from 'react';
import RulesList from '../components/RulesList';
import { LanguageType, TranslationType } from '../utils/translations';
import { CustomsLists } from '../types';

interface ProductListsPageProps {
  lists: CustomsLists;
  lang: LanguageType;
  t: TranslationType;
}

export default function ProductListsPage({ lists, lang, t }: ProductListsPageProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="glass-card p-4 flex flex-col justify-center border-l-4 border-idg-gold">
        <h2 className="text-base font-bold text-idg-gold uppercase tracking-wider">
          {t.rules.title || 'National Resource Guidelines'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ku' ? 'زانیاری نوێ و فەرمی لەسەر سەرجەم کاڵا مۆڵەتپێدراوەکان یان قەدەغکراوەکان بە پێناسی یاسایی' : 'Up-to-date registry of import classifications, license indicators and national safety exclusions.'}
        </p>
      </div>

      <RulesList
        lists={lists}
        lang={lang}
        t={t}
      />
    </div>
  );
}
