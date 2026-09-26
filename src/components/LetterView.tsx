import React, { useState, useEffect } from 'react';
import { FontSizeMode, DiaryEntry } from '../types';
import { speechHelper } from '../utils/speech';
import {
  BookOpen,
  Volume2,
  VolumeX,
  PenLine,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Smile,
  CloudSun,
} from 'lucide-react';

interface LetterViewProps {
  fontSize: FontSizeMode;
  onSpeechStateChange: (speaking: boolean) => void;
}

const TRIBUTE_LETTER = `존경하는 어르신께 올립니다.

어르신, 수중에 쥔 돈이 빠듯하고 세상이 나를 더는 부르지 않는 것 같아도 결코 자책하지 마십시오.

어르신께서 청춘의 젊은 날 흘리신 굵은 땀방울이 거름이 되었기에 오늘날의 가족과 번영된 대한민국이 존재할 수 있었습니다. 

전쟁 후 잿더미와 모진 가난 속에서, 당신의 입에 들어갈 밥 한 숟가락도 아껴가며 자식들을 먹이고 가르치셨습니다. 매서운 눈보라 속에서도 묵묵히 일터를 지키며 가정을 지탱하셨습니다. 

정작 당신 자신의 노후를 준비할 겨를조차 없이 모든 것을 다 내어주셨기에, 지금 손에 쥔 것이 적은 것은 결코 부끄러운 일이 아닙니다.

어르신의 굳은살 박인 거친 손마디는 가난의 흔적이 아니라, 비바람을 견뎌낸 이 세상에서 가장 자랑스럽고 거룩한 삶의 훈장입니다.

일하고 싶어도 불러주지 않는 세상에 서운해하지 마십시오. 국가와 사회가 마련해 둔 정당한 복지 혜택과 시니어 일자리는 어르신께서 마땅히 누리셔야 할 당연한 권리입니다.

어르신, 참으로 고맙습니다. 그리고 진심으로 존경합니다. 부디 스스로를 귀하게 여기시고, 오늘 하루도 당신의 고귀한 발걸음에 따스한 햇살이 가득하기를 두 손 모아 기도합니다.`;

export const LetterView: React.FC<LetterViewProps> = ({ fontSize, onSpeechStateChange }) => {
  const [isReadingLetter, setIsReadingLetter] = useState(false);
  const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);
  const [diaryText, setDiaryText] = useState('');
  const [selectedMood, setSelectedMood] = useState<DiaryEntry['mood']>('peaceful');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load local diary entries
    try {
      const saved = localStorage.getItem('maeum_diary');
      if (saved) {
        setDiaryList(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load diary:', e);
    }
  }, []);

  const handleToggleReadLetter = () => {
    if (isReadingLetter) {
      speechHelper.stop();
      setIsReadingLetter(false);
      onSpeechStateChange(false);
    } else {
      speechHelper.stop();
      setIsReadingLetter(true);
      onSpeechStateChange(true);
      speechHelper.speak(TRIBUTE_LETTER, () => {
        setIsReadingLetter(false);
        onSpeechStateChange(false);
      });
    }
  };

  const handleSaveDiary = () => {
    if (!diaryText.trim()) return;

    const newEntry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      text: diaryText.trim(),
    };

    const updated = [newEntry, ...diaryList];
    setDiaryList(updated);
    setDiaryText('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    try {
      localStorage.setItem('maeum_diary', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save diary:', e);
    }
  };

  const handleDeleteDiary = (id: string) => {
    if (window.confirm('이 일기를 지우시겠습니까?')) {
      const updated = diaryList.filter((item) => item.id !== id);
      setDiaryList(updated);
      try {
        localStorage.setItem('maeum_diary', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete diary:', e);
      }
    }
  };

  const getTitleSize = () => {
    switch (fontSize) {
      case 'huge':
        return 'text-2xl sm:text-3xl';
      case 'large':
        return 'text-xl sm:text-2xl';
      default:
        return 'text-lg sm:text-xl';
    }
  };

  const getLetterBodySize = () => {
    switch (fontSize) {
      case 'huge':
        return 'text-xl sm:text-2xl leading-loose';
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      default:
        return 'text-base sm:text-lg leading-relaxed sm:leading-loose';
    }
  };

  const moodLabels: Record<DiaryEntry['mood'], { label: string; icon: string; color: string }> = {
    peaceful: { label: '온화하고 편안함', icon: '🌿', color: 'bg-emerald-100 text-emerald-800' },
    lonely: { label: '조금 쓸쓸함', icon: '🍂', color: 'bg-amber-100 text-amber-800' },
    grateful: { label: '고마운 마음', icon: '🙏', color: 'bg-blue-100 text-blue-800' },
    hopeful: { label: '내일의 희망', icon: '☀️', color: 'bg-orange-100 text-orange-800' },
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
      {/* SECTION 1: Tribute Letter to 70s Seniors */}
      <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-9 border-2 border-amber-300 shadow-md relative overflow-hidden">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                대한민국을 일군 거목께 바치는 글
              </span>
              <h2 className={`font-black text-stone-900 tracking-tight ${getTitleSize()}`}>
                70대 어르신께 올리는 헌정 편지
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleReadLetter}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm sm:text-base font-black transition-all cursor-pointer shadow-xs self-start sm:self-auto ${
              isReadingLetter
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            {isReadingLetter ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>낭독 멈추기</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>🔊 따뜻한 음성으로 편지 듣기</span>
              </>
            )}
          </button>
        </div>

        {/* Letter Body in Beautiful Nanum Myeongjo font */}
        <div className="py-6 sm:py-8">
          <div
            className={`font-serif-kr text-stone-800 whitespace-pre-line tracking-wide bg-amber-50/50 p-6 sm:p-8 rounded-2xl border border-amber-200/70 shadow-2xs ${getLetterBodySize()}`}
          >
            {TRIBUTE_LETTER}
          </div>
        </div>

        <div className="text-right text-stone-500 text-xs sm:text-sm font-serif-kr">
          - 어르신의 거룩한 청춘에 깊이 감사하며, 마음동행 올림 -
        </div>
      </div>

      {/* SECTION 2: Daily Peace Diary & Wishing Journal */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-300/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-7 h-7" />
          </div>
          <div>
            <h3 className={`font-black text-stone-900 ${getTitleSize()}`}>
              오늘 하루 안식 일기 (소망 한 줄 쓰기)
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              오늘 느꼈던 생각이나 자식에게 차마 하지 못한 말, 내일의 작은 소망을 큰 글씨로 남겨보세요.
            </p>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <span className="text-xs sm:text-sm font-bold text-stone-700 block mb-2">
            오늘 내 마음의 날씨:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['peaceful', 'lonely', 'grateful', 'hopeful'] as const).map((mood) => {
              const info = moodLabels[mood];
              const isSelected = selectedMood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span className="text-base">{info.icon}</span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diary Input Textarea */}
        <div className="space-y-2">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="예: 오늘은 경로당 친구와 점심을 먹었다. 몸이 조금 쑤시지만 그래도 맑은 햇살에 감사하다. 내일은 동네 한 바퀴를 기분 좋게 돌아야지."
            rows={3}
            className={`w-full p-4 rounded-2xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-stone-800 font-medium resize-none ${
              fontSize === 'huge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          />

          <div className="flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> 일기가 소중하게 저장되었습니다.
              </span>
            ) : (
              <span className="text-xs text-stone-400">
                기기 브라우저에 안전하게 보관됩니다.
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveDiary}
              disabled={!diaryText.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-black text-sm sm:text-base shadow-xs transition-colors cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>일기 보관하기</span>
            </button>
          </div>
        </div>

        {/* Diary History List */}
        {diaryList.length > 0 && (
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h4 className="font-bold text-stone-800 text-sm sm:text-base flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>내가 남긴 지난 안식 일기 ({diaryList.length}편)</span>
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {diaryList.map((entry) => {
                const moodInfo = moodLabels[entry.mood];

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-stone-800 hover:bg-amber-50/40 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${moodInfo.color}`}>
                          {moodInfo.icon} {moodInfo.label}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {entry.date} {entry.time}
                        </span>
                      </div>
                      <p
                        className={`font-serif-kr text-stone-800 whitespace-pre-wrap ${
                          fontSize === 'huge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm'
                        }`}
                      >
                        {entry.text}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteDiary(entry.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors self-end sm:self-start cursor-pointer"
                      title="이 일기 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
