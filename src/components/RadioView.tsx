import React, { useState, useEffect } from 'react';
import { FontSizeMode } from '../types';
import { audioSynth, SoundType } from '../utils/audioSynth';
import {
  CloudRain,
  Flame,
  Waves,
  Bell,
  Volume2,
  Square,
  Play,
  Wind,
  RotateCcw,
} from 'lucide-react';

interface RadioViewProps {
  fontSize: FontSizeMode;
}

export const RadioView: React.FC<RadioViewProps> = ({ fontSize }) => {
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState<number>(60);

  useEffect(() => {
    return () => {
      audioSynth.stop();
    };
  }, []);

  const handleToggleSound = (type: SoundType) => {
    if (activeSound === type) {
      audioSynth.stop();
      setActiveSound(null);
    } else {
      audioSynth.play(type);
      setActiveSound(type);
    }
  };

  const handleStopAll = () => {
    audioSynth.stop();
    setActiveSound(null);
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    audioSynth.setVolume(newVal);
  };

  // Breathing timer & phases
  useEffect(() => {
    let breathInterval: number | undefined;
    let timerInterval: number | undefined;

    if (isBreathingActive) {
      // 4s Inhale, 4s Exhale (8s cycle)
      breathInterval = window.setInterval(() => {
        setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
      }, 4000);

      timerInterval = window.setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathSecondsLeft(60);
      setBreathPhase('inhale');
    }

    return () => {
      if (breathInterval) clearInterval(breathInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isBreathingActive]);

  const soundOptions = [
    {
      id: 'rain' as SoundType,
      title: '처마 밑 시골 빗소리',
      desc: '마음의 열기를 식혀주는 시원하고 부드러운 빗소리',
      icon: CloudRain,
      bg: 'from-blue-900 to-indigo-950',
      activeColor: 'border-blue-400 bg-blue-950 text-blue-100',
    },
    {
      id: 'fire' as SoundType,
      title: '따뜻한 구들장 장작 타는 소리',
      desc: '시골 온돌방에서 타닥타닥 타오르는 포근한 장작불 소리',
      icon: Flame,
      bg: 'from-amber-900 to-orange-950',
      activeColor: 'border-orange-400 bg-orange-950 text-orange-100',
    },
    {
      id: 'stream' as SoundType,
      title: '맑은 시골 개울물과 바람',
      desc: '돌 틈을 흐르는 청량한 물결과 솔솔 부는 산들바람',
      icon: Waves,
      bg: 'from-teal-900 to-emerald-950',
      activeColor: 'border-teal-400 bg-teal-950 text-teal-100',
    },
    {
      id: 'chime' as SoundType,
      title: '은은한 산사 풍경 소리',
      desc: '처마 끝 바람에 실려 오는 청아한 풍경과 평화로운 종소리',
      icon: Bell,
      bg: 'from-stone-800 to-stone-950',
      activeColor: 'border-amber-300 bg-stone-900 text-amber-200',
    },
  ];

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

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-teal-800 via-emerald-800 to-stone-900 rounded-3xl p-5 sm:p-7 text-white shadow-md">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs sm:text-sm font-bold mb-2">
          <Wind className="w-4 h-4" />
          <span>마음이 어지럽고 잠이 오지 않을 때</span>
        </span>
        <h2 className={`font-black tracking-tight mb-2 ${getTitleSize()}`}>
          마음 토닥 라디오 &amp; 1분 숨쉬기
        </h2>
        <p className="text-teal-100 text-sm sm:text-base font-medium max-w-2xl">
          가슴이 답답하고 홀로 계실 때 편안한 자연의 소리를 켜두세요.
          복잡한 생각은 내려놓으시고, 1분 숨쉬기로 마음의 짐을 가볍게 털어내 보세요.
        </p>
      </div>

      {/* Nature Sounds Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-300/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className={`font-black text-stone-900 ${getTitleSize()}`}>
              마음을 어루만지는 4가지 자연의 소리
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              인터넷 데이터 소모 없이 바로 재생됩니다. 원하시는 소리를 눌러보세요.
            </p>
          </div>

          {activeSound && (
            <button
              type="button"
              onClick={handleStopAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Square className="w-4 h-4 fill-red-700" />
              <span>소리 끄기</span>
            </button>
          )}
        </div>

        {/* 4 Sound Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {soundOptions.map((opt) => {
            const Icon = opt.icon;
            const isPlaying = activeSound === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleToggleSound(opt.id)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex items-start gap-4 ${
                  isPlaying
                    ? `${opt.activeColor} shadow-md scale-[1.01]`
                    : 'bg-stone-50 hover:bg-amber-50/80 border-stone-200 hover:border-amber-300 text-stone-800'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isPlaying ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-black text-base sm:text-lg tracking-tight">
                      {opt.title}
                    </h4>
                    {isPlaying && (
                      <span className="flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                        <Volume2 className="w-3 h-3" /> 재생 중
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-sm ${
                      isPlaying ? 'text-stone-200' : 'text-stone-600'
                    }`}
                  >
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume Slider Bar */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-700 font-bold text-sm sm:text-base">
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <label htmlFor="volume-slider">소리 크기 조절:</label>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 mr-2">
              {[
                { label: '조용히', val: 0.3 },
                { label: '보통', val: 0.6 },
                { label: '크게', val: 1.0 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleVolumeChange(p.val)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    Math.abs(volume - p.val) < 0.1
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-400">작게</span>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-28 sm:w-36 h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <span className="text-xs text-stone-400">크게</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 1-Minute Mindful Breathing */}
      <div className="bg-gradient-to-b from-[#f9f7f2] to-[#f4f0e6] rounded-3xl p-5 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6 text-center">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            심신 안정 1분 호흡
          </span>
          <h3 className={`font-black text-stone-900 mt-1 ${getTitleSize()}`}>
            가슴이 답답할 때 '1분 마음 숨쉬기'
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            화면의 둥근 원이 커질 때 숨을 들이마시고, 작아질 때 숨을 천천히 내쉽니다.
          </p>
        </div>

        {/* Breathing Circle Visualization */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Pulsating breathing circle */}
            <div
              className={`absolute rounded-full transition-all duration-4000 ease-in-out flex items-center justify-center shadow-lg ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-90 scale-105'
                    : 'w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-tr from-amber-600 to-amber-500 opacity-80 scale-90'
                  : 'w-44 h-44 bg-gradient-to-tr from-stone-400 to-stone-500 opacity-50'
              }`}
            ></div>

            {/* Inner Content Badge */}
            <div className="relative z-10 text-white p-4">
              {isBreathingActive ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black mb-1 drop-shadow-md">
                    {breathPhase === 'inhale' ? '들이마시기' : '내쉬기'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold bg-black/30 px-3 py-1 rounded-full inline-block backdrop-blur-xs">
                    남은 시간: {breathSecondsLeft}초
                  </div>
                </>
              ) : (
                <div className="text-stone-800 font-bold text-sm sm:text-base bg-white/90 p-4 rounded-2xl shadow-sm">
                  아래 [숨쉬기 시작]을
                  <br />
                  눌러보세요
                </div>
              )}
            </div>
          </div>

          {/* Current Phase Instruction Text */}
          <div className="mt-4 max-w-md mx-auto">
            {isBreathingActive ? (
              <p className="text-base sm:text-lg font-bold text-stone-800 font-serif-kr">
                {breathPhase === 'inhale' ? (
                  <span className="text-emerald-800">
                    "가슴을 활짝 펴며 맑고 깨끗한 숨을 천천히 들이마십니다 (4초)"
                  </span>
                ) : (
                  <span className="text-amber-900">
                    "가슴속 맺힌 근심과 답답함을 멀리 후- 하고 내쉽니다 (4초)"
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-stone-500">
                하루 1분의 호흡만으로도 심장 박동이 편안해지고 혈압이 안정됩니다.
              </p>
            )}
          </div>
        </div>

        {/* Start / Stop Button */}
        <div className="flex justify-center gap-3">
          {!isBreathingActive ? (
            <button
              type="button"
              onClick={() => setIsBreathingActive(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base sm:text-lg shadow-md transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>1분 숨쉬기 시작</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsBreathingActive(false)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-700 hover:bg-stone-800 text-white font-black text-base sm:text-lg shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>숨쉬기 멈춤</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
