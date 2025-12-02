
import React from 'react';

interface InputFormProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  t: {
    formLabel: string;
    formPlaceholder: string;
    formHint: string;
    formHintKeys: string[];
    formHintSubmit: string;
    buttonLoading: string;
    buttonSubmit: string;
  }
}

const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, onSubmit, isLoading, t }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="user-input" className="font-semibold text-slate-700">
        {t.formLabel}
      </label>
      <textarea
        id="user-input"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.formPlaceholder}
        className="w-full h-48 p-4 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none text-base"
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500">
            {t.formHint} <kbd className="font-sans font-semibold">{t.formHintKeys[0]}</kbd> + <kbd className="font-sans font-semibold">{t.formHintKeys[1]}</kbd> {t.formHintSubmit}
        </p>
        <button
            onClick={onSubmit}
            disabled={isLoading || !userInput.trim()}
            className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
        >
            {isLoading ? t.buttonLoading : t.buttonSubmit}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
