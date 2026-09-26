export type FontSizeMode = 'normal' | 'large' | 'huge';

export type TabType = 'chat' | 'welfare' | 'radio' | 'letter';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  mood: 'peaceful' | 'lonely' | 'grateful' | 'hopeful';
  text: string;
}

export interface WelfareItem {
  id: string;
  category: 'job' | 'pension' | 'saving' | 'call';
  title: string;
  badge: string;
  summary: string;
  details: string[];
  contact?: string;
  callNumber?: string;
}
