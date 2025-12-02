import React, { useState, useEffect } from 'react';
import type { Ad } from '../types';

interface BannerProps {
  ads: Ad[];
}

const Banner: React.FC<BannerProps> = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsFading(false);
      }, 500); // fade out duration
    }, 5000); // 5 seconds per ad

    return () => clearInterval(interval);
  }, [ads, ads.length]);

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  const AdContent = () => (
    <div 
      className="w-full h-32 rounded-lg flex items-center justify-center p-6 text-white relative bg-cover bg-center shadow-inner"
      style={{ 
        backgroundImage: currentAd.imageUrl ? `url(${currentAd.imageUrl})` : 'none',
        backgroundColor: !currentAd.imageUrl ? '#31349A' : 'transparent' // Default bg for text-only ads
      }}
    >
        {/* Dark overlay for text readability on images */}
        {currentAd.imageUrl && <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>}
        
        <div className="relative z-10 flex items-center justify-between w-full gap-4">
            <div className="flex-1">
                {currentAd.title && <h3 className="text-xl font-bold tracking-tight">{currentAd.title}</h3>}
                {currentAd.text && <p className="text-sm mt-1 opacity-90">{currentAd.text}</p>}
            </div>
            {currentAd.buttonText && (
                 <a href={currentAd.linkUrl} target="_blank" rel="noopener noreferrer" className="ml-4 flex-shrink-0 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-bold py-2 px-5 rounded-lg transition-colors text-center whitespace-nowrap">
                    {currentAd.buttonText}
                </a>
            )}
        </div>
    </div>
  );

  return (
    <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
      <div className={`transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        {/* If there's no button, the whole banner is the link */}
        {!currentAd.buttonText ? (
          <a href={currentAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
            <AdContent />
          </a>
        ) : (
          <AdContent />
        )}
      </div>
    </div>
  );
};

export default Banner;