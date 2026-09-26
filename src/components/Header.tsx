import React from 'react';
import { FontSizeMode } from '../types';
import { Heart, PhoneCall, VolumeX, Type } from 'lucide-react';

interface HeaderProps {
  fontSize: FontSizeMode;
  setFontSize: (size: FontSizeMode) => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fontSize,
  setFontSize,
  isSpeaking,
  onStopSpeech,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        {/* Top bar with emergency welfare quick call & TTS stop button */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              어르신 전용 쉼터
            </span>
            <span className="text-stone-500 text-xs sm:text-sm hidden md:inline">
              누구나 무료로 이용하는 마음 안식처
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={onStopSpeech}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs sm:text-sm font-bold border border-red-300 animate-pulse hover:bg-red-200 transition-colors cursor-pointer"
                title="음성 읽기 멈추기"
              >
                <VolumeX className="w-4 h-4" />
                <span>목소리 멈춤</span>
              </button>
            )}

            <a
              href="tel:129"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              title="보건복지상담센터 무료 전화"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>복지상담 직통 ☎ 129</span>
            </a>
          </div>
        </div>

        {/* Main Title Row & Font Size Adjuster */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-emerald-200 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
                  마음동행 <span className="text-emerald-700 font-extrabold text-base sm:text-xl font-serif-kr">(마음쉼터)</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                70대 어르신을 위한 따뜻한 위로 &amp; 일자리·복지 길잡이
              </p>
            </div>
          </div>

          {/* Senior Font Size Switcher */}
          <div className="flex items-center gap-1.5 bg-amber-100/70 p-1 rounded-xl border border-amber-300/80 self-start sm:self-center">
            <span className="text-xs font-bold text-amber-900 px-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              글자:
            </span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              보통
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-3 py-1 text-sm sm:text-base font-bold rounded-lg transition-all cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              크게
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-3 py-1 text-base sm:text-lg font-black rounded-lg transition-all cursor-pointer ${
                fontSize === 'huge'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              아주 크게
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
