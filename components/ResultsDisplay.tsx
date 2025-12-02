
import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import type { GroundingChunk } from '../types';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  aiResponse: string | null;
  groundingChunks: GroundingChunk[];
  isComplexCase: boolean;
  t: {
    resultsLoading: string;
    complexCaseTitle: string;
    complexCaseBody1: string;
    complexCaseBody2: string;
    sourcesTitle: string;
  }
}

const FormattedResponse: React.FC<{ text: string }> = ({ text }) => {
    // This component remains language-agnostic as it formats the AI's response directly.
    const formatText = (inputText: string) => {
        return inputText
            .split('**')
            .map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part))
            .flatMap(part => (typeof part === 'string' ? part.split('*') : [part]))
            .map((part, index, array) => {
                 if(typeof part !== 'string') return part;
                 // This logic is a bit brittle, it assumes '*' are always used for italics in pairs.
                 if (array.slice(0, index).filter(p => typeof p === 'string' && p === '').length % 2 === 1) {
                     return <em key={index}>{part}</em>;
                 }
                 return part;
            })
            .flatMap(part => (typeof part === 'string' ? part.split('\n') : [part]))
            .map((part, index, array) => (
                <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && <br />}
                </React.Fragment>
            ));
    };

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const elements = [];
    let listItems = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const isListItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');

        if (isListItem) {
            listItems.push(trimmedLine.substring(2));
        }

        if ((!isListItem || index === lines.length - 1) && listItems.length > 0) {
            elements.push(
                <ul key={`ul-${index}`} className="list-disc pl-5 mb-4 space-y-1">
                    {listItems.map((item, itemIndex) => (
                        <li key={itemIndex}>{formatText(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
        
        if (!isListItem) {
             if (trimmedLine.startsWith('### ')) {
                elements.push(<h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-slate-800">{trimmedLine.substring(4)}</h3>);
            } else if (trimmedLine.startsWith('## ')) {
                elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-900">{trimmedLine.substring(3)}</h2>);
            } else {
                elements.push(<p key={index} className="mb-4">{formatText(trimmedLine)}</p>);
            }
        }
    });
    
    return <>{elements}</>;
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, aiResponse, groundingChunks, isComplexCase, t }) => {
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center gap-4 text-slate-600">
        <LoadingSpinner />
        <p className="font-semibold">{t.resultsLoading}</p>
      </div>
    );
  }

  if (error) {
    return <div className="mt-8 text-center p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>;
  }
  
  if (isComplexCase) {
    return (
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h2 className="text-xl font-bold text-amber-900">{t.complexCaseTitle}</h2>
            <p className="mt-2 text-amber-800">
                {t.complexCaseBody1}
            </p>
            <p className="mt-4 text-amber-800">
                {t.complexCaseBody2}
                <br />
                <a href="mailto:hsegil@teamgroupcierge" className="font-semibold text-blue-700 hover:underline">
                    hsegil@teamgroupcierge
                </a>
            </p>
        </div>
    );
  }

  if (!aiResponse) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="prose prose-slate max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200">
        <FormattedResponse text={aiResponse} />
      </div>

      {groundingChunks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">{t.sourcesTitle}</h3>
          <ul className="space-y-2">
            {groundingChunks.map((chunk, index) => {
                if (chunk.web) {
                    return (
                        <li key={`web-${index}`} className="flex items-start gap-3">
                            <GoogleIcon className="w-5 h-5 mt-1 text-slate-500 flex-shrink-0" />
                            <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                {chunk.web.title}
                            </a>
                        </li>
                    );
                }
                if (chunk.maps) {
                     return (
                        <li key={`maps-${index}`} className="flex items-start gap-3">
                            <MapPinIcon className="w-5 h-5 mt-1 text-slate-500 flex-shrink-0" />
                            <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                {chunk.maps.title}
                            </a>
                        </li>
                    );
                }
                return null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
