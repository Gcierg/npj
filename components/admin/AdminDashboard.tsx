import React, { useState } from 'react';
import type { Ad } from '../../types';
import type { Language } from '../../translations';
import { TrashIcon } from '../icons/TrashIcon';

interface AdminDashboardProps {
  stats: { submissionCount: number };
  ads: { en: Ad[], es: Ad[] };
  onAddAd: (lang: Language, adData: Omit<Ad, 'id'>) => void;
  onDeleteAd: (lang: Language, id: number) => void;
  onLogout: () => void;
  onClose: () => void;
  t: any;
}

const AdManager: React.FC<{
    title: string;
    lang: Language;
    ads: Ad[];
    onAddAd: (lang: Language, adData: Omit<Ad, 'id'>) => void;
    onDeleteAd: (lang: Language, id: number) => void;
    t: any;
}> = ({ title, lang, ads, onAddAd, onDeleteAd, t }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [adTitle, setAdTitle] = useState('');
    const [adText, setAdText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [country, setCountry] = useState('');


    const handleAdd = () => {
        if((imageUrl.trim() || adTitle.trim()) && linkUrl.trim()){
            onAddAd(lang, {
                imageUrl: imageUrl.trim() || undefined,
                title: adTitle.trim() || undefined,
                text: adText.trim() || undefined,
                linkUrl: linkUrl.trim(),
                buttonText: buttonText.trim() || undefined,
                country: country.trim().toUpperCase() || undefined,
            });
            setImageUrl('');
            setAdTitle('');
            setAdText('');
            setLinkUrl('');
            setButtonText('');
            setCountry('');
        }
    };
    
    return (
        <div className="bg-slate-100 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-slate-700">{title}</h4>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto p-1">
                {ads.map(ad => (
                    <div key={ad.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title || 'Ad image'} className="w-16 h-10 object-cover rounded flex-shrink-0"/>}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{ad.title || 'Image Ad'}</p>
                                    {ad.country && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full">{ad.country}</span>}
                                </div>
                                <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block">{ad.linkUrl}</a>
                            </div>
                        </div>
                        <button onClick={() => onDeleteAd(lang, ad.id)} className="text-red-500 hover:text-red-700 p-1 ml-2">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
                 {ads.length === 0 && <p className="text-slate-500 text-sm p-2">No ads yet.</p>}
            </div>
            <div className="space-y-2 border-t pt-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" placeholder={t.adminImageUrlLabel} value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm"/>
                    <input type="text" placeholder={t.adminTitleLabel} value={adTitle} onChange={e => setAdTitle(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm"/>
                    <input type="text" placeholder={t.adminTextLabel} value={adText} onChange={e => setAdText(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm sm:col-span-2"/>
                    <input type="text" placeholder={t.adminLinkUrlLabel} value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm"/>
                    <input type="text" placeholder={t.adminButtonTextLabel} value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm"/>
                    <input type="text" placeholder={t.adminCountryLabel} value={country} onChange={e => setCountry(e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm sm:col-span-2"/>
                 </div>
                <button onClick={handleAdd} className="w-full bg-green-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-700 text-sm transition-colors">
                    {t.adminAddAdButton}
                </button>
            </div>
        </div>
    )
}


const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, ads, onAddAd, onDeleteAd, onLogout, onClose, t }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-3 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">{t.adminDashboardTitle}</h2>
          <button onClick={onClose} className="text-2xl text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        
        <div className="space-y-6 overflow-y-auto pr-2 flex-grow">
            <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-700">{t.adminStatsTitle}</h3>
                <div className="bg-slate-100 p-4 rounded-lg">
                    <p>{t.adminTotalSubmissions}: <span className="font-bold text-blue-600">{stats.submissionCount}</span></p>
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-700">{t.adminAdsManagementTitle}</h3>
                <div className="space-y-4">
                   <AdManager title={t.adminEnglishAds} lang="en" ads={ads.en} onAddAd={onAddAd} onDeleteAd={onDeleteAd} t={t} />
                   <AdManager title={t.adminSpanishAds} lang="es" ads={ads.es} onAddAd={onAddAd} onDeleteAd={onDeleteAd} t={t} />
                </div>
            </div>
        </div>

        <div className="mt-8 border-t pt-4 flex justify-end flex-shrink-0">
            <button onClick={onLogout} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors">
                {t.adminLogoutButton}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;