import React, { useState } from 'react';
import { FontSizeMode } from '../types';
import {
  Briefcase,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WelfareViewProps {
  fontSize: FontSizeMode;
}

export const WelfareView: React.FC<WelfareViewProps> = ({ fontSize }) => {
  // Simulator state
  const [nationalPension, setNationalPension] = useState<number>(35); // in 10,000 KRW
  const [openCardId, setOpenCardId] = useState<string | null>('job-1');

  // Basic pension base: 334,810 KRW (~33.5만원)
  // Threshold for reduction is ~520,000 KRW (52만원)
  const isCut = nationalPension >= 53;
  const basicPensionAmount = isCut
    ? Math.max(16.7, Math.round((33.5 - (nationalPension - 52) * 0.4) * 10) / 10)
    : 33.5;
  const totalPensionAmount = Math.round((nationalPension + basicPensionAmount) * 10) / 10;

  const toggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
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

  const getBodySize = () => {
    switch (fontSize) {
      case 'huge':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'large':
        return 'text-base sm:text-lg leading-relaxed';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-900 rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-amber-100 text-xs sm:text-sm font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>국가가 보장하는 어르신의 당당한 권리</span>
          </div>
          <h2 className={`font-black tracking-tight mb-2 ${getTitleSize()}`}>
            70대 시니어 일자리 &amp; 연금 팩트체크
          </h2>
          <p className="text-amber-100 text-sm sm:text-base font-medium max-w-2xl">
            "국민연금 50만 원 미만이면 기초연금이 깎일까?" 두려워 마세요.
            깎이지 않고 다 받으실 수 있는 팩트와, 당장 신청 가능한 일자리 비결을 전해드립니다.
          </p>
        </div>
      </div>

      {/* SECTION 1: Pension Fact Check & Simulator */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-300/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              팩트체크 핵심 정리
            </span>
            <h3 className={`font-black text-stone-900 ${getTitleSize()}`}>
              "국민연금 50만 원 미만, 기초연금 깎이나요?"
            </h3>
          </div>
        </div>

        {/* Big Clarification Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-lg sm:text-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span>답변: 절대 깎이지 않고 100% 온전히 다 받으십니다!</span>
          </div>
          <p className={`text-stone-700 font-medium ${getBodySize()}`}>
            국민연금 연계 감액 제도는 국민연금 수령액이 <strong>약 52만 원 이상</strong>일 때부터 일부 적용됩니다.
            따라서 <strong>50만 원 미만(예: 20만 원, 35만 원, 45만 원 등)</strong>을 받으시는 70대 어르신은 기초연금 감액 대상이 아니며,
            <strong>기초연금 최대 전액(월 약 33만 4천 원)</strong>을 온전히 수령하십니다.
          </p>
        </div>

        {/* Interactive Pension Simulator */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-stone-800 text-base sm:text-lg">
              내 국민연금액으로 직접 확인해 보기
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="pension-range" className="text-sm sm:text-base font-bold text-stone-700">
                현재 받고 계신 국민연금액:
              </label>
              <span className="text-lg sm:text-xl font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                월 {nationalPension}만 원
              </span>
            </div>

            {/* Quick preset buttons for easy one-tap calculation */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <span className="text-xs font-bold text-stone-500 mr-1">빠른 선택:</span>
              {[0, 20, 35, 45, 50, 60].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNationalPension(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    nationalPension === val
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                  }`}
                >
                  {val === 0 ? '0원(미수령)' : `${val}만 원`}
                </button>
              ))}
            </div>

            <input
              id="pension-range"
              type="range"
              min="0"
              max="80"
              step="5"
              value={nationalPension}
              onChange={(e) => setNationalPension(Number(e.target.value))}
              className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-xs text-stone-400 mt-1">
              <span>0원</span>
              <span className="font-bold text-stone-600">50만 원 기준선</span>
              <span>80만 원</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 font-bold block">국민연금</span>
              <span className="text-lg sm:text-xl font-bold text-stone-800">
                {nationalPension}만 원
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 font-bold block">
                기초연금 수령액
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-700">
                +{basicPensionAmount}만 원
              </span>
              <span className="text-[11px] block text-emerald-600 font-medium mt-0.5">
                {isCut ? '일부 감액 적용' : '감액 없음 (전액 수령)'}
              </span>
            </div>

            <div className="p-3 bg-emerald-800 text-white rounded-xl text-center shadow-xs">
              <span className="text-xs text-emerald-200 font-bold block">
                매월 총 수령 연금합계
              </span>
              <span className="text-xl sm:text-2xl font-black">
                약 {totalPensionAmount}만 원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Government Senior Jobs for 70s */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              일하고 싶은 노년의 길잡이
            </span>
            <h3 className={`font-black text-stone-900 ${getTitleSize()}`}>
              70대 어르신을 위한 정부 지원 일자리 3종
            </h3>
          </div>
        </div>

        {/* Golden Tip Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-stone-800">
          <div className="flex items-center gap-2 text-amber-900 font-black text-base sm:text-lg mb-1">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>⭐ 70대 어르신 필승 일자리 꿀팁: '대기자 등록'</span>
          </div>
          <p className={`text-stone-700 font-medium ${getBodySize()}`}>
            "연말 11~12월 정기 모집이 끝났다고 낙담하지 마세요!" 노인일자리는 어르신들의 건강 사정이나 이사 등으로 <strong>연중 수시로 빈자리(결원)</strong>가 생깁니다.
            지금 바로 관할 <strong>동 주민센터 복지팀</strong>이나 <strong>'시니어클럽'</strong>에 가셔서 <strong>"일자리 대기자 명부에 등록해 주세요"</strong>라고 말씀해 두시면 빈자리가 생기는 즉시 연락이 옵니다.
          </p>
        </div>

        {/* 3 Job Types Cards */}
        <div className="space-y-3 pt-2">
          {/* Job 1 */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCard('job-1')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs sm:text-sm font-bold">
                  월 29만 원
                </span>
                <div>
                  <h4 className="font-black text-stone-900 text-base sm:text-lg">
                    1. 노인 공익활동 지원사업 (가장 인기)
                  </h4>
                  <p className="text-xs text-stone-500">
                    만 65세 이상 기초연금 수급자 / 하루 3시간, 월 10일 (총 30시간)
                  </p>
                </div>
              </div>
              {openCardId === 'job-1' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>

            {openCardId === 'job-1' && (
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-2 text-stone-700">
                <p className={getBodySize()}>
                  <strong>주요 활동:</strong> 초등학교 스쿨존 교통안전 지킴이, 동네 공원 및 골목길 환경 정화, 거동이 불편한 독거 어르신 안부 묻기(노노케어), 공공시설 도우미.
                </p>
                <p className={getBodySize()}>
                  <strong>장점:</strong> 하루 3시간씩 한 달에 딱 10일만 활동하므로 70대 어르신의 관절이나 체력에 무리가 가지 않으며, 또래 어르신들과 말벗을 하며 건강과 용돈을 동시에 챙길 수 있습니다.
                </p>
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl font-bold">
                  신청처: 거주지 관할 주민센터 사회복지과, 대한노인회 지회, 종합사회복지관
                </div>
              </div>
            )}
          </div>

          {/* Job 2 */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCard('job-2')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-700 text-white text-xs sm:text-sm font-bold">
                  월 약 76만 원
                </span>
                <div>
                  <h4 className="font-black text-stone-900 text-base sm:text-lg">
                    2. 사회서비스형 일자리 (수입이 쏠쏠한 일터)
                  </h4>
                  <p className="text-xs text-stone-500">
                    만 65세 이상 (일부 60세) / 주 15시간, 월 60시간 활동
                  </p>
                </div>
              </div>
              {openCardId === 'job-2' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>

            {openCardId === 'job-2' && (
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-2 text-stone-700">
                <p className={getBodySize()}>
                  <strong>주요 활동:</strong> 국공립 어린이집 보육 보조, 보건소·노인복지관 안내 행정보조, 시니어 안전 순찰, 장애인 시설 도우미.
                </p>
                <p className={getBodySize()}>
                  <strong>장점:</strong> 주휴수당과 4대 보험이 적용되어 월 약 76만 원 상당의 실질적인 수입을 얻을 수 있어 생활비에 매우 큰 보탬이 됩니다.
                </p>
                <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl font-bold">
                  신청처: 지역 시니어클럽, 노인종합복지관
                </div>
              </div>
            )}
          </div>

          {/* Job 3 */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCard('job-3')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-teal-800 text-white text-xs sm:text-sm font-bold">
                  수익금 배분
                </span>
                <div>
                  <h4 className="font-black text-stone-900 text-base sm:text-lg">
                    3. 시장형 사업단 (경험과 손재주 활용)
                  </h4>
                  <p className="text-xs text-stone-500">
                    만 60세 이상 / 실버카페, 공동작업장, 특산물 포장
                  </p>
                </div>
              </div>
              {openCardId === 'job-3' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>

            {openCardId === 'job-3' && (
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-2 text-stone-700">
                <p className={getBodySize()}>
                  <strong>주요 활동:</strong> 실버카페 음료 제조, 참기름·두부 등 식품 제조 및 소포장, 아파트 단지 택배 거점 배송 도우미, 의류 리폼.
                </p>
                <p className={getBodySize()}>
                  <strong>장점:</strong> 나이 제한이 비교적 너그럽고, 과거 직장이나 살림 경륜을 발휘하며 일하는 보람을 누릴 수 있습니다.
                </p>
                <div className="text-xs text-teal-800 bg-teal-50 p-2.5 rounded-xl font-bold">
                  신청처: 지역 시니어클럽 (전국 190여 개소 운영 중)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Missed 5 Living Expense Benefits */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-200 shadow-sm space-y-4">
        <h3 className={`font-black text-stone-900 ${getTitleSize()}`}>
          놓치면 큰 손해! 70대 어르신 생활비 절감 5대 혜택
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-xs font-bold text-amber-900 block">
              1. 휴대전화 요금 월 최대 12,100원 감면
            </span>
            <p className="text-xs sm:text-sm text-stone-700">
              기초연금 받으시는 분은 스마트폰에서 <strong>114(고객센터)</strong>로 전화하셔서 "기초연금 통신비 감면 신청해주세요"라고 말씀하시면 다음 달부터 매달 최대 12,100원이 요금에서 빠집니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
            <span className="text-xs font-bold text-emerald-900 block">
              2. 전국 도시철도(지하철) 100% 무임승차
            </span>
            <p className="text-xs sm:text-sm text-stone-700">
              만 65세 이상 어르신은 주민센터나 지정 은행에서 '어르신 우대용 교통카드'를 발급받으시면 전국 모든 지하철과 전철을 무료로 타실 수 있습니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-xs font-bold text-stone-800 block">
              3. 동네 의원 외래 진료비 본인부담금 대폭 경감
            </span>
            <p className="text-xs sm:text-sm text-stone-700">
              동네 의원(내과, 정형외과, 이비인후과 등)에서 진료비 총액 1만 5천 원 이하 시 본인부담금 1,500원만 내시면 됩니다. 병원비 겁내지 마시고 편히 진료받으세요.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-xs font-bold text-stone-800 block">
              4. 겨울철 난방비 &amp; 전기요금 에너지바우처
            </span>
            <p className="text-xs sm:text-sm text-stone-700">
              소득인정액 기준 충족 시 동절기 난방비(가스·연탄·등유)와 하절기 전기요금을 국가에서 대신 납부해 드립니다. (주민센터 신청)
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Direct Welfare Phone Numbers */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-md space-y-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            원터치 무료 전화 연결
          </span>
          <h3 className={`font-black text-white ${getTitleSize()}`}>
            어르신을 위한 직통 무료 복지 전화번호
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            누르시면 휴대전화 통화 화면으로 바로 연결됩니다. 통화료는 무료이거나 표준 요금입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:129"
            className="flex items-center justify-between p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-bold text-white text-base sm:text-lg">
                보건복지상담센터
              </div>
              <div className="text-xs text-stone-400">
                기초연금, 에너지바우처, 생활지원금 종합상담
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-black text-sm group-hover:bg-amber-500">
              <PhoneCall className="w-4 h-4" />
              <span>☎ 129</span>
            </div>
          </a>

          <a
            href="tel:15443388"
            className="flex items-center justify-between p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-bold text-white text-base sm:text-lg">
                노인일자리 상담센터
              </div>
              <div className="text-xs text-stone-400">
                내 동네 노인일자리 공석 및 참여 기관 안내
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm group-hover:bg-emerald-500">
              <PhoneCall className="w-4 h-4" />
              <span>☎ 1544-3388</span>
            </div>
          </a>

          <a
            href="tel:16612129"
            className="flex items-center justify-between p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-bold text-white text-base sm:text-lg">
                독거노인 마음안심콜
              </div>
              <div className="text-xs text-stone-400">
                홀로 계신 어르신 안부 확인 및 따뜻한 말벗
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-black text-sm group-hover:bg-teal-500">
              <PhoneCall className="w-4 h-4" />
              <span>☎ 1661-2129</span>
            </div>
          </a>

          <a
            href="tel:110"
            className="flex items-center justify-between p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-bold text-white text-base sm:text-lg">
                정부민원 종합콜센터
              </div>
              <div className="text-xs text-stone-400">
                동 주민센터 민원, 신분증, 행정 절차 안내
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-600 text-white font-black text-sm group-hover:bg-stone-500">
              <PhoneCall className="w-4 h-4" />
              <span>☎ 110</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
