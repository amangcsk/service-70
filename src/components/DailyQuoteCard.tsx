import React, { useState, useEffect } from 'react';
import { FontSizeMode } from '../types';
import { speechHelper } from '../utils/speech';
import {
  Sparkles,
  Volume2,
  VolumeX,
  MessageCircle,
  Share2,
  RefreshCw,
  Check,
  Heart,
} from 'lucide-react';

interface DailyQuoteCardProps {
  fontSize: FontSizeMode;
  onSpeechStateChange: (speaking: boolean) => void;
}

interface QuoteItem {
  id: number;
  text: string;
  source: string;
  subnote?: string;
}

const QUOTES: QuoteItem[] = [
  {
    id: 1,
    text: '어르신의 거친 손마디는 부끄러운 가난의 흔적이 아니라, 비바람을 견뎌낸 가장 자랑스러운 삶의 훈장입니다.',
    source: '마음동행 헌사',
    subnote: '지난 세월 자식과 가정을 지키기 위해 바친 헌신을 기억합니다.',
  },
  {
    id: 2,
    text: '나이 듦은 결코 빛바램이 아니라, 거목의 깊은 나이테처럼 모진 풍파를 이겨낸 고귀한 지혜의 증표입니다.',
    source: '지혜의 샘',
    subnote: '어르신께서 살아내신 한 걸음 한 걸음이 곧 살아있는 역사입니다.',
  },
  {
    id: 3,
    text: '자식들에게 짐이 될까 미안해 마세요. 어르신께서 흘리신 청춘의 땀방울이 거름이 되어 오늘의 세상이 꽃피웠습니다.',
    source: '부모의 은혜',
    subnote: '당신은 세상에서 가장 위대한 부모님이셨습니다.',
  },
  {
    id: 4,
    text: '오늘 하루 손에 쥔 것이 조금 적을지라도, 정직하고 묵묵하게 살아온 당신의 발걸음은 그 누구보다 당당하고 귀합니다.',
    source: '노년의 품격',
    subnote: '가난은 부끄러운 것이 아니며, 당신의 삶은 결코 헛되지 않았습니다.',
  },
  {
    id: 5,
    text: '가장 맑은 샘물은 깊은 바위틈에서 솟아나듯, 인생의 참된 향기는 오랜 인내의 시간을 건너온 어르신의 미소 속에 있습니다.',
    source: '마음의 안식',
    subnote: '모든 시련을 견뎌내신 어르신의 온기는 세상을 따뜻하게 합니다.',
  },
  {
    id: 6,
    text: '찬 바람이 불어도 뿌리 깊은 나무는 흔들리지 않습니다. 격동의 세월을 온몸으로 버텨오신 어르신은 든든한 거목이십니다.',
    source: '삶의 길잡이',
    subnote: '어르신의 강인한 생명력에 머리 숙여 깊은 경의를 표합니다.',
  },
  {
    id: 7,
    text: '온종일 방안에 홀로 계셔도 결코 혼자가 아닙니다. 당신을 존경하고 감사해하는 따스한 온기가 늘 곁에 머물고 있습니다.',
    source: '다정한 동행',
    subnote: '오늘 밤도 부디 따스하고 평안한 단잠을 이루시기를 바랍니다.',
  },
];

export const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({
  fontSize,
  onSpeechStateChange,
}) => {
  // Determine quote index based on day of year for stable "Quote of the Day", but allow cycling
  const [quoteIndex, setQuoteIndex] = useState<number>(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return dayOfYear % QUOTES.length;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const currentQuote = QUOTES[quoteIndex];

  // Today's formatted date in Korean
  const todayDateString = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const handleNextQuote = () => {
    speechHelper.stop();
    setIsSpeaking(false);
    onSpeechStateChange(false);
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechHelper.stop();
      setIsSpeaking(false);
      onSpeechStateChange(false);
    } else {
      speechHelper.stop();
      setIsSpeaking(true);
      onSpeechStateChange(true);

      const textToRead = `오늘의 한 줄. "${currentQuote.text}". ${currentQuote.subnote || ''}`;
      speechHelper.speak(textToRead, () => {
        setIsSpeaking(false);
        onSpeechStateChange(false);
      });
    }
  };

  const handleShareToFamily = async () => {
    const shareText = `[마음동행 오늘의 한 줄]\n\n"${currentQuote.text}"\n- ${currentQuote.source} -\n\n사랑하는 가족에게 따뜻한 마음과 안부를 전합니다. 늘 건강하세요.`;

    // Try Web Share API on modern mobile devices first
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: '마음동행 오늘의 한 줄',
          text: shareText,
        });
        setCopiedToast('가족에게 문자 공유 창이 열렸습니다.');
        setTimeout(() => setCopiedToast(null), 3000);
        return;
      } catch (err) {
        // Fall back to SMS link or clipboard if dismissed or failed
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Direct SMS scheme fallback (universal on mobile devices)
    const encodedBody = encodeURIComponent(shareText);
    const smsUrl = `sms:?&body=${encodedBody}`;

    // Attempt to open SMS app
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = smsUrl;
      setCopiedToast('문자 메시지 앱으로 연결되었습니다.');
    } else {
      // On desktop, copy to clipboard and provide clear feedback
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedToast('문자 내용이 복사되었습니다! 카카오톡이나 메시지 창에 붙여넣어(Ctrl+V) 보내보세요.');
      } catch {
        // Fallback
        setCopiedToast('문자 내용을 준비했습니다: ' + currentQuote.text);
      }
    }

    setTimeout(() => {
      setCopiedToast(null);
    }, 4500);
  };

  // Font sizing helper
  const getQuoteTextClass = () => {
    switch (fontSize) {
      case 'huge':
        return 'text-xl sm:text-2xl leading-relaxed sm:leading-loose';
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-1">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fffdf9] via-[#fbf7ee] to-[#f5ede0] border-2 border-amber-300/90 shadow-md">
        {/* Soft decorative corner emblem */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-amber-200/40 to-transparent pointer-events-none rounded-bl-full"></div>

        <div className="p-4 sm:p-6 relative z-10 space-y-3.5">
          {/* Card Top: Header badge & date & shuffle button */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/70">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs sm:text-sm font-black shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-100" />
                오늘의 한 줄
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-900/80">
                {todayDateString}의 위로
              </span>
            </div>

            <button
              onClick={handleNextQuote}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-bold border border-amber-300 transition-colors cursor-pointer"
              title="다른 명언 보기"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다른 한 줄</span>
            </button>
          </div>

          {/* Main Quote Content */}
          <div className="py-1">
            <div className="flex items-start gap-2">
              <span className="text-3xl sm:text-4xl text-amber-600/60 font-serif leading-none select-none">
                “
              </span>
              <div className="flex-1 space-y-1.5">
                <p
                  className={`font-serif-kr font-bold text-stone-900 tracking-wide ${getQuoteTextClass()}`}
                >
                  {currentQuote.text}
                </p>
                {currentQuote.subnote && (
                  <p className="text-xs sm:text-sm text-stone-600 font-medium font-serif-kr">
                    {currentQuote.subnote}
                  </p>
                )}
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    - {currentQuote.source} -
                  </span>
                </div>
              </div>
              <span className="text-3xl sm:text-4xl text-amber-600/60 font-serif leading-none select-none self-end">
                ”
              </span>
            </div>
          </div>

          {/* Card Bottom: Audio Listen & SMS Share Buttons */}
          <div className="pt-2.5 border-t border-amber-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* TTS Listen Button */}
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>낭독 멈추기</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-200" />
                    <span>🔊 음성으로 듣기</span>
                  </>
                )}
              </button>

              {/* Share to Family via SMS Button */}
              <button
                type="button"
                onClick={handleShareToFamily}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-amber-200" />
                <span>✉️ 가족에게 문자로 보내기</span>
              </button>
            </div>

            <span className="text-[11px] sm:text-xs text-stone-500 text-center sm:text-right">
              자식이나 지인에게 따뜻한 안부 문자로 보내실 수 있습니다
            </span>
          </div>

          {/* Feedback notification toast */}
          {copiedToast && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{copiedToast}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
