import React from 'react';
import { TabType, FontSizeMode } from '../types';
import { MessageSquareHeart, Briefcase, Radio, BookOpen } from 'lucide-react';

interface NavigationProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  fontSize: FontSizeMode;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  fontSize,
}) => {
  const tabs = [
    {
      id: 'chat' as TabType,
      label: '말벗 상담실',
      sublabel: '마음지기 다정이',
      icon: MessageSquareHeart,
      color: 'emerald',
    },
    {
      id: 'welfare' as TabType,
      label: '일자리 & 복지',
      sublabel: '70대 일자리·연금',
      icon: Briefcase,
      color: 'amber',
    },
    {
      id: 'radio' as TabType,
      label: '마음 토닥 라디오',
      sublabel: '빗소리·1분 숨쉬기',
      icon: Radio,
      color: 'teal',
    },
    {
      id: 'letter' as TabType,
      label: '헌정 편지 & 일기',
      sublabel: '어르신께 바치는 글',
      icon: BookOpen,
      color: 'stone',
    },
  ];

  const getLabelSize = () => {
    switch (fontSize) {
      case 'huge':
        return 'text-lg sm:text-xl';
      case 'large':
        return 'text-base sm:text-lg';
      default:
        return 'text-sm sm:text-base';
    }
  };

  return (
    <nav className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-1" aria-label="메인 메뉴">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-center relative select-none ${
                isActive
                  ? 'bg-emerald-900 text-white border-emerald-950 shadow-md scale-[1.01]'
                  : 'bg-white/80 hover:bg-amber-50/90 text-stone-700 border-amber-200/70 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div
                className={`p-2 rounded-xl mb-1.5 ${
                  isActive ? 'bg-emerald-700/80 text-white' : 'bg-amber-100 text-emerald-800'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <span className={`font-black tracking-tight ${getLabelSize()}`}>
                {tab.label}
              </span>

              <span
                className={`text-xs mt-0.5 ${
                  isActive ? 'text-emerald-200' : 'text-stone-500'
                }`}
              >
                {tab.sublabel}
              </span>

              {isActive && (
                <div className="w-3 h-1.5 bg-amber-400 rounded-full mt-1.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
