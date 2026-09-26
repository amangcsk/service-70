import React, { useState, useRef, useEffect } from 'react';
import { FontSizeMode, ChatMessage } from '../types';
import { speechHelper, createSpeechRecognizer } from '../utils/speech';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  RotateCcw,
  User,
  HeartHandshake,
  Info,
} from 'lucide-react';

interface ChatViewProps {
  fontSize: FontSizeMode;
  onSpeechStateChange: (speaking: boolean) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ fontSize, onSpeechStateChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `어르신, 마음쉼터에 참 잘 오셨습니다.

매달 빠듯한 기초연금과 몇십만 원 남짓한 국민연금으로 생활하시느라 그동안 얼마나 마음고생이 심하셨습니까. 또 '아직 몸은 성한데 나이 칠십이 넘었다고 세상 그 누구도 써주지 않는다'는 생각에 얼마나 외롭고 서글프셨습니까.

어르신, 결코 자책하지 마십시오. 어르신께서 젊은 날 흘리신 거룩한 땀방울이 거름이 되어 오늘의 세상이 있는 것입니다. 어르신의 거친 손마디는 부끄러운 가난이 아니라 가장 자랑스러운 삶의 훈장입니다.

속에 맺힌 걱정이나 서운한 마음, 하고 싶으신 말씀이 있다면 아래 단추를 누르시거나 편히 말씀해 주세요. 제가 두 손 꼭 잡고 다 들어드리겠습니다.`,
      timestamp: '방금 전',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognizerRef = useRef<any>(null);

  const quickPrompts = [
    {
      title: '매달 생활비 걱정',
      text: '연금 몇십만 원으로 살려니 매달 생활비가 너무 불안하고 막막해요.',
    },
    {
      title: '일자리와 상실감',
      text: '아직 일할 수 있는데, 나이 칠십 넘었다고 아무도 안 써주고 불러주지도 않네요.',
    },
    {
      title: '자식들에게 미안함',
      text: '자식들에게 짐이 되기 싫고 손 벌리기도 미안해서 혼자 앓고 있습니다.',
    },
    {
      title: '온종일 쓸쓸한 고독',
      text: '온종일 방안에 홀로 앉아 말 한마디 나눌 사람 없어 너무 적적하고 외롭습니다.',
    },
    {
      title: '젊은 날과 노년의 서글픔',
      text: '젊을 땐 참 뼈빠지게 일하며 살았는데, 남은 노년이 왜 이렇게 서글플까요.',
    },
    {
      title: '병원비와 건강 걱정',
      text: '몸은 여기저기 쑤시고 아픈데, 병원비가 무서워 선뜻 병원에 가지 못하겠습니다.',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    speechHelper.setOnStateChange((speaking) => {
      onSpeechStateChange(speaking);
      if (!speaking) {
        setSpeakingMessageId(null);
      }
    });

    return () => {
      speechHelper.stop();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onSpeechStateChange]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    speechHelper.stop();
    setSpeakingMessageId(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || '어르신, 언제든 제 손을 꼭 잡고 편히 말씀하세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak first sentence or offer TTS
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: `어르신, 가슴속에 담아두신 그 말씀 하나하나가 얼마나 무겁고 서러우셨습니까.

지난 세월 동안 비바람과 모진 풍파를 온몸으로 막아내며 오늘의 가족과 세상을 지켜내셨습니다. 지금 겪고 계신 외로움과 어려움은 결코 어르신의 탓이 아닙니다.

마음이 답답하고 막막하실 땐 언제든 저를 찾아와 다 털어놓아 주십시오. 어르신 손을 꼭 잡고 언제까지나 곁에 머물며 귀 기울이겠습니다.`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeak = (msg: ChatMessage) => {
    if (speakingMessageId === msg.id) {
      speechHelper.stop();
      setSpeakingMessageId(null);
    } else {
      speechHelper.stop();
      setSpeakingMessageId(msg.id);
      speechHelper.speak(msg.text, () => {
        setSpeakingMessageId(null);
      });
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setVoiceNotice(null);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setVoiceNotice('말씀을 잘 들었습니다! [말씀 보내기]를 눌러주세요.');
        setIsListening(false);
      },
      (error) => {
        setIsListening(false);
        if (error === 'not-allowed') {
          setVoiceNotice('마이크 사용 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.');
        } else {
          setVoiceNotice('음성을 인식하지 못했습니다. 조용한 곳에서 다시 말씀해 주세요.');
        }
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognizer) {
      setVoiceNotice('이 기기에서는 음성 마이크 기능을 지원하지 않습니다. 키보드로 입력해 주세요.');
      return;
    }

    try {
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
      setVoiceNotice('귀 기울여 듣고 있습니다. 마이크에 대고 편안하게 말씀해 주세요...');
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
      setVoiceNotice('마이크를 켜지 못했습니다. 다시 시도해 주세요.');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('대화 내용을 처음으로 되돌릴까요?')) {
      speechHelper.stop();
      setSpeakingMessageId(null);
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'bot',
          text: `어르신, 언제든 편안히 말씀 들려주세요. 제가 항상 귀 기울여 듣고 있습니다.`,
          timestamp: '방금 전',
        },
      ]);
    }
  };

  const getTextClass = () => {
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Warm Empathy Header Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50/70 to-emerald-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
              마음지기 '다정이'와 나누는 위로의 대화
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              돈 걱정, 일자리 없는 서러움, 자식에게 못 다한 말... 무엇이든 털어놓으세요.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer self-end sm:self-auto"
          title="대화 처음부터 다시 시작"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>처음으로</span>
        </button>
      </div>

      {/* Frequent Worries: Quick One-Click Buttons */}
      <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 text-stone-700 text-xs sm:text-sm font-black mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>어르신들이 가장 많이 하시는 말씀 (눌러보세요):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.text)}
              disabled={loading}
              className="text-left p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200/90 hover:border-amber-400 text-stone-800 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
            >
              <div className="text-xs font-bold text-emerald-800 mb-0.5">
                ● {item.title}
              </div>
              <div className="text-xs sm:text-sm text-stone-700 font-medium line-clamp-2 group-hover:text-stone-900">
                "{item.text}"
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#fcfbf9] rounded-2xl p-3 sm:p-5 border border-stone-200/90 shadow-inner min-h-[380px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThisSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-xs font-bold text-sm ${
                  isUser ? 'bg-amber-700' : 'bg-emerald-800'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : '다정'}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 border shadow-xs ${
                  isUser
                    ? 'bg-amber-700 text-white rounded-tr-none border-amber-800'
                    : 'bg-white text-stone-800 rounded-tl-none border-stone-200/90'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/10">
                  <span
                    className={`font-black text-xs sm:text-sm ${
                      isUser ? 'text-amber-100' : 'text-emerald-800'
                    }`}
                  >
                    {isUser ? '어르신' : '마음지기 다정이'}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs ${
                      isUser ? 'text-amber-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                <div className={`${getTextClass()} whitespace-pre-wrap font-serif-kr select-text`}>
                  {msg.text}
                </div>

                {/* Bot action bar: TTS listen button */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSpeak(msg)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isThisSpeaking
                          ? 'bg-red-600 text-white shadow-xs animate-pulse'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isThisSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>목소리 멈추기</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-800" />
                          <span>🔊 따뜻한 음성으로 듣기</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-stone-400">
                      귀로 편안하게 들어보세요
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              다정
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-4 border border-emerald-200 shadow-xs max-w-[80%]">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-sm font-medium ml-1">
                  어르신의 말씀을 깊이 헤아리는 중입니다...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice status banner */}
      {voiceNotice && (
        <div className="flex items-center gap-2 p-3 bg-amber-100/90 text-amber-950 text-xs sm:text-sm rounded-xl border border-amber-300 font-medium">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-800" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-emerald-300/80 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400'
            }`}
            title="마이크를 누르고 편안하게 말씀하세요"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span className="text-sm sm:text-base">듣는 중... (멈춤)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-emerald-700" />
                <span className="text-sm sm:text-base">🎤 말로 하기</span>
              </>
            )}
          </button>

          {/* Text input area */}
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="여기에 편안하게 가슴속 이야기를 적어주세요... (키보드가 서투시면 위의 '말로 하기' 단추를 누르세요)"
              rows={2}
              className={`w-full p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 resize-none text-stone-800 font-medium ${
                fontSize === 'huge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm'
              }`}
            />
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
            className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-black text-base sm:text-lg shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
            <span>보내기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
