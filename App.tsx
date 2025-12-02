import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Banner from './components/Banner';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboard from './components/admin/AdminDashboard';
import { getCareerAdvice } from './services/geminiService';
import type { GroundingChunk, UserLocation, Ad } from './types';
import { translations, Language } from './translations';
import { AdminIcon } from './components/icons/AdminIcon';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isComplexCase, setIsComplexCase] = useState<boolean>(false);
  
  // Simulate user country detection. In a real app, this would use a geolocation service.
  const [userCountry, setUserCountry] = useState<string | null>('US'); 

  // Admin and Ads State
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [stats, setStats] = useState({ submissionCount: 0 });
  const [ads, setAds] = useState<{ en: Ad[], es: Ad[] }>({
    en: [
       { 
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&h=128&fit=crop',
        title: 'Project Management Workshop (US Only)',
        text: 'Master the skills to lead successful projects in your area.',
        linkUrl: '#',
        buttonText: 'Register Now',
        country: 'US'
      },
      { 
        id: 1, 
        imageUrl: 'https://placehold.co/800x128/31349A/FFF?text=Find+Your+Dream+Job', 
        linkUrl: '#' 
      },
      { 
        id: 2, 
        title: 'Learn to Code in 2024!', 
        text: 'Join our bootcamp and kickstart your new career in tech.',
        linkUrl: '#',
        buttonText: 'Learn More'
      },
    ],
    es: [
       { 
        id: 4,
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&h=128&fit=crop',
        title: 'Taller de Emprendimiento (Solo México)',
        text: 'Inicia tu propio negocio con nuestra guía experta.',
        linkUrl: '#',
        buttonText: 'Inscríbete',
        country: 'MX'
      },
      { 
        id: 1, 
        imageUrl: 'https://placehold.co/800x128/D93A32/FFF?text=¡Encuentra+el+Trabajo+de+Tus+Sueños!', 
        linkUrl: '#' 
      },
      { 
        id: 2, 
        title: '¡Aprende a Programar en 2024!', 
        text: 'Únete a nuestro bootcamp e inicia tu nueva carrera en tecnología.',
        linkUrl: '#',
        buttonText: 'Aprende Más'
      },
    ]
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn(`Geolocation error: ${err.message}. Proceeding without location data.`);
        setUserLocation(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
    // In a real app, you would fetch the user's country here.
    // For demonstration, we're keeping the simulated 'US' value.
    // e.g., fetch('https://ipapi.co/json/').then(res => res.json()).then(data => setUserCountry(data.country_code));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim()) {
      setError(t.errorDefault);
      return;
    }
    setError(null);
    setAiResponse(null);
    setGroundingChunks([]);
    setIsComplexCase(false);
    if (userInput.length > 1500) {
      setIsComplexCase(true);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getCareerAdvice(userInput, userLocation, language);
      setAiResponse(result.text || "I'm sorry, I couldn't generate a response. Please try rephrasing your thoughts.");
      setGroundingChunks(result.groundingChunks || []);
      setStats(prevStats => ({ submissionCount: prevStats.submissionCount + 1 }));
    } catch (err) {
      console.error(err);
      setError(t.errorApi);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, userLocation, language, t]);
  
  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const handleAddAd = (lang: Language, adData: Omit<Ad, 'id'>) => {
    const newAd: Ad = {
      id: Date.now(),
      ...adData,
    };
    setAds(prevAds => ({
      ...prevAds,
      [lang]: [...prevAds[lang], newAd]
    }));
  };

  const handleDeleteAd = (lang: Language, id: number) => {
    setAds(prevAds => ({
      ...prevAds,
      [lang]: prevAds[lang].filter(ad => ad.id !== id)
    }));
  };

  const filteredAds = useMemo(() => {
    const allLangAds = ads[language];
    if (!userCountry) {
        // If country is unknown, show only global ads.
        return allLangAds.filter(ad => !ad.country);
    }
    const countrySpecificAds = allLangAds.filter(ad => ad.country?.toUpperCase() === userCountry.toUpperCase());
    const globalAds = allLangAds.filter(ad => !ad.country);
    
    // Prioritize country-specific ads, then show global ads.
    return [...countrySpecificAds, ...globalAds];
  }, [ads, language, userCountry]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header language={language} setLanguage={setLanguage} t={t} />
        <Banner ads={filteredAds} />
        <main className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <InputForm 
            userInput={userInput}
            setUserInput={setUserInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            t={t}
          />
          <ResultsDisplay
            isLoading={isLoading}
            error={error}
            aiResponse={aiResponse}
            groundingChunks={groundingChunks}
            isComplexCase={isComplexCase}
            t={t}
          />
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm relative">
          <p>{t.footerText}</p>
          <button 
            onClick={() => setShowAdminLogin(true)} 
            className="absolute bottom-0 right-0 p-2 text-slate-400 hover:text-blue-600 transition-colors"
            aria-label="Admin Login"
            >
            <AdminIcon className="w-6 h-6"/>
          </button>
        </footer>
      </div>
      {showAdminLogin && !isAdminAuthenticated && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onLogin={handleAdminLogin}
          t={t}
        />
      )}
      {isAdminAuthenticated && (
         <AdminDashboard 
            stats={stats}
            ads={ads}
            onAddAd={handleAddAd}
            onDeleteAd={handleDeleteAd}
            onLogout={handleAdminLogout}
            onClose={handleAdminLogout}
            t={t}
         />
      )}
    </div>
  );
};

export default App;