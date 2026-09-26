import React, { useState, useEffect } from 'react';
import { FontSizeMode, TabType } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DailyQuoteCard } from './components/DailyQuoteCard';
import { ChatView } from './components/ChatView';
import { WelfareView } from './components/WelfareView';
import { RadioView } from './components/RadioView';
import { LetterView } from './components/LetterView';
import { speechHelper } from './utils/speech';
import { Heart, PhoneCall, ShieldCheck } from 'lucide-react';

export default function App() {
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    try {
      const saved = localStorage.getItem('maeum_font_size');
      if (saved === 'normal' || saved === 'large' || saved === 'huge') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'large'; // Default to 'large' for elderly convenience
  });

  const [currentTab, setCurrentTab] = useState<TabType>('chat');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('maeum_font_size', fontSize);
    } catch {
      // ignore
    }
  }, [fontSize]);

  const handleStopSpeech = () => {
    speechHelper.stop();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-hanji flex flex-col text-stone-900 selection:bg-amber-200">
      {/* Header with font switcher and direct emergency welfare call */}
      <Header
        fontSize={fontSize}
        setFontSize={setFontSize}
        isSpeaking={isSpeaking}
        onStopSpeech={handleStopSpeech}
      />

      {/* Main Tab Navigation */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          try {
            handleStopSpeech();
          } catch (e) {
            console.warn(e);
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        fontSize={fontSize}
      />

      {/* Main Tab Contents */}
      <main className="flex-1 pb-16">
        {currentTab === 'chat' && (
          <>
            {/* Today's Wisdom & Comfort Quote Card on Main Screen */}
            <DailyQuoteCard
              fontSize={fontSize}
              onSpeechStateChange={(speaking) => setIsSpeaking(speaking)}
            />
            <ChatView
              fontSize={fontSize}
              onSpeechStateChange={(speaking) => setIsSpeaking(speaking)}
            />
          </>
        )}

        {currentTab === 'welfare' && <WelfareView fontSize={fontSize} />}

        {currentTab === 'radio' && <RadioView fontSize={fontSize} />}

        {currentTab === 'letter' && (
          <LetterView
            fontSize={fontSize}
            onSpeechStateChange={(speaking) => setIsSpeaking(speaking)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-8 px-4 border-t-4 border-amber-600">
        <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Heart className="w-6 h-6 fill-amber-200 text-amber-100" />
              </div>
              <div>
                <div className="font-black text-white text-lg">
                  마음동행 (마음쉼터)
                </div>
                <div className="text-xs text-stone-400">
                  70대 어르신을 위한 위로 상담 및 노후 복지 안식처
                </div>
              </div>
            </div>

            {/* Quick call emergency reminder */}
            <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-800/80 px-4 py-2 rounded-xl border border-stone-700">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>보건복지상담 <strong>129</strong> | 노인일자리 <strong>1544-3388</strong></span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-serif-kr">
            "어르신, 수중에 쥔 돈이 빠듯하고 세상이 나를 더는 부르지 않는 것 같아도 결코 자책하지 마십시오.
            어르신의 거친 손마디는 부끄러운 가난의 흔적이 아니라, 비바람을 견뎌낸 가장 자랑스러운 삶의 훈장입니다."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 pt-2">
            <span>© 2026 마음동행. 모든 어르신들의 건강과 평안을 온 마음으로 축원합니다.</span>
            <span className="mt-1 sm:mt-0 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>개인정보 저장 없는 안전한 쉼터</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
