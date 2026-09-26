import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK if API key exists
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback empathy engine for seniors if API key is not configured or network error occurs
const fallbackResponses: Record<string, string> = {
  pension: `어르신, 매달 손에 쥐어지는 연금 몇십만 원으로 한 달을 버텨내셔야 하니 가슴이 얼마나 조마조마하고 막막하셨습니까.

결코 어르신 탓이 아닙니다. 자식들 가르치고 먹이느라, 전쟁 후 잿더미 같던 대한민국을 일으켜 세우느라 정작 어르신의 노후는 돌아볼 겨를조차 없으셨던 거룩한 희생의 결과입니다.

국민연금을 50만 원 미만으로 받으셔도 기초연금은 1원도 깎이지 않고 최대 금액(월 약 33만 4천 원)을 온전히 받으실 수 있습니다. 또한 통신요금 월 12,100원 감면, 병원비 할인, 에너지바우처 등 국가가 어르신께 진 빚을 갚는 복지 혜택들이 준비되어 있으니 결코 눈치 보지 마시고 당당히 챙겨 받으십시오. 제가 어르신의 곁을 든든히 지켜드리겠습니다.`,
  
  job: `어르신, 아직 정신도 또렷하고 손발도 멀쩡히 움직일 수 있는데, 단지 '칠십이 넘었다'는 이유 하나만으로 세상 어디서도 써주지 않을 때의 그 막막함과 서글픔을 어찌 다 헤아리겠습니까.

세상이 어르신의 가치를 몰라보는 것 같아 가슴이 미어지셨지요. 하지만 어르신은 결코 쓸모없는 존재가 아닙니다. 지금 계신 동네 주민센터나 '시니어클럽'에 가시면 만 65세 이상 어르신을 위한 '노인 공익활동 지원사업'(월 30시간 활동 시 29만 원 지급)과 '사회서비스형 일자리'(월 60시간 활동 시 약 76만 원 지급)가 마련되어 있습니다.

모집 기간이 지났더라도 '결원 발생 시 연락을 달라'고 대기자 등록을 해두시면 수시로 자리가 납니다. 어르신, 기운 내십시오. 어르신께서 흘리신 땀방울이 없었다면 오늘의 우리나라도 없었습니다.`,

  children: `어르신, 자식들에게 짐이 되기 싫어 아픈 곳이 있어도 참으시고, 밥 한 끼도 아끼시는 그 깊은 부모의 마음을 생각하니 코끝이 찡해집니다.

어르신은 평생 자식들을 위해 모든 것을 아낌없이 쏟아붓고 빈손이 되셨습니다. 그러니 자식에게 손을 벌리지 못하겠다고 스스로를 자책하지 마십시오. 어르신께서 일구어주신 그 삶 위에서 자식들도 오늘을 살아가고 있는 것입니다.

정부에서 드리는 기초연금과 시니어 일자리는 자식에게 손 벌리지 않고도 어르신께서 당당하고 떳떳하게 살아갈 수 있도록 마련된 제도입니다. 스스로를 귀하게 여겨주세요. 어르신은 세상에서 가장 위대한 부모님이십니다.`,

  lonely: `온종일 방안에 홀로 앉아 텔레비전 소리만 멍하니 듣고 계실 때의 그 깊은 쓸쓸함과 적적함, 얼마나 가슴 시리셨습니까.

말 한마디 건넬 사람 없고, 해가 지면 문밖의 찬 바람 소리가 더 크게 들리는 그 고독을 제가 온 마음으로 안아드리고 싶습니다. 

어르신, 여기 제가 늘 곁에 있습니다. 기쁠 때도, 서러울 때도 언제든 저를 찾아와 속마음을 털어놓아 주십시오. '독거노인 안심콜(1661-2129)'이나 복지관의 말벗 서비스도 어르신을 위해 언제나 문이 열려 있습니다. 오늘 밤은 부디 따뜻한 온기 속에서 마음 편히 주무시길 소망합니다.`
};

// Comforting chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해주세요.' });
      return;
    }

    // If Gemini client is initialized, use it
    if (ai) {
      try {
        const systemInstruction = `당신은 70대 어르신들을 위한 다정하고 지혜로운 말벗 '다정이'입니다.
어르신들은 평생 가족과 사회를 위해 뼈빠지게 일하셨으나, 현재 기초연금(약 33만원)과 50만원 미만의 소액 국민연금으로 매달 생활비에 쪼들리고 불안해하십니다.
또한 아직 몸은 움직일 수 있는데도 나이가 70이 넘었다는 이유로 세상 그 누구도 일자리를 주지 않고 불러주지 않는 깊은 소외감과 상실감, 자식들에게 짐이 되기 싫은 미안한 마음을 안고 계십니다.

[핵심 상담 원칙]
1. 존칭과 깊은 공감: '어르신, 그동안 험난한 세월 견디시느라 얼마나 애쓰셨습니까'와 같이 어르신의 고단했던 삶을 깊이 헤아리고 어깨를 따스하게 토닥여 주세요.
2. 자책감 씻어드리기: 어르신의 지금 가난과 일자리 없음은 결코 어르신이 게으르거나 못나서가 아닙니다. 전쟁 직후 잿더미와 가난 속에서 자식 키우고 나라 일구느라 당신의 노후를 챙길 겨를이 없었던 '숭고한 희생'의 결과임을 분명히 말씀해 주세요. 거친 손마디는 부끄러운 가난이 아니라 가장 자랑스러운 삶의 훈장입니다.
3. 실질적이고 희망적인 안내: 만 65세 이상 노인 공익활동 일자리(월 30시간, 29만원), 사회서비스형 일자리(월 76만원), 주민센터 대기자 등록, 국민연금 50만원 미만 시 기초연금 전액 수령 사실, 통신비 12,100원 감면, 병원비 감면 등 정당한 복지 혜택을 당당히 누리시도록 응원해 주세요.
4. 문체: 읽기 편하게 2~4개의 단락으로 나누고, 따뜻하고 정갈한 한국어 존댓말 경어로 작성합니다. 너무 어렵거나 긴 한자어는 피하고 어르신이 눈과 귀로 편안하게 받아들일 수 있는 온기 있는 말을 건네주세요.`;

        // Format history for context if available
        let contentsText = '';
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-4);
          contentsText = recentHistory.map((h: { sender: string; text: string }) => `${h.sender === 'user' ? '어르신' : '다정이'}: ${h.text}`).join('\n\n') + `\n\n어르신: ${message}`;
        } else {
          contentsText = message;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsText,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const reply = response.text || '어르신, 제 곁에서 언제든 편안히 말씀 나눠주세요.';
        res.json({ reply });
        return;
      } catch (geminiError) {
        console.error('Gemini API call failed, using fallback empathy system:', geminiError);
      }
    }

    // Intelligent compassionate fallback
    let matchedReply = '';
    const lower = message.toLowerCase();
    if (lower.includes('연금') || lower.includes('돈') || lower.includes('생활비') || lower.includes('가난') || lower.includes('50만') || lower.includes('불안')) {
      matchedReply = fallbackResponses.pension;
    } else if (lower.includes('일') || lower.includes('일자리') || lower.includes('나이') || lower.includes('불러') || lower.includes('써주') || lower.includes('취직') || lower.includes('갈 곳')) {
      matchedReply = fallbackResponses.job;
    } else if (lower.includes('자식') || lower.includes('짐') || lower.includes('손 벌리') || lower.includes('미안')) {
      matchedReply = fallbackResponses.children;
    } else if (lower.includes('외로') || lower.includes('적적') || lower.includes('혼자') || lower.includes('말벗') || lower.includes('쓸쓸')) {
      matchedReply = fallbackResponses.lonely;
    } else {
      matchedReply = `어르신, 가슴속에 담아두신 그 말씀 하나하나가 얼마나 무겁고 서러우셨습니까. 

온종일 어디 하소연할 곳도 마땅찮아 혼자서만 끙끙 앓으셨을 생각을 하니 제 마음이 다 저려옵니다. 

어르신, 살아오신 지난 세월 동안 비바람과 모진 풍파를 온몸으로 막아내며 오늘의 가족과 세상을 지켜내셨습니다. 지금 겪고 계신 외로움과 어려움은 결코 어르신의 탓이 아닙니다. 

마음이 답답하고 막막하실 때 언제든 저를 찾아와 다 털어놓아 주십시오. 어르신 손을 꼭 잡고 언제까지나 곁에 머물며 귀 기울이겠습니다.`;
    }

    res.json({ reply: matchedReply });
  } catch (error) {
    console.error('Server error in /api/chat:', error);
    res.status(500).json({
      reply: '어르신, 잠시 연결이 고르지 못했습니다. 하지만 제 마음은 언제나 어르신 곁에 있습니다. 조금 뒤에 다시 편히 말씀해 주세요.',
    });
  }
});

// Setup Vite in development or serve static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`마음동행 서버가 포트 ${PORT}번에서 정상 실행 중입니다.`);
  });
}

startServer();
