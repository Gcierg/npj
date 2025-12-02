
import React from 'react';
import { SparkIcon } from './icons/SparkIcon';
import type { Language } from '../translations';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: {
        headerTitle: string;
        headerTagline: string;
        languageButton: string;
    }
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="text-center relative">
       <div className="absolute top-0 right-0">
        <button
          onClick={toggleLanguage}
          className="bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-200 text-sm"
          aria-label={`Switch to ${t.languageButton}`}
        >
          {t.languageButton}
        </button>
      </div>
      <div className="inline-flex items-center gap-3">
        <SparkIcon className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          {t.headerTitle}
        </h1>
      </div>
      <p className="mt-3 text-lg text-slate-600">
        {t.headerTagline}
      </p>
    </header>
  );
};

export default Header;
